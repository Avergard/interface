CREATE TABLE income_goods
(
    id           serial primary key,
    name         varchar not null,
    goods_code   varchar not null,
    count        smallint not null,
    description  text not null
);

INSERT INTO income_goods (name, goods_code, count, description) VALUES
    ('Dyson Detect5', '235223', '1000', 'Просто хороший пылесос'),
    ('Iphone 16 pro', '235234223', '10000', 'Просто хороший смартфон'),
    ('WLMOUSE YING63', '124265', '234', 'Просто хорошая клавиатура'),
    ('AndaSeat Kaiser 3 Linen Fabric Carbon Black', '63', '76', 'Просто хорошее кресло'),
    ('MSI GeForce RTX 5070 12G VENTUS 2X', '432', '1000', 'Просто хорошая видеокарта');
