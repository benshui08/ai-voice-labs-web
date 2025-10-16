# AI Voice Labs - 前后端架构说明

## 技术栈

### 前端
- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **认证**: Firebase Authentication
- **HTTP 客户端**: Axios
- **状态管理**: React Context API

### 后端
- **框架**: FastAPI (Python)
- **认证**: Firebase Admin SDK
- **数据库**: (根据你的实际情况填写)

## 架构流程

### 1. 用户登录流程

```
┌──────────┐
│  用户    │
└────┬─────┘
     │ 1. 点击登录
     ▼
┌──────────────────┐
│  Login Page      │
│  /login          │
└────┬─────────────┘
     │ 2. Firebase Auth (Google/Apple/X)
     ▼
┌──────────────────┐
│  Firebase        │
│  Authentication  │
└────┬─────────────┘
     │ 3. 返回 ID Token
     ▼
┌──────────────────┐
│  AuthContext     │
│  (保存用户状态)  │
└────┬─────────────┘
     │ 4. 自动调用后端
     ▼
┌──────────────────┐
│  GET /api/v1/    │
│  users/me        │
│  (首次自动注册)  │
└──────────────────┘
```

### 2. API 调用流程

```
┌──────────────────┐
│  前端组件        │
└────┬─────────────┘
     │ 1. 调用 API
     │    例: userAPI.getCurrentUser()
     ▼
┌──────────────────┐
│  API Client      │
│  (自动添加Token) │
└────┬─────────────┘
     │ 2. HTTP Request
     │    Header: Authorization: Bearer {token}
     ▼
┌──────────────────┐
│  FastAPI         │
│  Backend         │
└────┬─────────────┘
     │ 3. 验证 Token
     │    使用 Firebase Admin SDK
     ▼
┌──────────────────┐
│  Firebase Admin  │
│  SDK             │
└────┬─────────────┘
     │ 4. 返回用户信息
     ▼
┌──────────────────┐
│  处理业务逻辑    │
│  返回数据        │
└──────────────────┘
```

## 目录结构

```
src/
├── app/                      # Next.js 页面
│   ├── login/               # 登录页面
│   ├── page.tsx             # 首页
│   └── layout.tsx           # 根布局
│
├── components/              # React 组件
│   ├── layout/             # 布局组件
│   │   └── Navbar/         # 导航栏
│   └── ui/                 # 通用UI组件
│
├── contexts/               # React Context
│   ├── AuthContext.tsx    # 认证状态管理
│   └── LanguageContext.tsx # 语言状态管理
│
├── lib/                    # 第三方库配置
│   └── firebase.ts         # Firebase 初始化
│
├── services/               # API 服务层
│   └── api.ts             # API 客户端封装
│
└── i18n/                   # 国际化
    └── locales/           # 语言文件
        ├── en.json
        ├── zh-CN.json
        └── zh-TW.json
```

## 核心文件说明

### 1. `src/lib/firebase.ts`
Firebase 初始化配置，确保只初始化一次。

### 2. `src/contexts/AuthContext.tsx`
认证状态管理：
- 监听用户登录状态
- 提供登录/登出方法
- 提供获取 ID Token 的方法

### 3. `src/services/api.ts`
API 客户端封装：
- 自动添加 Authorization Header
- 统一错误处理
- 提供分模块的 API 方法

**使用示例**:
```typescript
import { userAPI } from '@/services/api';

// 获取当前用户信息
const user = await userAPI.getCurrentUser();

// 更新用户资料
await userAPI.updateProfile({ name: 'New Name' });
```

### 4. `src/app/login/page.tsx`
登录页面：
- 集成 Firebase 社交登录
- 支持多语言
- 登录成功后自动重定向

## 环境变量配置

1. 复制 `.env.example` 到 `.env.local`:
```bash
cp .env.example .env.local
```

2. 填写 Firebase 配置（从 Firebase Console 获取）

3. 填写后端 API 地址

## API 认证流程详解

### 前端发送请求
```typescript
// api.ts 中的请求拦截器自动添加 Token
this.client.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 后端验证 Token
```python
# app/middleware/auth.py
async def get_current_user(
    authorization: str = Header(None)
):
    token = authorization.replace('Bearer ', '')

    # 使用 Firebase Admin SDK 验证
    decoded_token = auth.verify_id_token(token)

    return decoded_token  # 包含 uid, email 等信息
```

## 最佳实践

### 1. Token 刷新
Firebase SDK 自动处理 Token 刷新，无需手动实现。

### 2. 错误处理
- 401 错误：自动重定向到登录页
- 网络错误：显示友好提示
- 业务错误：根据错误码显示对应消息

### 3. 安全性
- 所有敏感配置使用环境变量
- API Key 只用于前端认证
- 后端使用 Firebase Admin SDK 验证

### 4. 性能优化
- Firebase 配置仅在客户端初始化
- API 请求使用 Axios 拦截器统一处理
- 避免重复请求

## 开发流程

### 添加新的 API 端点

1. **后端** (FastAPI):
```python
@router.get("/api/v1/voices")
async def get_voices(current_user: dict = Depends(get_current_user)):
    # 实现逻辑
    return voices
```

2. **前端** (services/api.ts):
```typescript
export const voiceAPI = {
  getVoices: () => {
    return apiClient.get('/api/v1/voices');
  },
};
```

3. **使用**:
```typescript
import { voiceAPI } from '@/services/api';

const voices = await voiceAPI.getVoices();
```

## 常见问题

### Q: Firebase Token 什么时候过期？
A: 默认 1 小时，Firebase SDK 会自动刷新。

### Q: 如何在服务端组件中使用认证？
A: 服务端组件不能使用 Context，需要使用 Next.js Middleware 或 Server Actions。

### Q: 如何处理未登录用户访问受保护页面？
A: 可以创建 HOC 或使用 Next.js Middleware 进行路由保护。

## 下一步

- [ ] 实现 Apple/Twitter 登录
- [ ] 添加路由保护中间件
- [ ] 实现订阅管理功能
- [ ] 添加用户个人资料页面
- [ ] 集成支付功能