# 🔍 Firebase 登录调试清单

## 现在已经添加了详细日志，请按以下步骤检查：

### 1. 打开浏览器控制台
- 访问: http://localhost:3000/login
- 按 F12 打开开发者工具
- 切换到 Console 标签

### 2. 检查 Firebase 初始化日志

应该看到以下日志：
```
🔥 Firebase Config Check: {
  hasApiKey: true,
  hasAuthDomain: true,
  hasProjectId: true,
  projectId: "your-project-id"
}
🔥 Firebase 初始化中...
✅ Firebase 初始化成功
```

**如果看到 ❌ Firebase 配置缺失！**
→ 说明 `.env.local` 文件配置有问题

### 3. 检查认证状态监听

应该看到：
```
👤 AuthContext: 开始监听认证状态
👤 AuthContext: 认证状态变化 {isLoggedIn: false, email: null, uid: null}
```

### 4. 点击 Google 登录按钮

应该看到以下日志序列：
```
🚀 useLogin: 开始 google 登录流程
📞 useLogin: 调用 signInWithGoogle
🔐 开始 Google 登录...
```

然后会弹出 Google 登录窗口

### 5. 登录成功后

应该看到：
```
✅ Google 登录成功 {email: "xxx@gmail.com", uid: "..."}
✅ useLogin: signInWithGoogle 完成
👤 AuthContext: 认证状态变化 {isLoggedIn: true, email: "xxx@gmail.com", uid: "..."}
💾 useLogin: 保存用户邮箱 xxx@gmail.com
✅ useLogin: 登录流程完成
```

然后会自动跳转到首页

## 常见问题排查

### ❌ 问题 1: Firebase 配置缺失
**日志**: `❌ Firebase 配置缺失！请检查 .env.local 文件`

**解决方案**:
1. 检查项目根目录是否有 `.env.local` 文件
2. 检查文件内容是否填写完整
3. 重启开发服务器 (Ctrl+C 然后 `npm run dev`)

**正确的 .env.local 格式**:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### ❌ 问题 2: 登录窗口不弹出
**可能原因**:
- Firebase 项目未启用 Google 登录
- 浏览器阻止了弹窗

**解决方案**:
1. 前往 Firebase Console
2. Authentication > Sign-in method
3. 启用 Google 登录
4. 检查浏览器是否允许弹窗

### ❌ 问题 3: auth/unauthorized-domain
**日志**: `auth/unauthorized-domain`

**解决方案**:
1. Firebase Console > Authentication > Settings
2. 在 "Authorized domains" 中添加 `localhost`

## 获取 Firebase 配置的步骤

1. 访问 https://console.firebase.google.com
2. 选择你的项目
3. 点击齿轮图标 > 项目设置
4. 滚动到 "Your apps" 部分
5. 如果没有 Web 应用，点击 "</>" 图标创建
6. 复制 `firebaseConfig` 对象中的值

## 下一步

如果看到了日志但仍有问题，请提供：
1. 控制台中的完整日志截图
2. 看到的具体错误信息
3. Firebase 项目是否已经创建并启用 Google 登录