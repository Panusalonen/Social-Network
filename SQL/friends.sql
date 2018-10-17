DROP TABLE IF EXISTS friends;

CREATE TABLE friends(
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES users(id),
    receiver_id INT NOT NULL REFERENCES users(id),
    status INT NOT NULL DEFAULT 1
);

SELECT * FROM friends;
