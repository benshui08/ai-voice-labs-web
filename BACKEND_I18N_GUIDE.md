# 后端错误消息国际化指南

## 方案概述

为后端 API 添加多语言支持，根据客户端的语言偏好返回相应的错误消息。

## 实现步骤

### 1. 创建翻译文件

在后端项目中创建 `i18n` 目录，添加不同语言的翻译文件：

```
backend/
  i18n/
    en.json
    zh-CN.json
    zh-TW.json
```

**i18n/en.json**:
```json
{
  "errors": {
    "stripe_product_not_found": "Stripe product not found: {product_id}",
    "stripe_service_unavailable": "Stripe service is temporarily unavailable, please try again later",
    "failed_to_get_prices": "Failed to get price list",
    "free_plan_prices": "Returning virtual prices for free plan"
  }
}
```

**i18n/zh-CN.json**:
```json
{
  "errors": {
    "stripe_product_not_found": "Stripe 产品不存在：{product_id}",
    "stripe_service_unavailable": "Stripe 服务暂时不可用，请稍后重试",
    "failed_to_get_prices": "获取价格列表失败",
    "free_plan_prices": "返回免费计划的虚拟价格"
  }
}
```

**i18n/zh-TW.json**:
```json
{
  "errors": {
    "stripe_product_not_found": "Stripe 產品不存在：{product_id}",
    "stripe_service_unavailable": "Stripe 服務暫時不可用，請稍後重試",
    "failed_to_get_prices": "獲取價格列表失敗",
    "free_plan_prices": "返回免費計劃的虛擬價格"
  }
}
```

### 2. 创建 I18n 工具类

**i18n/translator.py**:
```python
import json
from pathlib import Path
from typing import Dict, Optional

class Translator:
    def __init__(self, locale_dir: str = "i18n"):
        self.locale_dir = Path(locale_dir)
        self.translations: Dict[str, dict] = {}
        self._load_translations()

    def _load_translations(self):
        """加载所有翻译文件"""
        for file_path in self.locale_dir.glob("*.json"):
            locale = file_path.stem
            with open(file_path, 'r', encoding='utf-8') as f:
                self.translations[locale] = json.load(f)

    def get(self, key: str, locale: str = "en", **kwargs) -> str:
        """
        获取翻译文本

        Args:
            key: 翻译键，支持点号分隔的嵌套键 (如 'errors.stripe_product_not_found')
            locale: 语言代码 (en, zh-CN, zh-TW)
            **kwargs: 模板参数

        Returns:
            翻译后的文本
        """
        # 规范化 locale
        locale = self._normalize_locale(locale)

        # 获取翻译字典
        translations = self.translations.get(locale, self.translations.get("en", {}))

        # 通过点号分隔的键获取嵌套值
        keys = key.split('.')
        value = translations
        for k in keys:
            if isinstance(value, dict):
                value = value.get(k)
            else:
                value = None
                break

        # 如果没找到翻译，返回键本身
        if value is None:
            return key

        # 替换模板参数
        if kwargs:
            try:
                value = value.format(**kwargs)
            except (KeyError, ValueError):
                pass

        return value

    def _normalize_locale(self, locale: str) -> str:
        """规范化语言代码"""
        locale = locale.lower()

        # 映射常见的 locale 格式
        mapping = {
            'zh-cn': 'zh-CN',
            'zh_cn': 'zh-CN',
            'zh-tw': 'zh-TW',
            'zh_tw': 'zh-TW',
            'en-us': 'en',
            'en_us': 'en',
        }

        return mapping.get(locale, locale)

# 全局翻译器实例
translator = Translator()

def t(key: str, locale: str = "en", **kwargs) -> str:
    """快捷翻译函数"""
    return translator.get(key, locale, **kwargs)
```

### 3. 创建依赖注入函数

**dependencies/i18n.py**:
```python
from fastapi import Header
from typing import Optional

def get_locale(accept_language: Optional[str] = Header(None)) -> str:
    """
    从请求头中获取语言偏好

    Args:
        accept_language: Accept-Language header值

    Returns:
        语言代码 (en, zh-CN, zh-TW)
    """
    if not accept_language:
        return "en"

    # 解析 Accept-Language header
    # 格式: "zh-CN,zh;q=0.9,en;q=0.8"
    languages = []
    for lang in accept_language.split(','):
        parts = lang.strip().split(';')
        code = parts[0].strip()

        # 提取 q 值（质量因子）
        q = 1.0
        if len(parts) > 1:
            try:
                q_part = parts[1].strip()
                if q_part.startswith('q='):
                    q = float(q_part[2:])
            except ValueError:
                pass

        languages.append((code, q))

    # 按 q 值排序
    languages.sort(key=lambda x: x[1], reverse=True)

    # 返回第一个支持的语言
    supported = ['en', 'zh-CN', 'zh-TW']
    for code, _ in languages:
        # 精确匹配
        if code in supported:
            return code

        # 前缀匹配 (zh -> zh-CN)
        for sup in supported:
            if sup.lower().startswith(code.lower()):
                return sup

    return "en"
```

### 4. 更新路由处理函数

**routes/subscription.py** (更新后的版本):
```python
from fastapi import APIRouter, HTTPException, status, Depends
from i18n.translator import t
from dependencies.i18n import get_locale

router = APIRouter()

@router.get("/products/stripe/{product_id}/prices", response_model=List[StripePriceResponse])
async def get_stripe_product_prices(
    product_id: str,
    locale: str = Depends(get_locale)
):
    """
    获取 Stripe 产品的所有价格

    支持多语言错误消息，通过 Accept-Language header 指定语言
    """
    try:
        # 特殊处理：免费计划
        if product_id == "prod_Free":
            logger.info(t("errors.free_plan_prices", locale))
            return [StripePriceResponse(
                id="prod_Free",
                product="Free Plan",
                unit_amount=0,
                currency="USD",
                active=True,
                billing_type="recurring",
                billing_period="month",
                metadata={"plan_type": "Free"}
            )]

        prices_data = stripe_service.list_prices(product_id)

        if not prices_data:
            logger.warning(f"未找到产品价格: {product_id}")
            return []

        prices = []
        for price_data in prices_data:
            recurring = price_data.get("recurring", {})
            billing_type = "recurring" if recurring else "one_time"
            billing_period = recurring.get("interval") if recurring else None

            prices.append(StripePriceResponse(
                id=price_data.get("id"),
                product=price_data.get("product"),
                unit_amount=price_data.get("unit_amount", 0),
                currency=price_data.get("currency", "usd").upper(),
                active=price_data.get("active", False),
                billing_type=billing_type,
                billing_period=billing_period,
                metadata=price_data.get("metadata")
            ))

        logger.info(f"成功获取产品价格列表: product_id={product_id}, 共 {len(prices)} 个")
        return prices

    except HTTPException:
        raise
    except stripe_lib.error.InvalidRequestError as e:
        logger.warning(f"Stripe 产品不存在: {product_id}, error={str(e)}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=t("errors.stripe_product_not_found", locale, product_id=product_id)
        )
    except stripe_lib.error.StripeError as e:
        logger.error(f"Stripe API 错误: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=t("errors.stripe_service_unavailable", locale)
        )
    except Exception as e:
        logger.error(f"获取 Stripe 产品价格列表时发生错误: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=t("errors.failed_to_get_prices", locale)
        )
```

### 5. 前端请求配置

确保前端发送请求时包含 `Accept-Language` header：

**lib/api.ts** (或相应的 API 客户端文件):
```typescript
// 在 API 客户端中添加 Accept-Language header
const getAcceptLanguage = () => {
  const locale = localStorage.getItem('locale') || navigator.language;
  return locale;
};

export const subscriptionAPI = {
  async getStripePrices(productId: string) {
    const response = await fetch(
      `/api/v1/subscriptions/products/stripe/${productId}/prices`,
      {
        headers: {
          'Accept-Language': getAcceptLanguage(),
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch prices');
    }

    return response.json();
  },
  // ... 其他 API 方法
};
```

## 使用示例

### 客户端请求
```bash
# 英文
curl -H "Accept-Language: en" http://api.example.com/api/v1/subscriptions/products/stripe/prod_xxx/prices

# 简体中文
curl -H "Accept-Language: zh-CN" http://api.example.com/api/v1/subscriptions/products/stripe/prod_xxx/prices

# 繁体中文
curl -H "Accept-Language: zh-TW" http://api.example.com/api/v1/subscriptions/products/stripe/prod_xxx/prices
```

### 错误响应示例

**英文 (en)**:
```json
{
  "detail": "Stripe product not found: prod_invalid"
}
```

**简体中文 (zh-CN)**:
```json
{
  "detail": "Stripe 产品不存在：prod_invalid"
}
```

**繁体中文 (zh-TW)**:
```json
{
  "detail": "Stripe 產品不存在：prod_invalid"
}
```

## 测试

创建测试文件验证翻译功能：

```python
# tests/test_i18n.py
from i18n.translator import t

def test_english_translation():
    message = t("errors.stripe_product_not_found", "en", product_id="prod_123")
    assert message == "Stripe product not found: prod_123"

def test_simplified_chinese_translation():
    message = t("errors.stripe_product_not_found", "zh-CN", product_id="prod_123")
    assert message == "Stripe 产品不存在：prod_123"

def test_traditional_chinese_translation():
    message = t("errors.stripe_product_not_found", "zh-TW", product_id="prod_123")
    assert message == "Stripe 產品不存在：prod_123"
```

## 注意事项

1. **性能优化**: 翻译文件在应用启动时加载到内存，避免每次请求都读取文件
2. **回退机制**: 如果指定语言不存在，自动回退到英文
3. **日志记录**: 建议日志继续使用英文，方便开发和调试
4. **缓存**: 考虑使用 LRU 缓存来缓存常用的翻译结果
5. **扩展性**: 可以轻松添加更多语言支持

## 优势

- ✅ 提升国际用户体验
- ✅ 集中管理所有翻译文本
- ✅ 支持参数化翻译（模板变量）
- ✅ 易于维护和扩展
- ✅ 符合 REST API 标准（使用 Accept-Language header）