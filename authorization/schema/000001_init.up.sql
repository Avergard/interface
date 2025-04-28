CREATE TABLE users
(
    id           serial primary key,
    name         varchar not null,
    nickname     varchar not null,
    phone_number varchar not null unique,
    password     varchar not null,
    email        varchar not null unique,
    age          integer not null check (age >= 18 and age <= 70)
);