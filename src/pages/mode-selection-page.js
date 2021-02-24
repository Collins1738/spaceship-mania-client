import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = (theme) => ({
	root: {
		flexGrow: 1,
	},
	button: {
		"&:hover": {
			backgroundColor: theme.color.primary,
			color: theme.color.white,
		},
		color: theme.color.lightOrange,
	},
});

class ModeSelectionPage extends Component {
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
				{this.buttons()}
			</div>
		);
	}

	buttons = () => {
		const { classes } = this.props;
		return (
			<div style={{ padding: "50px" }}>
				<span style={{ padding: "20px" }}>
					<Button
						className={classes.button}
						onClick={this.enterSinglePlayerMode}
					>
						Single Player Mode
					</Button>
				</span>
				<span style={{ padding: "20px" }}>
					<Button
						className={classes.button}
						onClick={this.enterChallengeMode}
						color="inherit"
					>
						Challenge Mode
					</Button>
				</span>
			</div>
		);
	};
	enterSinglePlayerMode = () => {
		this.props.history.push("/single-player");
	};

	enterChallengeMode = () => {
		this.props.history.push("/challenges");
	};
}

export default withStyles(styles)(ModeSelectionPage);
