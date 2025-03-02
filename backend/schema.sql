-- CloudFlare D1（SQLite互換）向けのデータベース初期化SQL
-- マルチテナントのウェイトリストSaaSアプリ用

-- APIキーテーブル：ユーザーIDとAPIキーを管理
DROP TABLE IF EXISTS api_keys;
CREATE TABLE api_keys (
  user_id TEXT NOT NULL,
  api_key TEXT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ウェイトリストテーブル：APIキーとメールアドレスを管理
DROP TABLE IF EXISTS waitlist;
CREATE TABLE waitlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  api_key TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (api_key) REFERENCES api_keys(api_key),
  UNIQUE (api_key, email)
);

-- インデックスの作成
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_waitlist_api_key ON waitlist(api_key);
CREATE INDEX idx_waitlist_email ON waitlist(email);