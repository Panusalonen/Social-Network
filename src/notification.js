import React, { Component } from 'react';
import { connect } from 'react-redux';
import {notifyUser} from './actions';

class Notification extends Component {
    constructor(){
        super();
        this.state = {};
        this.timeOut = this.timeOut.bind(this);
    }
    timeOut() {
        setTimeout(() => {
            this.props.dispatch(notifyUser(null));
        }, 1500);
    }
    render() {
        // const {notification} = this.props;
        this.timeOut();
        console.log("STATE in NOTIFICATION: ", this.props.notification);
        return (
            <div className="upload2">
                <h1>
                    {this.props.notification.first}{" "}{this.props.notification.message}
                </h1>
            </div>
        );
    }
}

const mapsStateToProps = state => { // state = global redux state
    return {
        notification: state.notification
    };
};

export default connect(mapsStateToProps)(Notification);
