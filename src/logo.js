import React from 'react';

export default function Logo(){
    let logoStyle = {
        color: 'snow',
        fontSize: '120px',
        fontFamily: 'Helvetica Neue',
        border: "2px solid darkorange",
        padding: "10px",
        margin: "10px",
        background: "darkorange",
        fontWeight: "lighter",
        zIndex: 2,
        position: "relative",
        boxShadow: "0 0 8px snow"
    };

    if (location.pathname == "/welcome") {
        return <h1 style={logoStyle}>UNITY</h1>;
    } else {
        return <h1 className="logo">UNITY</h1>;
    }
}
