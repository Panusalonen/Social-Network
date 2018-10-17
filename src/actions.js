import axios from './axios';

export function receiveUsers() {
    // console.log("actions");
    return axios
        .get(`/getWannabeFriends`)
        .then(response => {
            console.log("Response in receiveUsers: ", response);
            return {
                type: 'RECEIVE_FRIEND_WANNABES',
                users: response.data
            };
        })
        .catch(e => console.log("catch in receiveFriendsWannabes: ", e));
}
export function acceptFriendRequest(props) {
    let receiver_id = props;
    let status = 2;
    return axios
        .post(`/sendFriendRequest`, {
            status: status,
            receiver_id: receiver_id
        })
        .then(response => {
            return {
                type: "ACCEPT_FRIEND_REQUEST",
                receiver_id
            };
        })
        .catch(e => console.log("catch in acceptFriendRequest: ", e));
}
export function unfriend(props) { // goes to server --> delete user from friends-table
    var receiver_id = props;
    console.log("receiver_id", receiver_id);
    return axios
        .post(`/deleteRequest`, {

            receiver_id: receiver_id
        })
        .then(response => {
            console.log("response in unfriend: ", response);
            return {
                type: "UNFRIEND",
                receiver_id
            };
        })
        .catch(e => console.log("catch in unfriend: ", e));
}
export function onlineUsers(users){
    console.log("ONLINE_USERS running!");
    return {
        type: "ONLINE_USERS",
        users
    };
}
export function newUserJoined(users){
    console.log("NEW_USER_JOINED running!");
    return {
        type: "NEW_USER_JOINED",
        users
    };
}
export function userLeft(userId){
    console.log("USER_LEFT running!");
    return {
        type: "USER_LEFT",
        userId
    };
}

////// CHAT //////

export function chatMessages(recentMsgs){
    console.log("CHAT_MESSAGES running!");
    return {
        type: "CHAT_MESSAGES",
        recentMsgs
    };
}

export function newChatMessage(latestMsg){
    console.log("NEW_MESSAGE running!", latestMsg);
    return {
        type: "NEW_MESSAGE",
        latestMsg: latestMsg
    };
}

export function notifyUser(notification){
    console.log("NOTIFY_USER running!", notification);
    return {
        type: "NOTIFY_USER",
        notification
    };
}
