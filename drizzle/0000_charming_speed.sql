-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "anonymous_users" (
	"user_id" varchar(255) NOT NULL,
	"device_fingerprint" varchar(255) NOT NULL,
	"ip_address" varchar(50),
	"user_agent" text,
	"credits" integer NOT NULL,
	"total_credits_used" integer NOT NULL,
	"expires_at" timestamp(6) with time zone,
	"last_used_at" timestamp(6) with time zone,
	"is_anonymous" boolean NOT NULL,
	"converted_to_user_id" varchar(255),
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone,
	"platform" varchar(20)
);
--> statement-breakpoint
CREATE TABLE "task_queue" (
	"task_id" varchar(255) NOT NULL,
	"task_type" varchar(50) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"status" varchar(20) NOT NULL,
	"priority" integer NOT NULL,
	"payload" json NOT NULL,
	"retry_count" integer NOT NULL,
	"max_retries" integer NOT NULL,
	"worker_id" varchar(100),
	"error_message" text,
	"started_at" timestamp(6) with time zone,
	"completed_at" timestamp(6) with time zone,
	"timeout_seconds" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone
);
--> statement-breakpoint
CREATE TABLE "subscription_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"subscription_id" integer NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"old_status" varchar(50),
	"new_status" varchar(50),
	"stripe_event_id" varchar(255),
	"stripe_event_type" varchar(100),
	"amount" integer,
	"currency" varchar(10),
	"credits_change" integer,
	"metadata" jsonb,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" varchar(128) NOT NULL,
	"email" varchar(255),
	"name" varchar(255),
	"photo_url" varchar(500),
	"credits" integer NOT NULL,
	"total_credits_used" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone,
	"phone" varchar(20),
	"monthly_credits" integer DEFAULT 0 NOT NULL,
	"monthly_credits_reset_at" timestamp(6) with time zone,
	"auth_provider" varchar(50),
	"platform" varchar(20)
);
--> statement-breakpoint
CREATE TABLE "tts_records" (
	"user_id" varchar(255) NOT NULL,
	"task_id" varchar(255) NOT NULL,
	"text" text NOT NULL,
	"voice_name" varchar(255) NOT NULL,
	"language" varchar(20),
	"speed" double precision NOT NULL,
	"pitch" integer NOT NULL,
	"volume" integer NOT NULL,
	"credits_cost" integer NOT NULL,
	"character_count" integer NOT NULL,
	"status" varchar(20) NOT NULL,
	"progress" integer NOT NULL,
	"audio_url" text,
	"duration" double precision,
	"format" varchar(10) NOT NULL,
	"error_message" text,
	"completed_at" timestamp(6) with time zone,
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone,
	"style" varchar(50),
	"share_id" varchar(12),
	"story_id" text,
	"platform" varchar(20),
	"is_public" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "credit_history" (
	"user_id" varchar(255) NOT NULL,
	"amount" integer NOT NULL,
	"task_id" varchar(255),
	"description" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone,
	"product_type" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "voices" (
	"name" varchar(255) NOT NULL,
	"provider" varchar(50) NOT NULL,
	"locale" varchar(20) NOT NULL,
	"country" varchar(10) NOT NULL,
	"role" varchar(50) NOT NULL,
	"gender" varchar(20) NOT NULL,
	"avatar_url" text NOT NULL,
	"voice_sample_url" json NOT NULL,
	"voice_sample_text" text NOT NULL,
	"tags" json NOT NULL,
	"style_list" json NOT NULL,
	"is_active" boolean NOT NULL,
	"sort_order" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone,
	"display_name" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "user_subscriptions" (
	"user_id" varchar(128) NOT NULL,
	"product_id" varchar(255) NOT NULL,
	"product_type" varchar(50),
	"platform" varchar(50),
	"external_transaction_id" varchar(255) NOT NULL,
	"external_subscription_id" varchar(255),
	"request_id" varchar(100) NOT NULL,
	"status" varchar(50) NOT NULL,
	"start_date" timestamp(6) with time zone NOT NULL,
	"end_date" timestamp(6) with time zone NOT NULL,
	"credits_allocated" integer NOT NULL,
	"amount" integer,
	"currency" varchar(10),
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone NOT NULL,
	"activated_at" timestamp(6) with time zone,
	"cancelled_at" timestamp(6) with time zone,
	"cancellation_reason" varchar(500),
	"auto_renew" boolean NOT NULL,
	"cancel_at_period_end" boolean NOT NULL,
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_releases" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" varchar(20) NOT NULL,
	"version" varchar(20) NOT NULL,
	"version_code" integer NOT NULL,
	"download_url" text NOT NULL,
	"file_size" bigint,
	"release_notes" text,
	"is_latest" boolean DEFAULT false NOT NULL,
	"is_force_update" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"download_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone
);
--> statement-breakpoint
CREATE TABLE "user_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"event" varchar(100) NOT NULL,
	"data" jsonb,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"date" varchar(10) NOT NULL,
	"checkin_done" boolean DEFAULT false NOT NULL,
	"checkin_credits" integer DEFAULT 0 NOT NULL,
	"ad_rewards_claimed" integer DEFAULT 0 NOT NULL,
	"ad_rewards_credits" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone
);
--> statement-breakpoint
CREATE TABLE "ad_reward_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaction_id" varchar(255) NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"tier" integer,
	"timestamp" timestamp(6) with time zone NOT NULL,
	"ad_unit" varchar(100),
	"reward_amount" integer DEFAULT 0 NOT NULL,
	"processed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stories" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"title" varchar(500) NOT NULL,
	"content" text NOT NULL,
	"keywords" varchar(500),
	"idea_title" varchar(500),
	"idea_description" text,
	"locale" varchar(20) DEFAULT 'en-US' NOT NULL,
	"word_count" integer DEFAULT 0 NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"video_url" text,
	"video_status" varchar(20) DEFAULT 'none' NOT NULL,
	"video_duration" integer,
	"video_thumbnail" text,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone,
	"character_descriptions" text
);
--> statement-breakpoint
CREATE TABLE "rvc_voice_models" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"category" varchar(50) NOT NULL,
	"avatar_url" text,
	"sample_url" text,
	"model_url" text NOT NULL,
	"index_url" text,
	"uses_count" integer DEFAULT 0 NOT NULL,
	"is_builtin" boolean DEFAULT false NOT NULL,
	"builtin_name" varchar(50),
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone
);
--> statement-breakpoint
CREATE TABLE "story_illustrations" (
	"id" text PRIMARY KEY NOT NULL,
	"story_id" text NOT NULL,
	"image_url" text,
	"prompt" text,
	"position" integer DEFAULT 0 NOT NULL,
	"paragraph" integer,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone,
	"credits_cost" integer DEFAULT 0 NOT NULL,
	"error_message" text,
	"height" integer DEFAULT 1024 NOT NULL,
	"model" varchar(100),
	"scene_description" text,
	"task_id" varchar(255),
	"type" varchar(20) DEFAULT 'scene' NOT NULL,
	"width" integer DEFAULT 1024 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "story_paragraphs" (
	"id" text PRIMARY KEY NOT NULL,
	"story_id" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"content" text NOT NULL,
	"audio_url" text,
	"audio_duration" double precision,
	"audio_voice" varchar(255),
	"audio_status" varchar(20) DEFAULT 'none' NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone,
	"illustration_prompt" text,
	"illustration_status" varchar(20) DEFAULT 'none' NOT NULL,
	"illustration_url" text
);
--> statement-breakpoint
CREATE TABLE "cover_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"task_id" varchar(255) NOT NULL,
	"original_audio_url" text NOT NULL,
	"voice_model_id" integer NOT NULL,
	"voice_model_name" varchar(100) NOT NULL,
	"pitch_change" integer DEFAULT 0 NOT NULL,
	"f0_method" varchar(20) DEFAULT 'rmvpe' NOT NULL,
	"index_rate" double precision DEFAULT 0.5 NOT NULL,
	"protect" double precision DEFAULT 0.33 NOT NULL,
	"status" varchar(20) NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"spleeter_task_id" varchar(255),
	"rvc_task_id" varchar(255),
	"vocals_url" text,
	"accompaniment_url" text,
	"converted_vocals_url" text,
	"output_url" text,
	"duration" double precision,
	"credits_cost" integer NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"error_message" text,
	"share_id" varchar(12),
	"completed_at" timestamp(6) with time zone,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone
);
--> statement-breakpoint
CREATE TABLE "share_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" varchar(32) NOT NULL,
	"resource_type" varchar(50) NOT NULL,
	"resource_id" varchar(100) NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"expires_at" timestamp(6) with time zone NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "video_records" (
	"user_id" varchar(255) NOT NULL,
	"task_id" varchar(255) NOT NULL,
	"task_type" varchar(50) NOT NULL,
	"model" varchar(50) NOT NULL,
	"prompt" text NOT NULL,
	"prompt_zh" text,
	"negative_prompt" text,
	"resolution" varchar(20) NOT NULL,
	"duration" integer NOT NULL,
	"aspect_ratio" varchar(10) NOT NULL,
	"seed" integer,
	"is_public" boolean DEFAULT false NOT NULL,
	"credits_cost" integer NOT NULL,
	"status" varchar(20) NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"video_url" text,
	"thumbnail_url" text,
	"actual_duration" double precision,
	"format" varchar(10) DEFAULT 'mp4' NOT NULL,
	"error_message" text,
	"completed_at" timestamp(6) with time zone,
	"share_id" varchar(12),
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone,
	"api_cost" double precision,
	"view_count" integer DEFAULT 0 NOT NULL,
	"external_task_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "image_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"task_id" varchar(255) NOT NULL,
	"model" varchar(100) NOT NULL,
	"prompt" text NOT NULL,
	"aspect_ratio" varchar(20) NOT NULL,
	"quality" varchar(20) NOT NULL,
	"status" varchar(20) NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"image_url" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"credits_used" integer NOT NULL,
	"error" text,
	"completed_at" timestamp(6) with time zone,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone
);
--> statement-breakpoint
CREATE TABLE "music_records" (
	"user_id" varchar(255) NOT NULL,
	"task_id" varchar(255) NOT NULL,
	"external_task_id" varchar(255),
	"model" varchar(50) NOT NULL,
	"prompt" text NOT NULL,
	"style" varchar(500),
	"title" varchar(200),
	"lyrics" text,
	"is_instrumental" boolean DEFAULT false NOT NULL,
	"is_custom_mode" boolean DEFAULT false NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"credits_cost" integer NOT NULL,
	"status" varchar(20) NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"audio_url" text,
	"audio_url_2" text,
	"stream_url" text,
	"stream_url_2" text,
	"cover_url" text,
	"cover_url_2" text,
	"duration" double precision,
	"duration_2" double precision,
	"tags" varchar(500),
	"error_message" text,
	"completed_at" timestamp(6) with time zone,
	"share_id" varchar(12),
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone,
	"external_track_id" varchar(255),
	"external_track_id_2" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "dialogue_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"task_id" varchar(255) NOT NULL,
	"external_task_id" varchar(255),
	"dialogue_json" text NOT NULL,
	"total_characters" integer NOT NULL,
	"credits_cost" integer NOT NULL,
	"status" varchar(20) NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"audio_url" text,
	"duration" double precision,
	"error_message" text,
	"completed_at" timestamp(6) with time zone,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone,
	"is_public" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "native_banners" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"link_url" text,
	"titles" json NOT NULL,
	"subtitles" json NOT NULL,
	"button_texts" json,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone
);
--> statement-breakpoint
CREATE TABLE "video_download_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"url" text NOT NULL,
	"platform" varchar(50),
	"video_title" text,
	"video_author" text,
	"status" varchar(20) NOT NULL,
	"error_code" varchar(50),
	"credits_cost" integer DEFAULT 0 NOT NULL,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscription_history" ADD CONSTRAINT "subscription_history_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "public"."user_subscriptions"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tts_records" ADD CONSTRAINT "tts_records_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "fk_user_subscriptions_user_id_users" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_illustrations" ADD CONSTRAINT "story_illustrations_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "story_paragraphs" ADD CONSTRAINT "story_paragraphs_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "idx_anonymous_users_converted_to_user_id" ON "anonymous_users" USING btree ("converted_to_user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_anonymous_users_device_fingerprint" ON "anonymous_users" USING btree ("device_fingerprint" text_ops);--> statement-breakpoint
CREATE INDEX "idx_anonymous_users_expires_at" ON "anonymous_users" USING btree ("expires_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_anonymous_users_last_used_at" ON "anonymous_users" USING btree ("last_used_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_anonymous_users_platform" ON "anonymous_users" USING btree ("platform" text_ops);--> statement-breakpoint
CREATE INDEX "idx_anonymous_users_user_id" ON "anonymous_users" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_anonymous_users_device_fingerprint" ON "anonymous_users" USING btree ("device_fingerprint" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_anonymous_users_user_id" ON "anonymous_users" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_subscription_history_created_at" ON "subscription_history" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "ix_subscription_history_event_type" ON "subscription_history" USING btree ("event_type" text_ops);--> statement-breakpoint
CREATE INDEX "ix_subscription_history_subscription_id" ON "subscription_history" USING btree ("subscription_id" int4_ops);--> statement-breakpoint
CREATE INDEX "ix_subscription_history_user_id" ON "subscription_history" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "subscription_history_stripe_event_id_key" ON "subscription_history" USING btree ("stripe_event_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_user_email" ON "users" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX "idx_user_id" ON "users" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_user_platform" ON "users" USING btree ("platform" text_ops);--> statement-breakpoint
CREATE INDEX "ix_tts_records_is_public" ON "tts_records" USING btree ("is_public" bool_ops);--> statement-breakpoint
CREATE INDEX "ix_tts_records_platform" ON "tts_records" USING btree ("platform" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ix_tts_records_share_id" ON "tts_records" USING btree ("share_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_tts_records_status" ON "tts_records" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "ix_tts_records_story_id" ON "tts_records" USING btree ("story_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ix_tts_records_task_id" ON "tts_records" USING btree ("task_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_tts_records_user_created" ON "tts_records" USING btree ("user_id" timestamptz_ops,"created_at" text_ops);--> statement-breakpoint
CREATE INDEX "ix_tts_records_user_id" ON "tts_records" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_tts_records_user_status" ON "tts_records" USING btree ("user_id" text_ops,"status" text_ops);--> statement-breakpoint
CREATE INDEX "ix_tts_records_user_status_created" ON "tts_records" USING btree ("user_id" text_ops,"status" timestamptz_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_credit_history_created_at" ON "credit_history" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_credit_history_product_type" ON "credit_history" USING btree ("product_type" text_ops);--> statement-breakpoint
CREATE INDEX "idx_credit_history_task_id" ON "credit_history" USING btree ("task_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_credit_history_user_created" ON "credit_history" USING btree ("user_id" timestamptz_ops,"created_at" text_ops);--> statement-breakpoint
CREATE INDEX "idx_credit_history_user_id" ON "credit_history" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_voices_country" ON "voices" USING btree ("country" text_ops);--> statement-breakpoint
CREATE INDEX "ix_voices_is_active" ON "voices" USING btree ("is_active" bool_ops);--> statement-breakpoint
CREATE INDEX "ix_voices_locale" ON "voices" USING btree ("locale" text_ops);--> statement-breakpoint
CREATE INDEX "ix_voices_locale_active" ON "voices" USING btree ("locale" text_ops,"is_active" bool_ops);--> statement-breakpoint
CREATE INDEX "ix_voices_name" ON "voices" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "ix_voices_provider" ON "voices" USING btree ("provider" text_ops);--> statement-breakpoint
CREATE INDEX "ix_voices_provider_country" ON "voices" USING btree ("provider" text_ops,"country" text_ops);--> statement-breakpoint
CREATE INDEX "ix_voices_role" ON "voices" USING btree ("role" text_ops);--> statement-breakpoint
CREATE INDEX "ix_voices_role_country" ON "voices" USING btree ("role" text_ops,"country" text_ops);--> statement-breakpoint
CREATE INDEX "ix_voices_sort_active" ON "voices" USING btree ("sort_order" bool_ops,"is_active" bool_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_voices_name" ON "voices" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "ix_user_subscriptions_end_date" ON "user_subscriptions" USING btree ("end_date" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "ix_user_subscriptions_platform_ext_sub" ON "user_subscriptions" USING btree ("platform" text_ops,"external_subscription_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_user_subscriptions_platform_ext_txn" ON "user_subscriptions" USING btree ("platform" text_ops,"external_transaction_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_user_subscriptions_product_id" ON "user_subscriptions" USING btree ("product_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ix_user_subscriptions_request_id" ON "user_subscriptions" USING btree ("request_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_user_subscriptions_status" ON "user_subscriptions" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "ix_user_subscriptions_status_end_date" ON "user_subscriptions" USING btree ("status" text_ops,"end_date" text_ops);--> statement-breakpoint
CREATE INDEX "ix_user_subscriptions_user_id" ON "user_subscriptions" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_user_subscriptions_user_status" ON "user_subscriptions" USING btree ("user_id" text_ops,"status" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "app_releases_platform_version_key" ON "app_releases" USING btree ("platform" text_ops,"version" text_ops);--> statement-breakpoint
CREATE INDEX "ix_app_releases_platform_active" ON "app_releases" USING btree ("platform" text_ops,"is_active" text_ops);--> statement-breakpoint
CREATE INDEX "ix_app_releases_platform_latest" ON "app_releases" USING btree ("platform" text_ops,"is_latest" text_ops);--> statement-breakpoint
CREATE INDEX "ix_app_releases_platform_version_code" ON "app_releases" USING btree ("platform" text_ops,"version_code" int4_ops);--> statement-breakpoint
CREATE INDEX "ix_user_events_created_at" ON "user_events" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "ix_user_events_event" ON "user_events" USING btree ("event" text_ops);--> statement-breakpoint
CREATE INDEX "ix_user_events_user_event" ON "user_events" USING btree ("user_id" text_ops,"event" text_ops);--> statement-breakpoint
CREATE INDEX "ix_user_events_user_id" ON "user_events" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_daily_tasks_date" ON "daily_tasks" USING btree ("date" text_ops);--> statement-breakpoint
CREATE INDEX "ix_daily_tasks_user_id" ON "daily_tasks" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_daily_tasks_user_date" ON "daily_tasks" USING btree ("user_id" text_ops,"date" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ad_reward_transactions_transaction_id_key" ON "ad_reward_transactions" USING btree ("transaction_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_ad_reward_transactions_processed" ON "ad_reward_transactions" USING btree ("processed" bool_ops);--> statement-breakpoint
CREATE INDEX "ix_ad_reward_transactions_timestamp" ON "ad_reward_transactions" USING btree ("timestamp" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "ix_ad_reward_transactions_user_id" ON "ad_reward_transactions" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_stories_created_at" ON "stories" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "ix_stories_status" ON "stories" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "ix_stories_user_created" ON "stories" USING btree ("user_id" text_ops,"created_at" text_ops);--> statement-breakpoint
CREATE INDEX "ix_stories_user_id" ON "stories" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_stories_user_status" ON "stories" USING btree ("user_id" text_ops,"status" text_ops);--> statement-breakpoint
CREATE INDEX "ix_rvc_voice_models_category" ON "rvc_voice_models" USING btree ("category" text_ops);--> statement-breakpoint
CREATE INDEX "ix_rvc_voice_models_is_active" ON "rvc_voice_models" USING btree ("is_active" bool_ops);--> statement-breakpoint
CREATE INDEX "ix_rvc_voice_models_is_builtin" ON "rvc_voice_models" USING btree ("is_builtin" bool_ops);--> statement-breakpoint
CREATE INDEX "ix_rvc_voice_models_sort_order" ON "rvc_voice_models" USING btree ("sort_order" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "rvc_voice_models_slug_key" ON "rvc_voice_models" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "ix_story_illustrations_position" ON "story_illustrations" USING btree ("position" int4_ops);--> statement-breakpoint
CREATE INDEX "ix_story_illustrations_status" ON "story_illustrations" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "ix_story_illustrations_story_id" ON "story_illustrations" USING btree ("story_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_story_illustrations_type" ON "story_illustrations" USING btree ("type" text_ops);--> statement-breakpoint
CREATE INDEX "ix_story_paragraphs_position" ON "story_paragraphs" USING btree ("position" int4_ops);--> statement-breakpoint
CREATE INDEX "ix_story_paragraphs_story_id" ON "story_paragraphs" USING btree ("story_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_story_paragraphs_story_position" ON "story_paragraphs" USING btree ("story_id" int4_ops,"position" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "cover_records_share_id_key" ON "cover_records" USING btree ("share_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "cover_records_task_id_key" ON "cover_records" USING btree ("task_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_cover_records_status" ON "cover_records" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "ix_cover_records_user_created" ON "cover_records" USING btree ("user_id" timestamptz_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "ix_cover_records_user_id" ON "cover_records" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_cover_records_user_status" ON "cover_records" USING btree ("user_id" text_ops,"status" text_ops);--> statement-breakpoint
CREATE INDEX "ix_cover_records_voice_model_id" ON "cover_records" USING btree ("voice_model_id" int4_ops);--> statement-breakpoint
CREATE INDEX "ix_share_links_expires_at" ON "share_links" USING btree ("expires_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "ix_share_links_resource" ON "share_links" USING btree ("resource_type" text_ops,"resource_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_share_links_token" ON "share_links" USING btree ("token" text_ops);--> statement-breakpoint
CREATE INDEX "ix_share_links_user_id" ON "share_links" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "share_links_token_key" ON "share_links" USING btree ("token" text_ops);--> statement-breakpoint
CREATE INDEX "ix_video_records_external_task_id" ON "video_records" USING btree ("external_task_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_video_records_is_public" ON "video_records" USING btree ("is_public" bool_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ix_video_records_share_id" ON "video_records" USING btree ("share_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_video_records_status" ON "video_records" USING btree ("status" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ix_video_records_task_id" ON "video_records" USING btree ("task_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_video_records_user_created" ON "video_records" USING btree ("user_id" text_ops,"created_at" text_ops);--> statement-breakpoint
CREATE INDEX "ix_video_records_user_id" ON "video_records" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_video_records_user_status" ON "video_records" USING btree ("user_id" text_ops,"status" text_ops);--> statement-breakpoint
CREATE INDEX "ix_video_records_user_status_created" ON "video_records" USING btree ("user_id" timestamptz_ops,"status" text_ops,"created_at" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "image_records_task_id_key" ON "image_records" USING btree ("task_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_image_records_is_public" ON "image_records" USING btree ("is_public" bool_ops);--> statement-breakpoint
CREATE INDEX "ix_image_records_status" ON "image_records" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "ix_image_records_user_created" ON "image_records" USING btree ("user_id" timestamptz_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "ix_image_records_user_id" ON "image_records" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_image_records_user_status" ON "image_records" USING btree ("user_id" text_ops,"status" text_ops);--> statement-breakpoint
CREATE INDEX "ix_music_records_external_task_id" ON "music_records" USING btree ("external_task_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_music_records_is_public" ON "music_records" USING btree ("is_public" bool_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ix_music_records_share_id" ON "music_records" USING btree ("share_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_music_records_status" ON "music_records" USING btree ("status" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ix_music_records_task_id" ON "music_records" USING btree ("task_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_music_records_user_created" ON "music_records" USING btree ("user_id" timestamptz_ops,"created_at" text_ops);--> statement-breakpoint
CREATE INDEX "ix_music_records_user_id" ON "music_records" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_music_records_user_status" ON "music_records" USING btree ("user_id" text_ops,"status" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "dialogue_records_task_id_key" ON "dialogue_records" USING btree ("task_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_dialogue_records_external_task_id" ON "dialogue_records" USING btree ("external_task_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_dialogue_records_is_public" ON "dialogue_records" USING btree ("is_public" bool_ops);--> statement-breakpoint
CREATE INDEX "ix_dialogue_records_status" ON "dialogue_records" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "ix_dialogue_records_user_created" ON "dialogue_records" USING btree ("user_id" timestamptz_ops,"created_at" text_ops);--> statement-breakpoint
CREATE INDEX "ix_dialogue_records_user_id" ON "dialogue_records" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_native_banners_active_sort" ON "native_banners" USING btree ("is_active" int4_ops,"sort_order" int4_ops);--> statement-breakpoint
CREATE INDEX "ix_video_download_records_created_at" ON "video_download_records" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "ix_video_download_records_platform" ON "video_download_records" USING btree ("platform" text_ops);--> statement-breakpoint
CREATE INDEX "ix_video_download_records_status" ON "video_download_records" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "ix_video_download_records_user_id" ON "video_download_records" USING btree ("user_id" text_ops);
*/