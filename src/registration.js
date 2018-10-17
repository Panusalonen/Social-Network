import React from "react";
import axios from "./axios";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this[e.target.name] = e.target.value;
    }
    submit() {
        axios
            .post("/registration", {
                first: this.first,
                last: this.last,
                email: this.email,
                password: this.password
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
    render(){
        return (
            <div className="register">
                {this.state.error && <div className="error">Insufficient Credentials</div>}
                <input
                    onChange={this.handleChange}
                    name="first"
                    className="input"
                    placeholder="First Name"
                />
                <input
                    onChange={this.handleChange}
                    name="last"
                    className="input"
                    placeholder="Last Name"
                />
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
                <button onClick={this.submit} className="button">
                    Register
                </button>
            </div>
        );
    }
}
