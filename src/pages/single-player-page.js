import React, { Component } from "react";

class SinglePlayerPage extends Component {
	constructor(props) {
		super(props);

		this.state = {};

		this.handleClick = this.handleClick.bind(this);
	}

	render() {
		return (
			<div>
				<h3>Single Player Page</h3>
				<button onClick={this.handleClick}>Play</button>
			</div>
		);
	}

	handleClick() {
		this.props.history.push("/gameplay/BmJqiqUgRIg2i7xKl5Gr");
		// this game id is hard coded, We actually want this functions to actually make a request and get a gameId and then redirect to /gameplay/theRecievedGameId
	}
}

export default SinglePlayerPage;
