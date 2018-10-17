import React, { Component } from 'react';
import axios from './axios';
import FriendButton from './friendButton';

export default class OtherProfile extends Component {

    constructor(props){
        super(props);
        this.state = {
            id: null,
            first: "",
            last: "",
            imageUrl: "",
            bio: ""
        };
    }
    componentDidMount() {
        axios.get(`/get-user/${this.props.match.params.userId}`)
            .then(response => {
                // console.log("OWN: ", response.data.ownProfile);
                let otherUser = response.data;
                if (response.data.ownProfile == true){
                    this.props.history.push('/');
                }
                if (!response.data.image_url){
                    response.data.image_url = "../troll.png";
                }
                // console.log("response from axios: ", response.data);
                this.setState({
                    id: otherUser.id,
                    first: otherUser.first,
                    last: otherUser.last,
                    imageUrl: otherUser.image_url,
                    bio: otherUser.bio
                });
            });
    }
    render(){
        // console.log("render: ", this.state);
        return (
            <div className="profile2">
                <div className="friendsBio">
                    <h1 id="h1">
                        {this.state.first} {this.state.last}
                    </h1>
                    <img
                        className="profilePic2"
                        src={this.state.imageUrl}
                    />
                    <div className="area2">{this.state.bio}</div>
                    <FriendButton
                        receiver_id={this.props.match.params.userId}
                    />
                </div>
            </div>
        );
    }
}
