-- 积分字段精度升级：integer → numeric(12,4)
-- 用于支持推荐提成等小数积分场景

-- 用户余额
ALTER TABLE users ALTER COLUMN credits TYPE numeric(12,4);
ALTER TABLE users ALTER COLUMN total_credits_used TYPE numeric(12,4);
ALTER TABLE users ALTER COLUMN monthly_credits TYPE numeric(12,4);

-- 匿名用户余额
ALTER TABLE anonymous_users ALTER COLUMN credits TYPE numeric(12,4);
ALTER TABLE anonymous_users ALTER COLUMN total_credits_used TYPE numeric(12,4);

-- 积分历史
ALTER TABLE credit_history ALTER COLUMN amount TYPE numeric(12,4);

-- 推荐提成
ALTER TABLE referral_commissions ALTER COLUMN source_amount TYPE numeric(12,4);
ALTER TABLE referral_commissions ALTER COLUMN commission_amount TYPE numeric(12,4);
