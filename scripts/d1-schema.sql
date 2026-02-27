-- D1 Schema: Converted from Neon PostgreSQL
-- Generated for Cloudflare D1 (SQLite)

-- ============================================================
-- Tables
-- ============================================================

CREATE TABLE IF NOT EXISTS anonymous_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  device_fingerprint TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  credits REAL NOT NULL,
  total_credits_used REAL NOT NULL,
  expires_at TEXT,
  last_used_at TEXT,
  is_anonymous INTEGER NOT NULL,
  converted_to_user_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT,
  platform TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_anonymous_users_user_id ON anonymous_users(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_anonymous_users_device_fingerprint ON anonymous_users(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_anonymous_users_converted_to_user_id ON anonymous_users(converted_to_user_id);
CREATE INDEX IF NOT EXISTS idx_anonymous_users_device_fingerprint ON anonymous_users(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_anonymous_users_expires_at ON anonymous_users(expires_at);
CREATE INDEX IF NOT EXISTS idx_anonymous_users_last_used_at ON anonymous_users(last_used_at);
CREATE INDEX IF NOT EXISTS idx_anonymous_users_platform ON anonymous_users(platform);
CREATE INDEX IF NOT EXISTS idx_anonymous_users_user_id ON anonymous_users(user_id);

CREATE TABLE IF NOT EXISTS task_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id TEXT NOT NULL,
  task_type TEXT NOT NULL,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL,
  priority INTEGER NOT NULL,
  payload TEXT NOT NULL,
  retry_count INTEGER NOT NULL,
  max_retries INTEGER NOT NULL,
  worker_id TEXT,
  error_message TEXT,
  started_at TEXT,
  completed_at TEXT,
  timeout_seconds INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  email TEXT,
  name TEXT,
  photo_url TEXT,
  credits REAL NOT NULL,
  total_credits_used REAL NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT,
  phone TEXT,
  monthly_credits REAL NOT NULL DEFAULT 0,
  monthly_credits_reset_at TEXT,
  auth_provider TEXT,
  platform TEXT,
  usdt_balance TEXT NOT NULL DEFAULT '0',
  referral_code TEXT,
  referred_by TEXT,
  referral_level TEXT NOT NULL DEFAULT 'miner',
  ip_address TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_users_user_id ON users(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_user_platform ON users(platform);
CREATE INDEX IF NOT EXISTS idx_user_referred_by ON users(referred_by);

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_type TEXT,
  platform TEXT,
  external_transaction_id TEXT NOT NULL,
  external_subscription_id TEXT,
  request_id TEXT NOT NULL,
  status TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  credits_allocated INTEGER NOT NULL,
  amount INTEGER,
  currency TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL,
  activated_at TEXT,
  cancelled_at TEXT,
  cancellation_reason TEXT,
  auto_renew INTEGER NOT NULL,
  cancel_at_period_end INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS ix_user_subscriptions_request_id ON user_subscriptions(request_id);
CREATE INDEX IF NOT EXISTS ix_user_subscriptions_end_date ON user_subscriptions(end_date);
CREATE INDEX IF NOT EXISTS ix_user_subscriptions_platform_ext_sub ON user_subscriptions(platform, external_subscription_id);
CREATE INDEX IF NOT EXISTS ix_user_subscriptions_platform_ext_txn ON user_subscriptions(platform, external_transaction_id);
CREATE INDEX IF NOT EXISTS ix_user_subscriptions_product_id ON user_subscriptions(product_id);
CREATE INDEX IF NOT EXISTS ix_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS ix_user_subscriptions_status_end_date ON user_subscriptions(status, end_date);
CREATE INDEX IF NOT EXISTS ix_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS ix_user_subscriptions_user_status ON user_subscriptions(user_id, status);

CREATE TABLE IF NOT EXISTS subscription_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subscription_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT,
  stripe_event_id TEXT,
  stripe_event_type TEXT,
  amount INTEGER,
  currency TEXT,
  credits_change INTEGER,
  metadata TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (subscription_id) REFERENCES user_subscriptions(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS subscription_history_stripe_event_id_key ON subscription_history(stripe_event_id);
CREATE INDEX IF NOT EXISTS ix_subscription_history_created_at ON subscription_history(created_at);
CREATE INDEX IF NOT EXISTS ix_subscription_history_event_type ON subscription_history(event_type);
CREATE INDEX IF NOT EXISTS ix_subscription_history_subscription_id ON subscription_history(subscription_id);
CREATE INDEX IF NOT EXISTS ix_subscription_history_user_id ON subscription_history(user_id);

CREATE TABLE IF NOT EXISTS tts_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  text TEXT NOT NULL,
  voice_name TEXT NOT NULL,
  language TEXT,
  speed REAL NOT NULL,
  pitch INTEGER NOT NULL,
  volume INTEGER NOT NULL,
  credits_cost INTEGER NOT NULL,
  character_count INTEGER NOT NULL,
  status TEXT NOT NULL,
  progress INTEGER NOT NULL,
  audio_url TEXT,
  duration REAL,
  format TEXT NOT NULL,
  error_message TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT,
  style TEXT,
  share_id TEXT,
  story_id TEXT,
  platform TEXT,
  is_public INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS ix_tts_records_task_id ON tts_records(task_id);
CREATE UNIQUE INDEX IF NOT EXISTS ix_tts_records_share_id ON tts_records(share_id);
CREATE INDEX IF NOT EXISTS ix_tts_records_is_public ON tts_records(is_public);
CREATE INDEX IF NOT EXISTS ix_tts_records_platform ON tts_records(platform);
CREATE INDEX IF NOT EXISTS ix_tts_records_status ON tts_records(status);
CREATE INDEX IF NOT EXISTS ix_tts_records_story_id ON tts_records(story_id);
CREATE INDEX IF NOT EXISTS ix_tts_records_user_created ON tts_records(user_id, created_at);
CREATE INDEX IF NOT EXISTS ix_tts_records_user_id ON tts_records(user_id);
CREATE INDEX IF NOT EXISTS ix_tts_records_user_status ON tts_records(user_id, status);
CREATE INDEX IF NOT EXISTS ix_tts_records_user_status_created ON tts_records(user_id, status, created_at);

CREATE TABLE IF NOT EXISTS credit_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  amount REAL NOT NULL,
  task_id TEXT,
  description TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT,
  product_type TEXT,
  ad_revenue_micros INTEGER,
  ad_revenue_currency TEXT,
  ad_revenue_source TEXT,
  random_multiplier REAL
);
CREATE INDEX IF NOT EXISTS idx_credit_history_created_at ON credit_history(created_at);
CREATE INDEX IF NOT EXISTS idx_credit_history_product_type ON credit_history(product_type);
CREATE INDEX IF NOT EXISTS idx_credit_history_task_id ON credit_history(task_id);
CREATE INDEX IF NOT EXISTS idx_credit_history_user_created ON credit_history(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_credit_history_user_id ON credit_history(user_id);

CREATE TABLE IF NOT EXISTS voices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  locale TEXT NOT NULL,
  country TEXT NOT NULL,
  role TEXT NOT NULL,
  gender TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  voice_sample_url TEXT NOT NULL,
  voice_sample_text TEXT NOT NULL,
  tags TEXT NOT NULL,
  style_list TEXT NOT NULL,
  is_active INTEGER NOT NULL,
  sort_order INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT,
  display_name TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_voices_name ON voices(name);
CREATE INDEX IF NOT EXISTS ix_voices_country ON voices(country);
CREATE INDEX IF NOT EXISTS ix_voices_is_active ON voices(is_active);
CREATE INDEX IF NOT EXISTS ix_voices_locale ON voices(locale);
CREATE INDEX IF NOT EXISTS ix_voices_locale_active ON voices(locale, is_active);
CREATE INDEX IF NOT EXISTS ix_voices_name ON voices(name);
CREATE INDEX IF NOT EXISTS ix_voices_provider ON voices(provider);
CREATE INDEX IF NOT EXISTS ix_voices_provider_country ON voices(provider, country);
CREATE INDEX IF NOT EXISTS ix_voices_role ON voices(role);
CREATE INDEX IF NOT EXISTS ix_voices_role_country ON voices(role, country);
CREATE INDEX IF NOT EXISTS ix_voices_sort_active ON voices(sort_order, is_active);

CREATE TABLE IF NOT EXISTS app_releases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT NOT NULL,
  version TEXT NOT NULL,
  version_code INTEGER NOT NULL,
  download_url TEXT NOT NULL,
  file_size INTEGER,
  release_notes TEXT,
  is_latest INTEGER NOT NULL DEFAULT 0,
  is_force_update INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  download_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS app_releases_platform_version_key ON app_releases(platform, version);
CREATE INDEX IF NOT EXISTS ix_app_releases_platform_active ON app_releases(platform, is_active);
CREATE INDEX IF NOT EXISTS ix_app_releases_platform_latest ON app_releases(platform, is_latest);
CREATE INDEX IF NOT EXISTS ix_app_releases_platform_version_code ON app_releases(platform, version_code);

CREATE TABLE IF NOT EXISTS user_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  event TEXT NOT NULL,
  data TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS ix_user_events_created_at ON user_events(created_at);
CREATE INDEX IF NOT EXISTS ix_user_events_event ON user_events(event);
CREATE INDEX IF NOT EXISTS ix_user_events_user_event ON user_events(user_id, event);
CREATE INDEX IF NOT EXISTS ix_user_events_user_id ON user_events(user_id);

CREATE TABLE IF NOT EXISTS daily_tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  checkin_done INTEGER NOT NULL DEFAULT 0,
  checkin_credits INTEGER NOT NULL DEFAULT 0,
  ad_rewards_claimed INTEGER NOT NULL DEFAULT 0,
  ad_rewards_credits REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_daily_tasks_user_date ON daily_tasks(user_id, date);
CREATE INDEX IF NOT EXISTS ix_daily_tasks_date ON daily_tasks(date);
CREATE INDEX IF NOT EXISTS ix_daily_tasks_user_id ON daily_tasks(user_id);

CREATE TABLE IF NOT EXISTS ad_reward_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  tier INTEGER,
  timestamp TEXT NOT NULL,
  ad_unit TEXT,
  reward_amount REAL NOT NULL DEFAULT 0,
  processed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS ad_reward_transactions_transaction_id_key ON ad_reward_transactions(transaction_id);
CREATE INDEX IF NOT EXISTS ix_ad_reward_transactions_processed ON ad_reward_transactions(processed);
CREATE INDEX IF NOT EXISTS ix_ad_reward_transactions_timestamp ON ad_reward_transactions(timestamp);
CREATE INDEX IF NOT EXISTS ix_ad_reward_transactions_user_id ON ad_reward_transactions(user_id);

CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  keywords TEXT,
  idea_title TEXT,
  idea_description TEXT,
  locale TEXT NOT NULL DEFAULT 'en-US',
  word_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  video_url TEXT,
  video_status TEXT NOT NULL DEFAULT 'none',
  video_duration INTEGER,
  video_thumbnail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT,
  character_descriptions TEXT
);
CREATE INDEX IF NOT EXISTS ix_stories_created_at ON stories(created_at);
CREATE INDEX IF NOT EXISTS ix_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS ix_stories_user_created ON stories(user_id, created_at);
CREATE INDEX IF NOT EXISTS ix_stories_user_id ON stories(user_id);
CREATE INDEX IF NOT EXISTS ix_stories_user_status ON stories(user_id, status);

CREATE TABLE IF NOT EXISTS story_illustrations (
  id TEXT PRIMARY KEY NOT NULL,
  story_id TEXT NOT NULL,
  image_url TEXT,
  prompt TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  paragraph INTEGER,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT,
  credits_cost INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  height INTEGER NOT NULL DEFAULT 1024,
  model TEXT,
  scene_description TEXT,
  task_id TEXT,
  type TEXT NOT NULL DEFAULT 'scene',
  width INTEGER NOT NULL DEFAULT 1024,
  FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS ix_story_illustrations_position ON story_illustrations(position);
CREATE INDEX IF NOT EXISTS ix_story_illustrations_status ON story_illustrations(status);
CREATE INDEX IF NOT EXISTS ix_story_illustrations_story_id ON story_illustrations(story_id);
CREATE INDEX IF NOT EXISTS ix_story_illustrations_type ON story_illustrations(type);

CREATE TABLE IF NOT EXISTS story_paragraphs (
  id TEXT PRIMARY KEY NOT NULL,
  story_id TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  content TEXT NOT NULL,
  audio_url TEXT,
  audio_duration REAL,
  audio_voice TEXT,
  audio_status TEXT NOT NULL DEFAULT 'none',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT,
  illustration_prompt TEXT,
  illustration_status TEXT NOT NULL DEFAULT 'none',
  illustration_url TEXT,
  FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_story_paragraphs_story_position ON story_paragraphs(story_id, position);
CREATE INDEX IF NOT EXISTS ix_story_paragraphs_position ON story_paragraphs(position);
CREATE INDEX IF NOT EXISTS ix_story_paragraphs_story_id ON story_paragraphs(story_id);

CREATE TABLE IF NOT EXISTS rvc_voice_models (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  category TEXT NOT NULL,
  avatar_url TEXT,
  sample_url TEXT,
  model_url TEXT NOT NULL,
  index_url TEXT,
  uses_count INTEGER NOT NULL DEFAULT 0,
  is_builtin INTEGER NOT NULL DEFAULT 0,
  builtin_name TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS rvc_voice_models_slug_key ON rvc_voice_models(slug);
CREATE INDEX IF NOT EXISTS ix_rvc_voice_models_category ON rvc_voice_models(category);
CREATE INDEX IF NOT EXISTS ix_rvc_voice_models_is_active ON rvc_voice_models(is_active);
CREATE INDEX IF NOT EXISTS ix_rvc_voice_models_is_builtin ON rvc_voice_models(is_builtin);
CREATE INDEX IF NOT EXISTS ix_rvc_voice_models_sort_order ON rvc_voice_models(sort_order);

CREATE TABLE IF NOT EXISTS cover_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  original_audio_url TEXT NOT NULL,
  voice_model_id INTEGER NOT NULL,
  voice_model_name TEXT NOT NULL,
  pitch_change INTEGER NOT NULL DEFAULT 0,
  f0_method TEXT NOT NULL DEFAULT 'rmvpe',
  index_rate REAL NOT NULL DEFAULT 0.5,
  protect REAL NOT NULL DEFAULT 0.33,
  status TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  spleeter_task_id TEXT,
  rvc_task_id TEXT,
  vocals_url TEXT,
  accompaniment_url TEXT,
  converted_vocals_url TEXT,
  output_url TEXT,
  duration REAL,
  credits_cost INTEGER NOT NULL,
  is_public INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  share_id TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS cover_records_share_id_key ON cover_records(share_id);
CREATE UNIQUE INDEX IF NOT EXISTS cover_records_task_id_key ON cover_records(task_id);
CREATE INDEX IF NOT EXISTS ix_cover_records_status ON cover_records(status);
CREATE INDEX IF NOT EXISTS ix_cover_records_user_created ON cover_records(user_id, created_at);
CREATE INDEX IF NOT EXISTS ix_cover_records_user_id ON cover_records(user_id);
CREATE INDEX IF NOT EXISTS ix_cover_records_user_status ON cover_records(user_id, status);
CREATE INDEX IF NOT EXISTS ix_cover_records_voice_model_id ON cover_records(voice_model_id);

CREATE TABLE IF NOT EXISTS share_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS share_links_token_key ON share_links(token);
CREATE INDEX IF NOT EXISTS ix_share_links_expires_at ON share_links(expires_at);
CREATE INDEX IF NOT EXISTS ix_share_links_resource ON share_links(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS ix_share_links_token ON share_links(token);
CREATE INDEX IF NOT EXISTS ix_share_links_user_id ON share_links(user_id);

CREATE TABLE IF NOT EXISTS video_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  task_type TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt TEXT NOT NULL,
  prompt_zh TEXT,
  negative_prompt TEXT,
  resolution TEXT NOT NULL,
  duration INTEGER NOT NULL,
  aspect_ratio TEXT NOT NULL,
  seed INTEGER,
  is_public INTEGER NOT NULL DEFAULT 0,
  credits_cost INTEGER NOT NULL,
  status TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  video_url TEXT,
  thumbnail_url TEXT,
  actual_duration REAL,
  format TEXT NOT NULL DEFAULT 'mp4',
  error_message TEXT,
  completed_at TEXT,
  share_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT,
  api_cost REAL,
  view_count INTEGER NOT NULL DEFAULT 0,
  external_task_id TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS ix_video_records_share_id ON video_records(share_id);
CREATE UNIQUE INDEX IF NOT EXISTS ix_video_records_task_id ON video_records(task_id);
CREATE INDEX IF NOT EXISTS ix_video_records_external_task_id ON video_records(external_task_id);
CREATE INDEX IF NOT EXISTS ix_video_records_is_public ON video_records(is_public);
CREATE INDEX IF NOT EXISTS ix_video_records_status ON video_records(status);
CREATE INDEX IF NOT EXISTS ix_video_records_user_created ON video_records(user_id, created_at);
CREATE INDEX IF NOT EXISTS ix_video_records_user_id ON video_records(user_id);
CREATE INDEX IF NOT EXISTS ix_video_records_user_status ON video_records(user_id, status);
CREATE INDEX IF NOT EXISTS ix_video_records_user_status_created ON video_records(user_id, status, created_at);

CREATE TABLE IF NOT EXISTS image_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt TEXT NOT NULL,
  aspect_ratio TEXT NOT NULL,
  quality TEXT NOT NULL,
  status TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_public INTEGER NOT NULL DEFAULT 0,
  credits_used INTEGER NOT NULL,
  error TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS image_records_task_id_key ON image_records(task_id);
CREATE INDEX IF NOT EXISTS ix_image_records_is_public ON image_records(is_public);
CREATE INDEX IF NOT EXISTS ix_image_records_status ON image_records(status);
CREATE INDEX IF NOT EXISTS ix_image_records_user_created ON image_records(user_id, created_at);
CREATE INDEX IF NOT EXISTS ix_image_records_user_id ON image_records(user_id);
CREATE INDEX IF NOT EXISTS ix_image_records_user_status ON image_records(user_id, status);

CREATE TABLE IF NOT EXISTS music_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  external_task_id TEXT,
  model TEXT NOT NULL,
  prompt TEXT NOT NULL,
  style TEXT,
  title TEXT,
  lyrics TEXT,
  is_instrumental INTEGER NOT NULL DEFAULT 0,
  is_custom_mode INTEGER NOT NULL DEFAULT 0,
  is_public INTEGER NOT NULL DEFAULT 0,
  credits_cost INTEGER NOT NULL,
  status TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  audio_url TEXT,
  audio_url_2 TEXT,
  stream_url TEXT,
  stream_url_2 TEXT,
  cover_url TEXT,
  cover_url_2 TEXT,
  duration REAL,
  duration_2 REAL,
  tags TEXT,
  error_message TEXT,
  completed_at TEXT,
  share_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT,
  external_track_id TEXT,
  external_track_id_2 TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS ix_music_records_share_id ON music_records(share_id);
CREATE UNIQUE INDEX IF NOT EXISTS ix_music_records_task_id ON music_records(task_id);
CREATE INDEX IF NOT EXISTS ix_music_records_external_task_id ON music_records(external_task_id);
CREATE INDEX IF NOT EXISTS ix_music_records_is_public ON music_records(is_public);
CREATE INDEX IF NOT EXISTS ix_music_records_status ON music_records(status);
CREATE INDEX IF NOT EXISTS ix_music_records_user_created ON music_records(user_id, created_at);
CREATE INDEX IF NOT EXISTS ix_music_records_user_id ON music_records(user_id);
CREATE INDEX IF NOT EXISTS ix_music_records_user_status ON music_records(user_id, status);

CREATE TABLE IF NOT EXISTS dialogue_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  external_task_id TEXT,
  dialogue_json TEXT NOT NULL,
  total_characters INTEGER NOT NULL,
  credits_cost INTEGER NOT NULL,
  status TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  audio_url TEXT,
  duration REAL,
  error_message TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT,
  is_public INTEGER NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX IF NOT EXISTS dialogue_records_task_id_key ON dialogue_records(task_id);
CREATE INDEX IF NOT EXISTS ix_dialogue_records_external_task_id ON dialogue_records(external_task_id);
CREATE INDEX IF NOT EXISTS ix_dialogue_records_is_public ON dialogue_records(is_public);
CREATE INDEX IF NOT EXISTS ix_dialogue_records_status ON dialogue_records(status);
CREATE INDEX IF NOT EXISTS ix_dialogue_records_user_created ON dialogue_records(user_id, created_at);
CREATE INDEX IF NOT EXISTS ix_dialogue_records_user_id ON dialogue_records(user_id);

CREATE TABLE IF NOT EXISTS native_banners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  titles TEXT NOT NULL,
  subtitles TEXT NOT NULL,
  button_texts TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);
CREATE INDEX IF NOT EXISTS ix_native_banners_active_sort ON native_banners(is_active, sort_order);

CREATE TABLE IF NOT EXISTS video_download_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  url TEXT NOT NULL,
  platform TEXT,
  video_title TEXT,
  video_author TEXT,
  status TEXT NOT NULL,
  error_code TEXT,
  credits_cost INTEGER NOT NULL DEFAULT 0,
  is_anonymous INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS ix_video_download_records_created_at ON video_download_records(created_at);
CREATE INDEX IF NOT EXISTS ix_video_download_records_platform ON video_download_records(platform);
CREATE INDEX IF NOT EXISTS ix_video_download_records_status ON video_download_records(status);
CREATE INDEX IF NOT EXISTS ix_video_download_records_user_id ON video_download_records(user_id);

CREATE TABLE IF NOT EXISTS image_tool_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  tool_type TEXT NOT NULL,
  status TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  original_image_url TEXT NOT NULL,
  result_image_url TEXT,
  credits_used INTEGER NOT NULL,
  error TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS image_tool_records_task_id_key ON image_tool_records(task_id);
CREATE INDEX IF NOT EXISTS ix_image_tool_records_user_id ON image_tool_records(user_id);

CREATE TABLE IF NOT EXISTS cloned_voices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  fish_model_id TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  sample_audio_url TEXT,
  reference_text TEXT,
  status TEXT NOT NULL DEFAULT 'TRAINING',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS ix_cloned_voices_fish_model_id ON cloned_voices(fish_model_id);
CREATE INDEX IF NOT EXISTS ix_cloned_voices_user_id ON cloned_voices(user_id);
CREATE INDEX IF NOT EXISTS ix_cloned_voices_status ON cloned_voices(status);

CREATE TABLE IF NOT EXISTS conversions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  voicica_amount INTEGER NOT NULL,
  usdt_amount TEXT NOT NULL,
  rate TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_conversions_user_id ON conversions(user_id);

CREATE TABLE IF NOT EXISTS withdrawals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  amount TEXT NOT NULL,
  fee TEXT NOT NULL,
  net_amount TEXT NOT NULL,
  network TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  email TEXT NOT NULL,
  telegram TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  tx_hash TEXT,
  admin_note TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);

CREATE TABLE IF NOT EXISTS lucky_draws (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  draw_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  prize_type TEXT,
  title TEXT,
  enabled INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'selling',
  total_slots INTEGER NOT NULL,
  sold_count INTEGER NOT NULL DEFAULT 0,
  credits_per_purchase INTEGER NOT NULL,
  stripe_price_cents INTEGER NOT NULL,
  crypto_price_cents INTEGER NOT NULL,
  contract_address TEXT,
  chain_name TEXT,
  block_explorer_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  started_at TEXT,
  completed_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_ld_draw_id ON lucky_draws(draw_id);
CREATE INDEX IF NOT EXISTS idx_ld_product_id ON lucky_draws(product_id);
CREATE INDEX IF NOT EXISTS idx_ld_enabled_status ON lucky_draws(enabled, status);

CREATE TABLE IF NOT EXISTS lucky_draw_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  draw_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  slot_number INTEGER NOT NULL,
  packs INTEGER NOT NULL,
  credits_awarded INTEGER NOT NULL,
  payment_platform TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'paid',
  stripe_session_id TEXT,
  amount_paid INTEGER,
  currency TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_lde_draw_slot ON lucky_draw_entries(draw_id, slot_number);
CREATE INDEX IF NOT EXISTS idx_lde_draw_id ON lucky_draw_entries(draw_id);
CREATE INDEX IF NOT EXISTS idx_lde_user_id ON lucky_draw_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_lde_draw_user ON lucky_draw_entries(draw_id, user_id);

CREATE TABLE IF NOT EXISTS lucky_draw_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  draw_id TEXT NOT NULL,
  winner_slot INTEGER NOT NULL,
  winner_user_id TEXT NOT NULL,
  block_number INTEGER,
  block_hash TEXT,
  tx_hash TEXT,
  total_slots INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_ldr_draw_id ON lucky_draw_results(draw_id);

CREATE TABLE IF NOT EXISTS lucky_draw_claims (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  draw_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  country TEXT,
  address TEXT,
  zip_code TEXT,
  telegram TEXT,
  wallet_network TEXT,
  wallet_address TEXT,
  carrier TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  shipped_at TEXT,
  delivered_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_ldc_draw_id ON lucky_draw_claims(draw_id);
CREATE INDEX IF NOT EXISTS idx_ldc_user_id ON lucky_draw_claims(user_id);

CREATE TABLE IF NOT EXISTS referral_commissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  from_user_id TEXT NOT NULL,
  level TEXT NOT NULL,
  source_amount REAL NOT NULL,
  commission_rate REAL NOT NULL,
  commission_amount REAL NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_referral_commissions_user_id ON referral_commissions(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_commissions_from_user_id ON referral_commissions(from_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_commissions_created_at ON referral_commissions(created_at);
