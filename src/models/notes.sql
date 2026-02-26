CREATE TABLE NOTES IF NOT EXISTS (
    id varchar(50) PRIMARY KEY,
    title varchar(50) NOT NULL,
    body varchar(50) NOT NULL,
    created_at varchar(50),
    updated_at varchar(50),
    user_id varchar(50) UNIQUE NOT NULL,
);