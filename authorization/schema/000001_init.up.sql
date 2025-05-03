CREATE TABLE users
(
    id           serial primary key,
    name         varchar not null,
    password     varchar not null,
    email        varchar not null unique,
    age          integer not null check (age >= 18 and age <= 70)
);
ALTER TABLE users ADD COLUMN role varchar NOT NULL DEFAULT 'worker';

