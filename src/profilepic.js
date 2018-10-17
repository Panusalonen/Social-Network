import React from 'react';

export default function ProfilePic(props){
    return(
        <img className="profilePic"
            src={props.imageUrl}
            onClick={props.clickHandler}
        />
    );
}
