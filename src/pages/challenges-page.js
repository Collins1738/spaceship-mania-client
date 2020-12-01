import React, { Component } from "react";
import axios from "axios";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/styles/withStyles";
import AddIcon from "@material-ui/icons/Add";

const styles = (theme) => ({
	root: {
		minWidth: 275,
		backgroundColor: theme.color.grey,
		color: theme.color.white,
		"&:hover": {
			backgroundColor: theme.color.primary,
			color: theme.color.white,
		},
		outlineColor: theme.color.primary,
	},
	size: {
		width: 50,
		alignContent: "center",
	},
	button: {
		backgroundColor: "#4CAF50",
		display: "flex",
	},
	button2: {
		"&:hover": {
			backgroundColor: theme.color.primary,
			color: theme.color.white,
		},
		color: theme.color.lightOrange,
	},
	date: {
		fontSize: 10,
	},
	title: {
		fontSize: 14,
	},
	pos: {
		marginBottom: 12,
	},
});

class ChallengesPage extends Component {
	constructor(props) {
		super(props);
		this.state = { challenges: [] };
	}

	render() {
		const { classes } = this.props;
		return (
			<div>
				<div style={{ margin: "20px" }}>
					<h3>Challenges</h3>
					<Button
						className={classes.button2}
						onClick={() => {
							this.props.history.push("/challenge-creation");
						}}
						color="inherit"
						startIcon={<AddIcon />}
					>
						Make A Challenge
					</Button>
				</div>
				<Grid container justify="center" spacing={2}>
					{this.challengesList()}
				</Grid>
			</div>
		);
	}

	componentDidMount() {
		axios
			.get("/getAllChallenges")
			.then((response) => {
				if (response.status === 200) {
					var challenges = response.data.map((challenge) => {
						const {
							challengeId,
							creator,
							name,
							date,
							highscore,
						} = challenge;
						challenge = {
							url: `/challenge/${challengeId}`,
							creator,
							name,
							date,
							highscore,
						};
						return challenge;
					});
					this.setState({ challenges });
				}
			})
			.catch((err) => {
				alert("Something went wrong");
				console.log(err);
			});
	}

	challengesList = () => {
		const classes = this.props.classes;
		const { challenges } = this.state;
		var challengesList = challenges.map((challenge) => {
			const { name, url, creator, date, highscore } = challenge;
			var highscoreString = highscore
				? `${highscore.displayName} - ${highscore.score}`
				: `No highscore`;
			return (
				<Grid item key={url}>
					<div styles={{ margin: "20px" }}>
						<Card className={classes.root} raised={true}>
							<CardContent>
								<Typography
									className={classes.title}
									gutterBottom
								>
									Created by: {creator}
								</Typography>
								<Typography variant="h6">
									<b>{name}</b>
								</Typography>
								<Typography className={classes.date}>
									Created: {date}
								</Typography>
								<Typography variant="body2" component="p">
									Highscore: {highscoreString}
								</Typography>
							</CardContent>
							<CardActions>
								<div style={{ width: "100%" }}>
									<Button
										size="small"
										onClick={() => {
											this.props.history.push(url);
										}}
										color="inherit"
										style={{ width: "100%" }}
										className={classes.button}
									>
										Load
									</Button>
								</div>
							</CardActions>
						</Card>
					</div>
				</Grid>
			);
		});
		return challengesList;
	};
}

export default withStyles(styles)(ChallengesPage);
