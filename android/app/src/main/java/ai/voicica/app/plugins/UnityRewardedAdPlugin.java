package ai.voicica.app.plugins;

import android.app.Activity;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.unity3d.ads.IUnityAdsInitializationListener;
import com.unity3d.ads.IUnityAdsLoadListener;
import com.unity3d.ads.IUnityAdsShowListener;
import com.unity3d.ads.UnityAds;

/**
 * Unity Ads 激励视频插件
 *
 * 提供 Unity Ads 激励视频广告功能
 * 用于每日任务/挖矿中心场景（与 AdMob 分开，避免诱导广告政策问题）
 *
 * 注意：Unity Ads SDK 4.9.x 不支持客户端 ILRD（Impression Level Revenue Data），
 * 收益数据需通过后端 eCPM 估算或 Unity Dashboard S2S 回调获取。
 */
@CapacitorPlugin(name = "UnityRewardedAd")
public class UnityRewardedAdPlugin extends Plugin implements IUnityAdsInitializationListener {

    private static final String TAG = "UnityRewardedAd";

    private boolean isInitialized = false;
    private boolean isLoading = false;
    private boolean isAdLoaded = false;
    private String currentPlacementId = null;

    // ==================== 初始化 ====================

    @PluginMethod
    public void initialize(PluginCall call) {
        String gameId = call.getString("gameId");
        Boolean testMode = call.getBoolean("testMode", false);

        if (gameId == null || gameId.isEmpty()) {
            call.reject("gameId is required");
            return;
        }

        if (isInitialized) {
            Log.d(TAG, "Unity Ads already initialized");
            call.resolve();
            return;
        }

        Log.d(TAG, "Initializing Unity Ads, gameId: " + gameId + ", testMode: " + testMode);
        UnityAds.initialize(getContext(), gameId, testMode, this);
        call.resolve();
    }

    @Override
    public void onInitializationComplete() {
        isInitialized = true;
        Log.d(TAG, "Unity Ads initialized successfully");

        JSObject result = new JSObject();
        result.put("initialized", true);
        notifyListeners("initialized", result);
    }

    @Override
    public void onInitializationFailed(UnityAds.UnityAdsInitializationError error, String message) {
        Log.e(TAG, "Unity Ads initialization failed: " + error + " - " + message);

        JSObject result = new JSObject();
        result.put("error", error.toString());
        result.put("message", message);
        notifyListeners("initializationFailed", result);
    }

    // ==================== 加载广告 ====================

    @PluginMethod
    public void loadAd(PluginCall call) {
        String placementId = call.getString("placementId");

        if (placementId == null || placementId.isEmpty()) {
            call.reject("placementId is required");
            return;
        }

        if (!isInitialized) {
            call.reject("Unity Ads not initialized");
            return;
        }

        if (isLoading) {
            Log.d(TAG, "Ad already loading");
            call.resolve();
            return;
        }

        isLoading = true;
        isAdLoaded = false;
        currentPlacementId = placementId;

        Log.d(TAG, "Loading rewarded ad, placementId: " + placementId);

        UnityAds.load(placementId, new IUnityAdsLoadListener() {
            @Override
            public void onUnityAdsAdLoaded(String placementId) {
                isLoading = false;
                isAdLoaded = true;
                Log.d(TAG, "Rewarded ad loaded: " + placementId);

                JSObject result = new JSObject();
                result.put("loaded", true);
                result.put("placementId", placementId);
                notifyListeners("adLoaded", result);
                call.resolve(result);
            }

            @Override
            public void onUnityAdsFailedToLoad(String placementId, UnityAds.UnityAdsLoadError error, String message) {
                isLoading = false;
                isAdLoaded = false;
                Log.e(TAG, "Rewarded ad failed to load: " + error + " - " + message);

                JSObject result = new JSObject();
                result.put("loaded", false);
                result.put("error", error.toString());
                result.put("message", message);
                notifyListeners("adFailedToLoad", result);
                call.reject("Failed to load ad: " + message);
            }
        });
    }

    // ==================== 显示广告 ====================

    @PluginMethod
    public void showAd(PluginCall call) {
        String placementId = call.getString("placementId", currentPlacementId);

        if (placementId == null || placementId.isEmpty()) {
            call.reject("placementId is required");
            return;
        }

        if (!isAdLoaded) {
            call.reject("No ad loaded");
            return;
        }

        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity not available");
            return;
        }

        Log.d(TAG, "Showing rewarded ad: " + placementId);

        activity.runOnUiThread(() -> {
            UnityAds.show(activity, placementId, new IUnityAdsShowListener() {
                @Override
                public void onUnityAdsShowComplete(String pid, UnityAds.UnityAdsShowCompletionState state) {
                    isAdLoaded = false;
                    boolean rewarded = state == UnityAds.UnityAdsShowCompletionState.COMPLETED;
                    Log.d(TAG, "Ad show complete: " + state + ", rewarded: " + rewarded);

                    JSObject result = new JSObject();
                    result.put("completed", true);
                    result.put("rewarded", rewarded);
                    result.put("state", state.toString());
                    notifyListeners("adCompleted", result);
                    call.resolve(result);
                }

                @Override
                public void onUnityAdsShowFailure(String pid, UnityAds.UnityAdsShowError error, String message) {
                    isAdLoaded = false;
                    Log.e(TAG, "Ad show failed: " + error + " - " + message);

                    JSObject result = new JSObject();
                    result.put("completed", false);
                    result.put("rewarded", false);
                    result.put("error", error.toString());
                    result.put("message", message);
                    notifyListeners("adFailedToShow", result);
                    call.reject("Failed to show ad: " + message);
                }

                @Override
                public void onUnityAdsShowStart(String pid) {
                    Log.d(TAG, "Ad show started: " + pid);
                    JSObject result = new JSObject();
                    result.put("placementId", pid);
                    notifyListeners("adStarted", result);
                }

                @Override
                public void onUnityAdsShowClick(String pid) {
                    Log.d(TAG, "Ad clicked: " + pid);
                    JSObject result = new JSObject();
                    result.put("placementId", pid);
                    notifyListeners("adClicked", result);
                }
            });
        });
    }

    // ==================== 状态查询 ====================

    @PluginMethod
    public void isLoaded(PluginCall call) {
        JSObject result = new JSObject();
        result.put("loaded", isAdLoaded);
        call.resolve(result);
    }
}
