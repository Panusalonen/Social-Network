import React from 'react';
import Notification from './notification';
// import {Link} from 'react-router-dom';

export default function Profile(props){
    console.log("props: ", props);
    return(
        // <div className="profile2">
        <div className="profile3">
            <div className="profile3a">
                <h1 className="h1">
                    { props.first } { props.last }
                </h1>
                <img
                    className="profilePic2"
                    src={props.imageUrl}
                    onClick={props.clickHandler}
                />
                { props.showBio
                    ? <textarea
                        className="area"
                        onKeyDown={ props.setBio }
                        defaultValue={ props.bio }>
                    </textarea>
                    : <button
                        className="edit"
                        onKeyDown={ props.setBio }
                        onClick={ props.toggleBio }
                        defaultValue={ props.bio }>View Bio</button>
                }
                <a className="yourFriends" href="/myfriends">{ props.first }&apos;s Friends</a>
                <a className="yourFriends" href="/online">Users Online</a>
                <a className="yourFriends" href="/chat">Chatroom</a>
            </div>
        </div>
    );
}
