CREATE TABLE IF NOT EXISTS help_requests (
  id TEXT PRIMARY KEY,
  message TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  accuracy REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'em_atendimento', 'encerrado')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_help_requests_created_at
  ON help_requests (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_help_requests_status
  ON help_requests (status);
