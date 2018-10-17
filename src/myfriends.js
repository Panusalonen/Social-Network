import React, { Component } from 'react';
import { connect } from 'react-redux';
import { receiveUsers, acceptFriendRequest, unfriend } from './actions';
import {Link} from 'react-router-dom';

class MyFriends extends Component {
    constructor(){
        super();
    }
    componentDidMount(){
        this.props.dispatch(receiveUsers());
    }
    render(){
        if (!this.props.friends){
            return null;
        }
        return(
            <div className="profile4">
                {this.props.friends.map(
                    friends => (
                        <div key={friends.id} className="friends">
                            <h1>Friends</h1>
                            <p>{friends.first} {friends.last}</p>
                            <Link
                                id="a"
                                to={`/user/${friends.id}`}>
                                <img
                                    className="profilePic2"
                                    src={friends.image_url||"../troll.png"}>
                                </img>
                            </Link>
                            <div className="area2">{friends.bio}</div>
                            <button
                                className="fButton"
                                onClick={() => {this.props.dispatch(unfriend(friends.id));
                                }}>Unfriend
                            </button>
                        </div>
                    )
                )}
                {this.props.wannabes.map(
                    friends => (
                        <div key={friends.id} className="friends2">
                            <h1>Wanna B Friends</h1>
                            <p>{friends.first} {friends.last}</p>
                            <Link
                                id="b"
                                to={`/user/${friends.id}`}>
                                <img
                                    className="profilePic2"
                                    src={friends.image_url||"../troll.png"}>
                                </img>
                            </Link>
                            <button
                                className="fButton"
                                onClick={() =>
                                {this.props.dispatch(acceptFriendRequest(friends.id));
                                }}>{friends.first}&apos;s Request. Accept?
                            </button>
                            <button
                                className="fButton2"
                                onClick={() => {this.props.dispatch(unfriend(friends.id));
                                }}>Cancel?
                            </button>
                        </div>
                    )
                )}
            </div>
        );
    }
}

const mapsStateToProps = state => { // state = global redux state
    return {
        friends: state.users && state.users.filter(user =>
            user.status == 2),
        wannabes: state.users && state.users.filter(user =>
            user.status == 1)
    };
};

export default connect(mapsStateToProps)(MyFriends);
