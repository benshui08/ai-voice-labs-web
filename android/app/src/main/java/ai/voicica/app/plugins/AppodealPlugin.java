package ai.voicica.app.plugins;

import android.graphics.Color;
import android.graphics.PixelFormat;
import android.graphics.Typeface;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.appodeal.ads.Appodeal;
import com.appodeal.ads.RewardedVideoCallbacks;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Appodeal 广告插件
 *
 * 提供激励视频广告功能，支持连续播放多个广告
 * 包含顶部进度条和广告计数器显示
 */
@CapacitorPlugin(name = "Appodeal")
public class AppodealPlugin extends Plugin {

    private static final String TAG = "AppodealPlugin";
    private static final int DEFAULT_AD_COUNT = 2; // 默认连续播放广告数量
    private static final int PROGRESS_UPDATE_INTERVAL = 100; // 进度更新间隔（毫秒）
    private static final int ESTIMATED_AD_DURATION = 30000; // 预估广告时长（毫秒）

    private boolean isInitialized = false;
    private PluginCall pendingRewardCall = null;

    // 连续广告配置
    private int totalAdCount = DEFAULT_AD_COUNT;
    private int currentAdIndex = 0;
    private int completedAds = 0;
    private double totalRewardAmount = 0;
    private String rewardName = null;
    private boolean isAdSequenceRunning = false;

    // 悬浮层 UI
    private WindowManager windowManager = null;
    private LinearLayout overlayContainer = null;
    private TextView adCounterText = null;
    private ProgressBar progressBar = null;
    private Handler progressHandler = new Handler(Looper.getMainLooper());
    private Runnable progressRunnable = null;
    private long adStartTime = 0;

    /**
     * 初始化 Appodeal SDK
     */
    @PluginMethod
    public void initialize(PluginCall call) {
        String appKey = call.getString("appKey");
        Boolean testMode = call.getBoolean("testMode", false);

        if (appKey == null || appKey.isEmpty()) {
            call.reject("App key is required");
            return;
        }

        if (isInitialized) {
            Log.d(TAG, "Appodeal already initialized");
            call.resolve();
            return;
        }

        getActivity().runOnUiThread(() -> {
            try {
                Appodeal.setTesting(testMode);
                Appodeal.setUseSafeArea(true);
                Appodeal.setAutoCache(Appodeal.REWARDED_VIDEO, true);

                setupRewardedVideoCallbacks();

                Appodeal.initialize(
                    getActivity(),
                    appKey,
                    Appodeal.REWARDED_VIDEO
                );

                isInitialized = true;
                Log.d(TAG, "Appodeal initialized successfully");
                call.resolve();

            } catch (Exception e) {
                Log.e(TAG, "Failed to initialize Appodeal", e);
                call.reject("Failed to initialize Appodeal: " + e.getMessage());
            }
        });
    }

    /**
     * 设置连续播放广告数量
     */
    @PluginMethod
    public void setAdCount(PluginCall call) {
        Integer count = call.getInt("count", DEFAULT_AD_COUNT);
        if (count != null && count > 0 && count <= 5) {
            totalAdCount = count;
            Log.d(TAG, "Ad count set to " + totalAdCount);
            call.resolve();
        } else {
            call.reject("Invalid ad count. Must be between 1 and 5.");
        }
    }

    /**
     * 检查悬浮窗权限
     */
    @PluginMethod
    public void checkOverlayPermission(PluginCall call) {
        boolean hasPermission = canDrawOverlays();
        JSObject result = new JSObject();
        result.put("hasPermission", hasPermission);
        call.resolve(result);
    }

    /**
     * 请求悬浮窗权限
     */
    @PluginMethod
    public void requestOverlayPermission(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(getContext())) {
                try {
                    android.content.Intent intent = new android.content.Intent(
                        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        android.net.Uri.parse("package:" + getContext().getPackageName())
                    );
                    getActivity().startActivity(intent);
                    call.resolve();
                } catch (Exception e) {
                    Log.e(TAG, "Failed to open overlay permission settings", e);
                    call.reject("Failed to open settings: " + e.getMessage());
                }
            } else {
                call.resolve();
            }
        } else {
            call.resolve();
        }
    }

    /**
     * 设置激励视频回调
     */
    private void setupRewardedVideoCallbacks() {
        Appodeal.setRewardedVideoCallbacks(new RewardedVideoCallbacks() {
            @Override
            public void onRewardedVideoLoaded(boolean isPrecache) {
                Log.d(TAG, "Rewarded video loaded, isPrecache: " + isPrecache);
                notifyListeners("rewardedVideoLoaded", new JSObject().put("isPrecache", isPrecache));
            }

            @Override
            public void onRewardedVideoFailedToLoad() {
                Log.e(TAG, "Rewarded video failed to load");
                notifyListeners("rewardedVideoFailedToLoad", new JSObject());

                if (isAdSequenceRunning) {
                    // 加载失败，结束广告序列
                    finishAdSequence(false, "Failed to load ad");
                }
            }

            @Override
            public void onRewardedVideoShown() {
                Log.d(TAG, "Rewarded video shown, ad " + (currentAdIndex + 1) + " of " + totalAdCount);
                notifyListeners("rewardedVideoShown", new JSObject());

                adStartTime = System.currentTimeMillis();
                updateOverlayUI();
                startProgressUpdate();
            }

            @Override
            public void onRewardedVideoShowFailed() {
                Log.e(TAG, "Rewarded video show failed");
                notifyListeners("rewardedVideoShowFailed", new JSObject());

                if (isAdSequenceRunning) {
                    finishAdSequence(false, "Failed to show ad");
                }
            }

            @Override
            public void onRewardedVideoFinished(double amount, String name) {
                Log.d(TAG, "Rewarded video finished, amount: " + amount + ", name: " + name);
                JSObject data = new JSObject();
                data.put("amount", amount);
                data.put("name", name);
                notifyListeners("rewardedVideoFinished", data);

                // 累计奖励
                totalRewardAmount += amount;
                rewardName = name;
                completedAds++;
            }

            @Override
            public void onRewardedVideoClosed(boolean finished) {
                Log.d(TAG, "Rewarded video closed, finished: " + finished +
                      ", completed: " + completedAds + "/" + totalAdCount);

                stopProgressUpdate();

                JSObject data = new JSObject();
                data.put("finished", finished);
                notifyListeners("rewardedVideoClosed", data);

                if (isAdSequenceRunning) {
                    currentAdIndex++;

                    // 检查是否还有更多广告要播放
                    if (currentAdIndex < totalAdCount && finished) {
                        // 延迟一下再播放下一个广告
                        new Handler(Looper.getMainLooper()).postDelayed(() -> {
                            showNextAd();
                        }, 500);
                    } else {
                        // 广告序列结束
                        finishAdSequence(completedAds > 0, null);
                    }
                }
            }

            @Override
            public void onRewardedVideoExpired() {
                Log.d(TAG, "Rewarded video expired");
                notifyListeners("rewardedVideoExpired", new JSObject());
            }

            @Override
            public void onRewardedVideoClicked() {
                Log.d(TAG, "Rewarded video clicked");
                notifyListeners("rewardedVideoClicked", new JSObject());
            }
        });
    }

    /**
     * 检查激励视频是否已加载
     */
    @PluginMethod
    public void isRewardedVideoLoaded(PluginCall call) {
        boolean isLoaded = Appodeal.isLoaded(Appodeal.REWARDED_VIDEO);
        JSObject result = new JSObject();
        result.put("isLoaded", isLoaded);
        call.resolve(result);
    }

    /**
     * 显示激励视频广告（连续播放）
     */
    @PluginMethod
    public void showRewardedVideo(PluginCall call) {
        if (!isInitialized) {
            call.reject("Appodeal not initialized");
            return;
        }

        if (isAdSequenceRunning) {
            call.reject("Ad sequence already running");
            return;
        }

        // 重置状态
        currentAdIndex = 0;
        completedAds = 0;
        totalRewardAmount = 0;
        rewardName = null;
        isAdSequenceRunning = true;
        pendingRewardCall = call;

        // 显示悬浮层
        showOverlay();

        // 开始播放广告
        showNextAd();
    }

    /**
     * 显示下一个广告
     */
    private void showNextAd() {
        getActivity().runOnUiThread(() -> {
            if (Appodeal.isLoaded(Appodeal.REWARDED_VIDEO)) {
                Log.d(TAG, "Showing ad " + (currentAdIndex + 1) + " of " + totalAdCount);
                updateOverlayUI();
                boolean shown = Appodeal.show(getActivity(), Appodeal.REWARDED_VIDEO);
                if (!shown) {
                    finishAdSequence(completedAds > 0, "Failed to show ad");
                }
            } else {
                Log.d(TAG, "Ad not loaded, caching...");
                Appodeal.cache(getActivity(), Appodeal.REWARDED_VIDEO);

                // 等待广告加载（最多 10 秒）
                new Handler(Looper.getMainLooper()).postDelayed(() -> {
                    if (Appodeal.isLoaded(Appodeal.REWARDED_VIDEO)) {
                        showNextAd();
                    } else {
                        finishAdSequence(completedAds > 0, "Ad not available");
                    }
                }, 10000);
            }
        });
    }

    /**
     * 结束广告序列
     */
    private void finishAdSequence(boolean rewarded, String error) {
        isAdSequenceRunning = false;
        hideOverlay();

        if (pendingRewardCall != null) {
            JSObject result = new JSObject();
            result.put("rewarded", rewarded);
            result.put("completedAds", completedAds);
            result.put("totalAds", totalAdCount);
            if (rewarded) {
                result.put("amount", totalRewardAmount);
                result.put("name", rewardName);
            }
            if (error != null) {
                result.put("error", error);
            }
            pendingRewardCall.resolve(result);
            pendingRewardCall = null;
        }

        // 重置状态
        currentAdIndex = 0;
        completedAds = 0;
        totalRewardAmount = 0;
        rewardName = null;
    }

    /**
     * 手动缓存激励视频
     */
    @PluginMethod
    public void cacheRewardedVideo(PluginCall call) {
        if (!isInitialized) {
            call.reject("Appodeal not initialized");
            return;
        }

        getActivity().runOnUiThread(() -> {
            Appodeal.cache(getActivity(), Appodeal.REWARDED_VIDEO);
            call.resolve();
        });
    }

    /**
     * 检查是否可以显示广告
     */
    @PluginMethod
    public void canShow(PluginCall call) {
        boolean canShow = Appodeal.canShow(Appodeal.REWARDED_VIDEO);
        JSObject result = new JSObject();
        result.put("canShow", canShow);
        call.resolve(result);
    }

    // ==================== 悬浮层 UI ====================

    /**
     * 检查悬浮窗权限
     */
    private boolean canDrawOverlays() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return Settings.canDrawOverlays(getContext());
        }
        return true;
    }

    /**
     * 显示悬浮层
     */
    private void showOverlay() {
        if (!canDrawOverlays()) {
            Log.w(TAG, "No overlay permission, UI will not be shown");
            return;
        }

        getActivity().runOnUiThread(() -> {
            try {
                if (overlayContainer != null) {
                    hideOverlay();
                }

                windowManager = (WindowManager) getActivity().getSystemService(android.content.Context.WINDOW_SERVICE);

                // 创建容器
                overlayContainer = new LinearLayout(getActivity());
                overlayContainer.setOrientation(LinearLayout.VERTICAL);
                overlayContainer.setBackgroundColor(Color.parseColor("#CC000000")); // 半透明黑色
                overlayContainer.setPadding(dpToPx(16), dpToPx(8), dpToPx(16), dpToPx(8));

                // 创建广告计数器文字
                adCounterText = new TextView(getActivity());
                adCounterText.setTextColor(Color.WHITE);
                adCounterText.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
                adCounterText.setTypeface(null, Typeface.BOLD);
                adCounterText.setText("Ad 1 of " + totalAdCount);
                overlayContainer.addView(adCounterText);

                // 创建进度条
                progressBar = new ProgressBar(getActivity(), null, android.R.attr.progressBarStyleHorizontal);
                progressBar.setMax(1000);
                progressBar.setProgress(0);
                LinearLayout.LayoutParams progressParams = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    dpToPx(4)
                );
                progressParams.topMargin = dpToPx(6);
                progressBar.setLayoutParams(progressParams);

                // 设置进度条颜色
                progressBar.getProgressDrawable().setColorFilter(
                    Color.parseColor("#9333EA"), // 紫色
                    android.graphics.PorterDuff.Mode.SRC_IN
                );
                overlayContainer.addView(progressBar);

                // 窗口参数
                int windowType;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    windowType = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
                } else {
                    windowType = WindowManager.LayoutParams.TYPE_SYSTEM_ALERT;
                }

                WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                    WindowManager.LayoutParams.MATCH_PARENT,
                    WindowManager.LayoutParams.WRAP_CONTENT,
                    windowType,
                    WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
                    WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL |
                    WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
                    PixelFormat.TRANSLUCENT
                );
                params.gravity = Gravity.TOP;

                windowManager.addView(overlayContainer, params);
                Log.d(TAG, "Overlay shown");

            } catch (Exception e) {
                Log.e(TAG, "Failed to show overlay", e);
            }
        });
    }

    /**
     * 隐藏悬浮层
     */
    private void hideOverlay() {
        getActivity().runOnUiThread(() -> {
            try {
                stopProgressUpdate();

                if (overlayContainer != null && windowManager != null) {
                    windowManager.removeView(overlayContainer);
                    overlayContainer = null;
                    adCounterText = null;
                    progressBar = null;
                    Log.d(TAG, "Overlay hidden");
                }
            } catch (Exception e) {
                Log.e(TAG, "Failed to hide overlay", e);
            }
        });
    }

    /**
     * 更新悬浮层 UI
     */
    private void updateOverlayUI() {
        getActivity().runOnUiThread(() -> {
            if (adCounterText != null) {
                adCounterText.setText("Ad " + (currentAdIndex + 1) + " of " + totalAdCount);
            }
            if (progressBar != null) {
                progressBar.setProgress(0);
            }
        });
    }

    /**
     * 开始更新进度条
     */
    private void startProgressUpdate() {
        stopProgressUpdate();

        progressRunnable = new Runnable() {
            @Override
            public void run() {
                if (progressBar != null && adStartTime > 0) {
                    long elapsed = System.currentTimeMillis() - adStartTime;
                    int progress = (int) ((elapsed * 1000) / ESTIMATED_AD_DURATION);
                    progress = Math.min(progress, 1000);
                    progressBar.setProgress(progress);

                    if (progress < 1000) {
                        progressHandler.postDelayed(this, PROGRESS_UPDATE_INTERVAL);
                    }
                }
            }
        };

        progressHandler.postDelayed(progressRunnable, PROGRESS_UPDATE_INTERVAL);
    }

    /**
     * 停止更新进度条
     */
    private void stopProgressUpdate() {
        if (progressRunnable != null) {
            progressHandler.removeCallbacks(progressRunnable);
            progressRunnable = null;
        }
        adStartTime = 0;
    }

    /**
     * dp 转 px
     */
    private int dpToPx(int dp) {
        float density = getActivity().getResources().getDisplayMetrics().density;
        return Math.round(dp * density);
    }
}
