-- 分享图鉴功能：创建 collection_shares 表

CREATE TABLE IF NOT EXISTS collection_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token VARCHAR(12) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 性能索引
CREATE INDEX IF NOT EXISTS collection_shares_user_id_idx ON collection_shares (user_id);
CREATE INDEX IF NOT EXISTS collection_shares_token_idx ON collection_shares (token);

-- 开启 RLS
ALTER TABLE collection_shares ENABLE ROW LEVEL SECURITY;

-- 用户只能管理自己的分享（查询/创建/删除）
-- 公开访问由后端用 service_role key 绕过 RLS 查询
CREATE POLICY "Users manage own shares"
  ON collection_shares
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
