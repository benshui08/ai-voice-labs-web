CREATE TABLE "bull_bear_rounds" (
  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "round_id" text NOT NULL,
  "user_id" text NOT NULL,
  "bet_amount" real NOT NULL,
  "direction" text NOT NULL,
  "duration_seconds" integer NOT NULL,
  "multiplier" real NOT NULL,
  "entry_price" real NOT NULL,
  "settle_price" real,
  "outcome" text,
  "profit" real,
  "status" text NOT NULL,
  "started_at" text NOT NULL,
  "settled_at" text,
  "created_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
  "updated_at" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX "uq_bull_bear_rounds_round_id" ON "bull_bear_rounds" ("round_id");
--> statement-breakpoint
CREATE INDEX "idx_bull_bear_rounds_user_id" ON "bull_bear_rounds" ("user_id");
--> statement-breakpoint
CREATE INDEX "idx_bull_bear_rounds_user_created" ON "bull_bear_rounds" ("user_id", "created_at");
--> statement-breakpoint
CREATE INDEX "idx_bull_bear_rounds_status" ON "bull_bear_rounds" ("status");
--> statement-breakpoint
CREATE INDEX "idx_bull_bear_rounds_created_at" ON "bull_bear_rounds" ("created_at");
--> statement-breakpoint
CREATE TABLE "bull_bear_config" (
  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "enabled" integer DEFAULT false NOT NULL,
  "min_bet" real DEFAULT 1 NOT NULL,
  "max_bet" real DEFAULT 1000 NOT NULL,
  "multiplier_30s" real DEFAULT 1.85 NOT NULL,
  "multiplier_60s" real DEFAULT 1.90 NOT NULL,
  "multiplier_120s" real DEFAULT 1.95 NOT NULL,
  "available_durations" text DEFAULT '[30,60,120]' NOT NULL,
  "updated_at" text
);
