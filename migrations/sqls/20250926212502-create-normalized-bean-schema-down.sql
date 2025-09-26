DROP TRIGGER IF EXISTS update_beanMetadata_timestamp;
DROP TRIGGER IF EXISTS update_beansDefinitions_timestamp;

DROP INDEX IF EXISTS idx_beanMetadata_is_botd;
DROP INDEX IF EXISTS idx_beanMetadata_country;
DROP INDEX IF EXISTS idx_beanMetadata_color;
DROP INDEX IF EXISTS idx_beanMetadata_bean_definition_id;

DROP INDEX IF EXISTS idx_beanImages_image_url;
DROP INDEX IF EXISTS idx_beanImages_bean_definition_id;

DROP INDEX IF EXISTS idx_beansDefinitions_index_number;
DROP INDEX IF EXISTS idx_beansDefinitions_name;
DROP INDEX IF EXISTS idx_beansDefinitions_bean_id;

DROP TABLE IF EXISTS beanMetadata;
DROP TABLE IF EXISTS beanImages;
DROP TABLE IF EXISTS beansDefinitions;