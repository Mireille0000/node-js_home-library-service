CREATE TABLE users(
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    password VARCHAR(255),
    version INT,
    created_at INT,
    updated_at INT
);