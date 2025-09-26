-- Table for bean definitions (core bean information)
CREATE TABLE IF NOT EXISTS beansDefinitions (
  id TEXT PRIMARY KEY DEFAULT (uuid()), -- GUID primary key generated with uuid()
  bean_id TEXT UNIQUE NOT NULL, -- Original _id from seed data
  index_number INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table for bean images
CREATE TABLE IF NOT EXISTS beanImages (
  id TEXT PRIMARY KEY DEFAULT (uuid()), -- GUID primary key generated with uuid()
  bean_definition_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bean_definition_id) REFERENCES beansDefinitions(id) ON DELETE CASCADE
);

-- Table for bean metadata (color, cost, country, botd status)
CREATE TABLE IF NOT EXISTS beanMetadata (
  id TEXT PRIMARY KEY DEFAULT (uuid()), -- GUID primary key generated with uuid()
  bean_definition_id TEXT NOT NULL, 
  color TEXT,
  cost TEXT NOT NULL,
  country TEXT,
  is_botd INTEGER NOT NULL DEFAULT 0 CHECK (is_botd IN (0, 1)),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bean_definition_id) REFERENCES beansDefinitions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_beansDefinitions_bean_id ON beansDefinitions(bean_id);
CREATE INDEX IF NOT EXISTS idx_beansDefinitions_name ON beansDefinitions(name);
CREATE INDEX IF NOT EXISTS idx_beansDefinitions_index_number ON beansDefinitions(index_number);

CREATE INDEX IF NOT EXISTS idx_beanImages_bean_definition_id ON beanImages(bean_definition_id);

CREATE INDEX IF NOT EXISTS idx_beanMetadata_bean_definition_id ON beanMetadata(bean_definition_id);
CREATE INDEX IF NOT EXISTS idx_beanMetadata_color ON beanMetadata(color);
CREATE INDEX IF NOT EXISTS idx_beanMetadata_country ON beanMetadata(country);
CREATE INDEX IF NOT EXISTS idx_beanMetadata_is_botd ON beanMetadata(is_botd);

CREATE TRIGGER IF NOT EXISTS update_beansDefinitions_timestamp 
  AFTER UPDATE ON beansDefinitions
  BEGIN
    UPDATE beansDefinitions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_beanMetadata_timestamp 
  AFTER UPDATE ON beanMetadata
  BEGIN
    UPDATE beanMetadata SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;