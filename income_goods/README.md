## Консольные команды

1) Вызвать миграционный файл ./schema/000001_init_income.up.sql - `migrate -path ./schema -database 'postgres://postgres:postgres@localhost:5434/postgres?sslmode=disable' up` (предварительно скачать пакеты(для мака) `brew install golang-migrate`)
2) Вызвать миграционный файл ./schema/000001_init.down.sql - `migrate -path ./schema -database 'postgres://postgres:postgres@localhost:5434/postgres?sslmode=disable' down` (предварительно скачать пакеты(для мака) `brew install golang-migrate`)
3) Запустить контейнеры из компоуза `docker compose up`