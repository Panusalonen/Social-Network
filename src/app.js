import React from 'react';
import axios from "./axios";
import Logo from './logo';
import ProfilePic from './profilepic';
import Uploader from './uploader';
import Profile from './profile';
import { BrowserRouter, Route } from 'react-router-dom';
import OtherProfile from './OtherProfile';
import MyFriends from './myfriends';
import OnlineUsers from './onlineUsers';
import Chat from './chat';
import Search from './reactiveSearch';
import Notification from './notification';
import { connect } from 'react-redux';

class App extends React.Component {
    constructor(props){
        super(props);
        // this.state = {
        //     id: null,
        //     first: "",
        //     last: "",
        //     email: "",
        //     bio: "",
        //     imageUrl: "",
        //     showBio: false
        // };
        this.state = {};

        ////// BIND THE METHODS //////

        this.updateImage = this.updateImage.bind(this);
        this.makeUploaderVisible = this.makeUploaderVisible.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.toggleBio = this.toggleBio.bind(this);
        this.setBio = this.setBio.bind(this);
    }
    componentDidMount(){
        axios.get('/user').then(
            ({data}) => {
                // console.log("DATA: ", data);

                if (!data.imageUrl){
                    data.imageUrl = "/troll.png";
                }
                // console.log("data in componentDidMount/app: ", data);
                this.setState(data);
            }
        );
    }
    makeUploaderVisible(){
        this.setState({
            uploaderIsVisible : true
        });
    }
    updateImage(imageUrl){
        this.setState({
            imageUrl: imageUrl,
            uploaderIsVisible : false
        });
    }
    closeModal() {
        this.setState({
            uploaderIsVisible : false
        });
    }
    toggleBio() {
        this.setState({
            showBio: !this.state.showBio
        });
    }
    setBio(e) {
        if (e.which === 13) {
            this.setState({
                bio: e.target.value,
                showBio: false
            });
            axios.post('/bio', {
                bio: e.target.value
            })
                .catch(error => {
                    console.log("error in bio! ", error);
                });
        }
    }
    notification() {}
    render(){
        if (!this.state.id){
            return (
                <div className="loading">
                    <h1>Loading...</h1>
                </div>);
        }

        return(
            <div className="appContainer">
                <div className="app">
                    <Logo />
                    <Search />
                    {this.props.notification &&
                        <Notification />}
                    <div className="string1a"></div>
                    <div className="string1a"></div>
                    <div className="string1a"></div>
                    <div className="string3a"></div>
                    <div className="string3a"></div>
                    <div className="string3a"></div>
                    <div className="profileDiv">
                        <ProfilePic
                            first={this.state.first}
                            last={this.state.last}
                            imageUrl={this.state.imageUrl}
                            clickHandler={this.makeUploaderVisible}
                        />
                        <a href="/">{this.state.first}&apos;s Profile</a>
                        <a href="/logout">Logout</a>
                    </div>
                    {this.state.uploaderIsVisible && (
                        <Uploader
                            updateImage={this.updateImage}
                            clickHandler={this.closeModal}
                        />)}
                </div>
                <BrowserRouter>
                    <div className="profile">
                        <Route
                            exact path="/"
                            render={() => (
                                <Profile
                                    id={this.state.id}
                                    first={this.state.first}
                                    last={this.state.last}
                                    email={this.state.email}
                                    bio={this.state.bio}
                                    imageUrl={this.state.imageUrl}
                                    showBio={this.state.showBio}
                                    toggleBio={this.toggleBio}
                                    setBio={this.setBio}
                                    clickHandler={this.makeUploaderVisible}
                                />
                            )}
                        />
                        <Route
                            exact path="/user/:userId"
                            component={OtherProfile}
                        />
                        <Route
                            exact path="/myfriends"
                            component={MyFriends}
                        />
                        <Route
                            exact path="/online"
                            component={OnlineUsers}
                        />
                        <Route
                            exact path="/chat"
                            component={Chat}
                        />
                        <Route
                            exact path="/notification"
                            component={Notification}
                        />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

const mapsStateToProps = state => { // state = global redux state
    return {
        notification: state.notification
    };
};

export default connect(mapsStateToProps)(App);
