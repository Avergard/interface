-- Добавляем колонки с дефолтными значениями
ALTER TABLE income_goods 
ADD COLUMN created_by_user_id INTEGER DEFAULT 0,
ADD COLUMN created_by_username VARCHAR(255) DEFAULT 'system',
ADD COLUMN created_by_role VARCHAR(50) DEFAULT 'system';

-- Добавляем ограничение NOT NULL
ALTER TABLE income_goods 
ALTER COLUMN created_by_user_id SET NOT NULL,
ALTER COLUMN created_by_username SET NOT NULL,
ALTER COLUMN created_by_role SET NOT NULL;

-- Убираем дефолтные значения
ALTER TABLE income_goods 
ALTER COLUMN created_by_user_id DROP DEFAULT,
ALTER COLUMN created_by_username DROP DEFAULT,
ALTER COLUMN created_by_role DROP DEFAULT; 