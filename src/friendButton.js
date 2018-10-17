import React, { Component } from 'react';
import axios from './axios';
import {getSocket} from './socket';

export default class FriendButton extends Component {

    constructor(props){
        super(props);
        this.state= {
            buttonText:"",
            buttonStatus: "",
            status: null,
            sender_id: "",
            receiver_id: ""
        };
        this.newRequest = this.newRequest.bind(this);
    }
    componentDidMount(){
        axios.get(`/friends`, {
            params: {
                receiver_id: this.props.receiver_id
            }
        }).then(response => {
            console.log("response: ", response);

            if (response.data == "") {
                this.setState({
                    buttonText: 'Make Friend Request',
                    buttonStatus: 0
                });
            } else if (response.data.status == 1){
                if (response.data.sender_id == this.props.receiver_id){
                    this.setState({
                        buttonText: 'Accept Friend Request',
                        buttonStatus: "1a"
                    });
                } else {
                    this.setState({
                        buttonText: 'Pending. Cancel Request?',
                        buttonStatus: "1b"
                    });
                }
            } else if (response.data.status == 2) {
                this.setState({
                    buttonText: 'Friends. Unfriend?',
                    buttonStatus: "2"
                });
            }
        });
    }
    newRequest() {
        let receiver_id = this.props.receiver_id;
        // console.log("Our id in function:", receiver_id);

        if (this.state.buttonStatus == 0){

            let status = 1;

            axios.post(`/sendFriendRequest`, {
                status: status,
                receiver_id: receiver_id

            }).then(response => {
                console.log("Request :", response);
                this.setState({
                    buttonText: "Request Pending, Cancel?",
                    buttonStatus: "1b" // --> 1b request pending
                });
                console.log("UPDATED FS: ", this.props.receiver_id);
                getSocket().emit("makeFriends", this.props.receiver_id);
            });
        } else if (this.state.buttonStatus == "1a"){

            let status2 = 2;

            axios.post(`/sendFriendRequest`, {
                status: status2,
                receiver_id: receiver_id

            }).then(response => {
                console.log("Request :", response);
                this.setState({
                    buttonText: "Friends. Unfriend?",
                    buttonStatus: 2
                });
            });
        } else if (this.state.buttonStatus == "1b") { // --> cancel pending request
            axios
                .post("/deleteRequest", {
                    receiver_id: receiver_id
                })
                .then(results => {
                    console.log("After Deleting", results);
                    this.setState({
                        buttonText: "Make Friend Request",
                        buttonStatus: 0
                    });
                });
        } else if (this.state.buttonStatus == 2) {
            // cancel friend request
            axios
                .post("/deleteRequest", {
                    receiver_id: receiver_id
                })
                .then(results => {
                    console.log("After Deleting", results);
                    this.setState({
                        buttonText: "Make Friend Request",
                        buttonStatus: 0
                    });
                });
        }
    }
    render() {
        // console.log("render: ", this.state);
        return (
            <div className="buttonDiv">
                <button
                    className="fButton"
                    onClick={this.newRequest}
                >{this.state.buttonText}</button>
            </div>
        );
    }
}
