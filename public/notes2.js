// Now we want add functionality for the chat.
// At first we load all messages we store and then create ability to get new messages.

    socket.on('chatMessages', messages => {
        store.dispatch(chatMessages(messages))
    })

    socket.on('newChatMessage', message => {
        store.dispatch(newChatMessage(message))
    })

// we do return socket so we can export wherever we want it and run it from there.

return socket;
}

getSocket().emit('chat', { // on enter or something
 text: "I hate you"
})

io.on('connection', function(socket) {
    db.getRecentMessages(results => {
        socket.emit('chatMessages', results)
    })
    socket.on('chatMessage', function(message) {
        in.socket.emit('chatMessage', {
            message: message,
            id: userId,
            timeStamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleDateString();
        })
    })
})

// we need to show 10 recent messeges
// we can keep an array of messages in the array and display it.
// Probably better to create a Tables with all messages and then create a table. with user id, etc.
// You can join them with other table
// overflow auto
// make

elem.scrollTop = elem.scrollHeight - elem.clientHeight

componentDidUpdate() {
    this.elem.scrollTop =>
}

render() {
return (
    <div>
        <div id="chat-messages" ref={elem => (this.elem) = elem}>
            {this.props.chatMessage.map(
                msg => (
                    <div>msg</div>
                )
            )}
        )
}
