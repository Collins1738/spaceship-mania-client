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
