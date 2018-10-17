const express = require("express");
const app = express();
const compression = require("compression");
const ca = require("chalk-animation");

const db = require("./SQL/db.js");
const secrets = require('./secrets.json');
const { hashPass, checkPass } = require("./public/hashing.js");

const bodyParser = require('body-parser');
const csurf = require('csurf');
const s3 = require("./s3");
const config = require("./config");

//////// SOCKET /////////

const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });

//////// MIDDLEWARE /////////

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./public"));
app.use(compression());
app.use(require('cookie-parser')());

const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: secrets.secret, //
    maxAge: 1000 * 60 * 60 * 24 * 90
});
app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

// const cookieSession = require("cookie-session");
// app.use(
//     cookieSession({
//         secret: secrets.secret,
//         maxAge: 1000 * 60 * 60 * 24 * 14
//     })
// );

app.use(
    bodyParser.json());

app.use(csurf());
app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
    next();
});

//////// MULTER ////////

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

//////// ROUTING ////////

app.post("/registration", (req, res) => {

    let { first, last, email, password } = req.body;
    hashPass(password).then(hash => {
        db
            .createUser(
                first,
                last,
                email,
                hash
            )
            .then(
                id => {
                    console.log("Id in REG: ", id);
                    req.session.user = id.rows[0];
                    res.json({
                        success: true
                    });
                })
            .catch(error => {
                console.log("logataan erroriiii", error);
                res.json({
                    success: false
                });
            });
    })
        .catch(error => {
            console.log("Error in reg: ", error);
            res.json({
                success: false,
            });
        });
});

app.post("/login", (req, res) => {

    db.returnPass(req.body.email).then(result => {

        let user = result.rows[0];
        // console.log("user: ", user);
        checkPass(req.body.password, user.password)
            .then(result => {
                if (result) {
                    req.session = {
                        user: {
                            first: user.first,
                            last: user.last,
                            id: user.id,
                            imageUrl: user.image_url,
                            bio: user.bio
                        }
                    };
                    res.json({
                        data: req.session,
                        success: true
                    });
                } else {
                    throw new Error();
                }
            })
            .catch(err => {
                console.log("error in checkpass: ", err);
                res.json({success: false});
            });
    })
        .catch(err => {
            console.log("error in returnpass: ", err);
            res.json({success: false});
        });
});

app.get("/logout", (req, res) => {
    // req.session.destroy
    req.session = null;
    res.redirect("/welcome#/");
});

app.post('/upload', uploader.single("file"), s3.upload, (req, res) => {

    if (req.session == null){
        res.redirect("/welcome#/");
    }

    db.updateImage(
        config.s3Url + req.file.filename,
        req.session.user.id
    )
        .then(() => {
            req.session.user.imageUrl = config.s3Url + req.file.filename;
            res.json({
                imageUrl: config.s3Url + req.file.filename
            });
        })
        .catch(() => {
            res.status(500).json({
                success: false
            });
        });
});

app.post('/bio', (req, res) => {
    // console.log("bio: ", req.body.bio);
    db.updateBio(
        req.body.bio,
        req.session.user.id
    ).then(() => {
        req.session.user.bio = req.body.bio;
        // console.log("UDsession: ", req.session);
        res.json({
            success: true
        });
    })
        .catch(error => {
            console.log("error in post-bio", error);
        });
});

app.get("/user", (req, res) =>{
    res.json(req.session.user);
    // console.log("req.session.user ", req.session.user);
});

app.get("/welcome", function(req, res) {
    if (req.session.user) {
        return res.redirect("/");
    }
    res.sendFile(__dirname + "/index.html");
});

app.get('/get-user/:userId', (req, res) => {

    if (req.session == null){
        res.redirect("/welcome#/");
    }

    if (req.params.userId == req.session.user.id){
        return res.json({
            ownProfile: true
        });
    }
    db.otherProfile(req.params.userId)
        .then(response => {
            // console.log("response: ", response.rows[0]);
            res.json(
                response.rows[0]
            );
        })
        .catch(error => {
            console.log("error in otherProfile", error);
        });
});

app.get('/friends', (req, res) => {

    let receiver_id = req.query.receiver_id;
    let sender_id = req.session.user.id;
    // console.log("Receiver:", receiver_id);
    // console.log("Sender:", sender_id);
    db.friends(receiver_id, sender_id)
        .then(response => {
            console.log("friendsResponse: ", response);
            res.json(response.rows[0]);
        }).catch(error => {
            console.log("Error in friends: ", error);
        });
});

app.post('/sendFriendRequest', (req, res) => {

    let status = req.body.status;
    let sender_id = req.session.user.id;
    let receiver_id = req.body.receiver_id;

    if (status == 1){
        console.log("We are in status 1");
        db.newRequest(status, receiver_id, sender_id)
            .then(response => {
                res.json(response.rows[0]);

            });
    } else {
        db.createRequest(status, receiver_id, sender_id).then(response => {
            // console.log("Results form sending request", response.rows[0]);
            res.json(response.rows[0]);

        })
            .catch(error => {
                console.log("error in creating request: ", error);
            });
    }
});

app.post("/deleteRequest", (req, res) => {
    var sender_id = req.session.user.id;
    // console.log(sender_id);
    var receiver_id = req.body.receiver_id;
    // console.log(reciever_id);
    db.deleteRequest(receiver_id, sender_id).then(() => {
        res.json("");
    })
        .catch(error => {
            console.log("error in deleting request: ", error);
        });
});

app.get('/getWannabeFriends', (req, res) => {
    db.getWannabeeFriends(req.session.user.id)
        .then(response => {
            res.json(response.rows);
        });
});

app.post('/searchUsers', (req, res) => {
    console.log("SEARCHUSERS: ", req.body);
    db.searchUsers(req.body.searchValue)
        .then(response => {
            res.json(response.rows);
        })
        .catch(err => {
            console.log("ERROR in search: ", err);
        });
});

////////// DONT TOUCH ///////////

app.get("*", function(req, res) {
    if (!req.session.user) {
        return res.redirect("/welcome");
    }
    res.sendFile(__dirname + "/index.html");
});

server.listen(process.env.PORT || 8080,
    () => ca.rainbow("I'm listening, Master"));

////// SERVER-SIDE SOCKET CODE HERE //////
////// KEEPS TRACK OF EVERYBODY WHO IS ONLINE //////

let onlineUsers = {};

io.on('connection', (socket) => {
    // console.log(`socket with id ${socket.id} has connected!`);
    if (!socket.request.session || !socket.request.session.user) {
        return socket.disconnect(true);
    }
    // console.log("socket request session: ", socket.request.session);
    const socketId = socket.id;
    const userId = socket.request.session.user.id;
    const image = socket.request.session.user.imageUrl;
    console.log("IMAGE: ", image);

    onlineUsers[socketId] = userId;
    // console.log('onlineUsers: ', onlineUsers);
    let arrayOfUserIds = Object.values(onlineUsers);

    db.getUsersByIds(arrayOfUserIds)
        .then(results => {
            // console.log("results in getUsersByIds: ", results);
            console.log("arrayOfUserIds: ", arrayOfUserIds);
            socket.emit('onlineUsers', results.rows);
        });
    if (arrayOfUserIds.filter(id => id == userId).length == 1) {
        // console.log("userId: ", userId);
        // console.log("socket.request.session.user.id: ", socket.request.session.user.id);
        // console.log("Checking the conditions");
        db.getUserInfo(userId).then(results => {
            // console.log("onlineUsers: ", onlineUsers);
            // console.log("onlineUsers[socketId]: ", onlineUsers[socketId]);
            // console.log("New user logged in info: ", results.rows[0]);
            // console.log("userId getUserInfo: ", userId);
            socket.broadcast.emit('newUserJoined', results.rows);
            console.log("results.rows: ", results.rows);
        });
    }
    socket.on('disconnect', () => {
        // console.log(`socket with id ${socketId} has left`);
        // console.log("onlineUsers[socketId]: ", onlineUsers[socketId]);
        delete onlineUsers[socketId];
        let checkId = Object.values(onlineUsers).find(id => id == userId);
        // If any of the users have the same userId than the user who left, you don't wanna
        // remove the user from onilne users.
        if (!checkId){
            io.sockets.emit('userLeft', userId);
        }
    });
    db.getRecentMessages().then(results => {
        socket.emit('chatMessages', results.rows.reverse());
    });
    socket.on('chat', message => {
        console.log("socket.request.session", socket.request.session);
        let newDetails = [
            {
                id: socket.request.session.user.id,
                first: socket.request.session.user.first,
                last: socket.request.session.user.last,
                image_url: image
            }
        ];
        db.addMessage(userId, message, image)
            .then(results => {
                let userDetails = Object.assign({}, newDetails[0], results.rows[0]);
                console.log("userDetails???: ", userDetails);
                io.sockets.emit('newChatMessage', userDetails);
            });
    });
    socket.on('makeFriends', (id) => {
        // console.log("ID: ", id);
        for (var key in onlineUsers){
            // console.log(onlineUsers[key]);
            if (onlineUsers[key] == id){
                // console.log("KEY", key);
                io.sockets.sockets[key].emit("notification", {
                    notification: true,
                    message: "wants to be a friend!",
                    first: socket.request.session.user.first,
                    last: socket.request.session.user.last,
                    image_url: image
                });
            }
        }
    });
});
