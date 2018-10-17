import React from "react";
import axios from "./axios";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        // this.onKeyDown = this.onKeyDown.bind(this);
    }
    handleChange(e) {
        this[e.target.name] = e.target.value;
    }
    submit() {
        console.log("These: ", this.email);
        axios
            .post('/login', {
                email:this.email,
                password:this.password
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace('/');
                } else {
                    this.setState({
                        error: true
                    });
                }
            });
    }
    render() {
        return (
            <div className="register">
                {this.state.error && <div className="error">Wrong Credentials</div>}
                <input
                    onChange={this.handleChange}
                    name="email"
                    className="input"
                    placeholder="Email"
                />
                <input
                    onChange={this.handleChange}
                    type="password"
                    name="password"
                    className="input"
                    placeholder="Password"
                />
                <button
                    onClick={this.submit}
                    onKeyDown={this.submit}
                    className="button">
                    Login
                </button>
            </div>
        );
    }
}
