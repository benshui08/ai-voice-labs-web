'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithTwitter: () => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('👤 AuthContext: 开始监听认证状态');

    // 监听认证状态变化
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('👤 AuthContext: 认证状态变化', {
        isLoggedIn: !!user,
        email: user?.email,
        uid: user?.uid,
      });

      setUser(user);

      // 如果用户登录，调用后端 API 获取/创建用户信息
      if (user) {
        try {
          console.log('📡 AuthContext: 调用后端 API /api/v1/users/me');
          const token = await user.getIdToken();

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            console.log('✅ AuthContext: 后端用户数据获取成功', userData);
            // 这里可以保存到额外的状态或 Context 中
          } else {
            console.error('❌ AuthContext: 后端 API 调用失败', {
              status: response.status,
              statusText: response.statusText,
            });
          }
        } catch (error) {
          console.error('❌ AuthContext: 后端 API 调用出错', error);
        }
      }

      setLoading(false);
    });

    return () => {
      console.log('👤 AuthContext: 停止监听认证状态');
      unsubscribe();
    };
  }, []);

  // Google 登录
  const signInWithGoogle = async () => {
    try {
      console.log('🔐 开始 Google 登录...');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('✅ Google 登录成功', {
        email: result.user.email,
        uid: result.user.uid,
      });
    } catch (error) {
      const firebaseError = error as { code?: string; message?: string };
      console.error('❌ Google 登录失败:', {
        code: firebaseError.code,
        message: firebaseError.message,
        error,
      });
      throw error;
    }
  };

  // Apple 登录
  const signInWithApple = async () => {
    // TODO: 实现 Apple 登录
    console.log('Apple sign in not implemented yet');
  };

  // Twitter 登录
  const signInWithTwitter = async () => {
    // TODO: 实现 Twitter 登录
    console.log('Twitter sign in not implemented yet');
  };

  // 登出
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  // 获取 ID Token（用于后端API认证）
  const getIdToken = async (): Promise<string | null> => {
    if (!user) return null;
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error('Get ID token error:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithApple,
        signInWithTwitter,
        signOut,
        getIdToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}