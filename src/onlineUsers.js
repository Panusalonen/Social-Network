import React, { Component } from 'react';
import { connect } from 'react-redux';
import { onlineUsers } from './actions';
import {Link} from 'react-router-dom';

class OnlineUsers extends Component {
    constructor(){
        super();
    }
    componentDidMount(){
        // console.log("Component Mounting?");
        this.props.dispatch(onlineUsers());
    }
    render(){
        if (!this.props.onlineUsers){
            return null;
        }
        return (
            <div className="profile4">
                {this.props.onlineUsers.map(
                    onlineUser => (
                        <div
                            key={onlineUser.id}
                            className="friends">
                            <h1>Users <strong>Online</strong></h1>
                            <p>{onlineUser.first} {onlineUser.last}</p>
                            <Link
                                id="a"
                                to={`/user/${onlineUser.id}`}>
                                <img
                                    className="profilePic2"
                                    src={onlineUser.image_url||"../troll.png"}>
                                </img>
                            </Link>
                        </div>
                    )
                )}
            </div>
        );
    }
}

const mapsStateToProps = state => { // state = global redux state
    return {
        onlineUsers: state.users
    };
};

export default connect(mapsStateToProps)(OnlineUsers);


// <Chat />
