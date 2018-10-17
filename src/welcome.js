import React from 'react';
import Registration from './registration';
import {HashRouter, Route} from 'react-router-dom';
import {Link} from 'react-router-dom';
import Logo from './logo';
import Login from './login';

export default function Welcome(){
    return (
        <div className="greeting">
            <h1 className="a">Welcome to</h1>
            <div className="string1"></div>
            <div className="string1"></div>
            <div className="string2"></div>
            <div className="string2"></div>
            <div className="string3"></div>
            <div className="string3"></div>
            <div className="string4"></div>
            <div className="string4"></div>
            <Logo className="logo" />
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <h2 className="b">Already Registered? Login <Link to="/login">Here</Link></h2>
                    <div id="bubbles">
                        <div className="bubble x1" />
                        <div className="bubble x2" />
                        <div className="bubble x3" />
                        <div className="bubble x4" />
                        <div className="bubble x5" />
                        <div className="bubble x6" />
                        <div className="bubble x7" />
                        <div className="bubble x8" />
                        <div className="bubble x9" />
                        <div className="bubble x10" />
                        <div className="bubble x11" />
                        <div className="bubble x12" />
                    </div>
                </div>
            </HashRouter>
        </div>
    );
}
