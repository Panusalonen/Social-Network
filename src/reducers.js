export default function(state = {}, action) {
    if (action.type == 'RECEIVE_FRIEND_WANNABES') {
        console.log("Action in WANNABES!: ", action);
        state = {
            ...state,
            users: action.users,
            buttonText: "Wanna B Friends?"
        };
    }
    if (action.type == 'ACCEPT_FRIEND_REQUEST') {
        state = {
            ...state,
            users: state.users.map(user => {
                // console.log("out super id:", friend.id);
                // console.log("reciever ID", action.receiver_id);
                if (user.id == action.receiver_id) {
                    // console.log("we Are here in Making Friends!");
                    return {
                        ...user,
                        status: (user.status = 2)
                    };
                } else {
                    return user;
                }
            })
        };
    }
    if (action.type == 'UNFRIEND' ){
        console.log("Action in UNFRIEND!: ", action);
        state = {
            ...state,
            users:
                state.users &&
                state.users.filter(user => user.id != action.receiver_id)
        };
    }
    if (action.type == "ONLINE_USERS"){
        console.log("Action in ONLINE_USERS!: ", action.users);
        state = {
            ...state,
            users: action.users
        };
    }
    if (action.type == "NEW_USER_JOINED"){
        console.log("Action in NEW_USER_JOINED!: ", action.users);
        state = {
            ...state,
            users: state.users.concat(action.users)
        };
    }
    if (action.type == "USER_LEFT"){
        console.log("Action in USER_LEFT!: ", action.users);

        const usersOnlineUpdated = state.users.filter(user => {
            return user.id != action.userId;
        });
        state = {
            ...state,
            users: usersOnlineUpdated
        };
    }

    if (action.type == "CHAT_MESSAGES"){
        console.log("Action in CHAT_MESSAGES", action.recentMsgs);
        state = {
            ...state,
            recentMsgs: action.recentMsgs
        };
    }

    if (action.type == "NEW_MESSAGE"){
        console.log("Action in NEW_MESSAGE", action.latestMsg);
        state = {
            ...state,
            recentMsgs: [...state.recentMsgs, action.latestMsg]
        };
    }

    if (action.type == "NOTIFY_USER"){
        console.log("NOTIFY_USER ", action.notification);
        state = {
            ...state,
            notification: action.notification
        };
    }
    // console.log("State in reducers: ", state);
    // console.log("action.users: ", action.users);
    return state;
}
