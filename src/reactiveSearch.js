import React, { Component } from 'react';
import axios from './axios';
import Suggestions from './suggestions';

class Search extends Component {

    constructor(props){
        super(props);
        this.state = {
            results: []
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    handleInputChange() {
        console.log("SEARCH: ", this.search.value);
        const searchObj = {
            searchValue: this.search.value
        };
        axios.post(`/searchUsers`, searchObj).then(({ data }) => {
            this.setState({
                results: data.data
            });
        });
    }
    render() {
        return (
            <div className="userSearch">
                <h1> USER <strong>SEARCH</strong>&nbsp;</h1>
                <input
                    type="text"
                    name="user-input"
                    className="search"
                    placeholder="Search User"
                    ref={input => this.search = input}
                    onChange={this.handleInputChange}
                />
                <Suggestions
                    results={this.state.results}
                />
            </div>
        );
    }
}

export default Search;
