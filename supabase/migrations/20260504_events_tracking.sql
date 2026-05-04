-- 事件追踪表
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 创建索引用于查询
CREATE INDEX idx_events_created_at ON events(created_at DESC);
CREATE INDEX idx_events_event_name ON events(event_name);
CREATE INDEX idx_events_user_id ON events(user_id);

-- RLS 策略：认证用户可以插入自己的事件
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 不允许前端直接读取（避免数据泄露），只允许 service_role 查询
