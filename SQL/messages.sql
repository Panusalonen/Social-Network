DROP TABLE IF EXISTS messages;

CREATE TABLE messages(
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES users(id),
    image_url VARCHAR(300),
    message VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM messages;
