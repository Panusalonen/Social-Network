import React from 'react';
import axios from './axios';

export default function Uploader(props){

    function submit(e){
        let file;
        e.preventDefault();
        file = e.target.files[0];
        const fd = new FormData;
        fd.append("file", file);
        axios.post('/upload', fd).then(
            ({data}) => {
                props.updateImage(data.imageUrl);
            }
        );
    }
    return (
        <div className="upload">
            <input
                id="myInput"
                className="uploadInput"
                type="file"
                accept="image/*"
                onChange={submit}
            />
            <p>Update Your Profile Picture</p>
            <label className="uploadButton" htmlFor="myInput">Go</label>
            <button className="button2" onClick={props.clickHandler}>X</button>
        </div>
    );
}
