/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS beans (
  _id TEXT PRIMARY KEY,
  "index" INTEGER NOT NULL,
  isBOTD INTEGER NOT NULL DEFAULT 0 CHECK (isBOTD IN (0, 1)),
  Cost TEXT NOT NULL,
  Image TEXT,
  colour TEXT,
  Name TEXT NOT NULL,
  Description TEXT,
  Country TEXT
);