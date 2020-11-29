import React, { Component } from "react";

export default class ModeSelectionPage extends Component {
	constructor(props) {
		super(props);

		this.state = {};
		this.enterChallengeMode = this.enterChallengeMode.bind(this);
		this.enterSinglePlayerMode = this.enterSinglePlayerMode.bind(this);
	}

	

	render() {
		return (
			<div>
			<h1>Select a mode</h1>
				<button onClick={this.enterSinglePlayerMode}>
					Single Player Mode
				</button>
				<button onClick={this.enterChallengeMode}>
					Challenge Mode
				</button>
				
				
				
				
			</div>
		);
	}

	enterSinglePlayerMode = () => {
		this.props.history.push("/single-player");
	};

	enterChallengeMode = () => {
		this.props.history.push("/challenges");
	};
}
