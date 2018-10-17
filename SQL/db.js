const spicedPg = require('spiced-pg');
const secrets = require('../secrets.json');

const dbUrl = secrets.dbUrl;

const db = spicedPg(dbUrl);

exports.createUser = (first, last, email, password) => {
    const q =
            `
            INSERT INTO users (first, last, email, password)
            VALUES ($1, $2, $3, $4)
            RETURNING first, last, id
            `;
    return db.query(q, [
        first || null,
        last || null,
        email || null,
        password || null
    ]);
};

exports.returnPass = email => {
    const q =
            `
            SELECT password, first, last, id, image_url, bio
            FROM users
            WHERE email = ($1);
            `;
    return db.query(q, [email]);
};


exports.updateImage = (image_url, id) => {
    const q =
            `
            UPDATE users
            SET image_url = $1
            WHERE id = $2
            `;
    return db.query(q, [image_url, id]);
};

exports.updateBio = (bio, id) => {
    const q =
            `
            UPDATE users
            SET bio = $1
            WHERE id = $2
            `;
    return db.query(q, [bio, id]);
};

exports.otherProfile = id => {
    const q =
            `
            SELECT *
            FROM users
            WHERE id = $1
            `;
    return db.query(q, [id]);
};

exports.friends = (receiver_id, sender_id) => {
    const q =
            `
            SELECT receiver_id, sender_id, status
            FROM friends
            WHERE (receiver_id =$1 AND sender_id =$2)
            OR (receiver_id =$2 AND sender_id = $1
            )
            `;
    return db.query(q, [receiver_id, sender_id]);
};

exports.createRequest = (status, receiver_id, sender_id) => {
    const q =
            `
            UPDATE friends
            SET status = $1
            WHERE (receiver_id =$2 AND sender_id =$3)
            OR (receiver_id =$3 AND sender_id = $2)
            RETURNING status
            `;
    return db.query(q, [status, receiver_id, sender_id]);
};

exports.newRequest = (status, receiver_id, sender_id)  => {
    const q =
            `
            INSERT INTO friends (status, receiver_id, sender_id)
            VALUES ($1, $2, $3)
            RETURNING status
            `;
    return db.query(q, [status, receiver_id, sender_id]);
};

exports.deleteRequest = (receiver_id, sender_id) => {
    const q =
            `
            DELETE FROM friends
            WHERE (receiver_id =$1 AND sender_id =$2)
            OR (receiver_id =$2 AND sender_id = $1)
            `;
    return db.query(q, [receiver_id, sender_id]);
};

exports.getWannabeeFriends = (id) => {
    const q =
            `
            SELECT users.id, first, last, image_url, bio, status
            FROM friends
            JOIN users
            ON (status = 1 AND receiver_id = $1 AND sender_id = users.id)
            OR (status = 2 AND receiver_id = $1 AND sender_id = users.id)
            OR (status = 2 AND sender_id = $1 AND receiver_id = users.id)
            `;
    return db.query(q, [id]);
};
exports.getUsersByIds = (arrayOfUserIds) => {
    const q =
            `
            SELECT *
            FROM users
            WHERE id = ANY($1)
            `;
    return db.query(q, [arrayOfUserIds]);
};

exports.getUserInfo = params => {
    const q =
            `
            SELECT id, first, last, bio, image_url
            FROM users
            WHERE id = $1
            `;
    return db.query(q, [params]);
};

exports.getRecentMessages = () => {
    const q =
            `
            SELECT users.id, users.first, users.last, users.image_url, messages.id as chatid, messages.sender_id, messages.message, messages.created_at
            FROM messages
            LEFT JOIN users
            ON users.id = sender_id
            ORDER BY chatid DESC
            LIMIT 10
            `;
    return db.query(q);
};

exports.addMessage = (userId, message, image_url) => {
    const q =
            `
            INSERT INTO messages (sender_id, message, image_url)
            VALUES ($1, $2, $3)
            RETURNING id as chatid, sender_id, created_at, message, image_url
            `;
    return db.query(q, [userId, message, image_url]);
};

exports.searchUsers = (first, last) => {
    const q =
            `
            SELECT first, last
            FROM users
            `;
    return db.query(q, [first, last]);
};
