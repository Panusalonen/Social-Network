import * as io from 'socket.io-client';
import { onlineUsers, newUserJoined, userLeft, chatMessages, newChatMessage, notifyUser } from './actions';

let socket;

export function getSocket(store){
    if (!socket){
        socket = io.connect();
        socket.on('onlineUsers', data => {
            console.log("onlineUsers from server: ", data);
            store.dispatch(onlineUsers(data));
            // dispatch in action
        });
        socket.on('newUserJoined', data => {
            console.log("userJoined from server: ", data);
            store.dispatch(newUserJoined(data));
            // dispatch in action
        });
        socket.on('userLeft', data => {
            console.log("onlineUsers from server: ", data);
            store.dispatch(userLeft(data));
            // dispatch in action
        });

        ////// CHAT //////

        socket.on('chatMessages', messages => {
            store.dispatch(chatMessages(messages));
        });
        socket.on('newChatMessage', message => {
            store.dispatch(newChatMessage(message));
        });

        ////// NOTIFICATION //////

        socket.on('notification', data => {
            console.log("NOTIFICATION RECEIVED!");
            store.dispatch(notifyUser(data));
        });
    }
    return socket;
}
