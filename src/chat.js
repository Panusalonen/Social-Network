import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSocket } from './socket';
import {Link} from 'react-router-dom';


class Chat extends Component {
    constructor(){
        super();
        this.state = {};
        this.saveChatMsg = this.saveChatMsg.bind(this);
    }
    componentDidUpdate() {
        this.elem.scrollTop = this.elem.scrollHeight - this.elem.clientHeight;
    }
    saveChatMsg(e){
        if (e.which === 13){
            getSocket().emit('chat', e.target.value);
            e.target.value = "";
        }
    }
    render() {
        if (!this.props.messages){
            return null;
        }
        return (
            <div className="profile2a">
                <h1 className="h12">Chat<strong>room</strong></h1>
                <div
                    className="chatRoom"
                    ref={elem => (this.elem) = elem}>
                    {this.props.messages.map(message => (
                        <div
                            key={message.chatid}>
                            <div className="chatRoom2">
                                <Link
                                    to={`/user/${message.id}`}>
                                    <img
                                        className="chatImg"
                                        src={message.image_url||"../troll.png"}>
                                    </img>
                                </Link>
                                <div className="chatRoom4">
                                    <h5>{message.first} {message.last} </h5>
                                    <p className="p1">Created at {message.created_at} </p>
                                </div>
                            </div>
                            <div className="chatRoom3">
                                <p className="p2">{message.message}</p>
                            </div>
                            <p className="px"></p>
                        </div>
                    ))}
                </div>
                <textarea
                    className="txtarea"
                    onKeyDown={this.saveChatMsg}
                    placeholder="Let your friends know that you are online!">
                </textarea>
            </div>
        );
    }
}

const mapsStateToProps = state => { // state = global redux state
    return {
        messages: state.recentMsgs
    };
};

// check length, if greater than then, then slice();

export default connect(mapsStateToProps)(Chat);
