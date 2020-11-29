import React, { Component } from "react";
import axios from "axios";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
	root: {
		minWidth: 275,
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "center",
		alignContent: "center",
	},
	size: {
		width: 50,
		alignContent: "center",
	},
	button: {
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "center",
		alignContent: "center",

		backgroundColor: "#4CAF50",
	},
	title: {
		fontSize: 14,
	},
	pos: {
		marginBottom: 12,
	},
});

class ChallengesPageInner extends Component {
	constructor(props) {
		super(props);

		this.state = { challenges: [] };
	}

	render() {
		return (
			<div>
				<div style={{ margin: "20px" }}>
					<h3>Challenges</h3>

					<button
						onClick={() => {
							this.props.history.push("/challenge-creation");
						}}
					>
						Make A Challenge
					</button>
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
				<Grid item>
					<div styles={{ margin: "20px" }}>
						<Card className={classes.root}>
							<CardContent>
								<Typography
									className={classes.title}
									color="textSecondary"
									gutterBottom
								>
									Created by: {creator}
								</Typography>
								<Typography variant="h5" component="h2">
									{name}
								</Typography>
								<Typography
									className={classes.pos}
									color="textSecondary"
								>
									<h4>{date}</h4>
								</Typography>
								<Typography variant="body2" component="p">
									<h4>Highscore: {highscoreString}</h4>
								</Typography>
							</CardContent>
							<CardActions>
								<div className={classes.button}>
<<<<<<< HEAD
									<Button size="small" href={url || ""} color="inherit">
										<b>Play</b>
=======
									<Button
										size="small"
										href={url || ""}
										color="inherit"
									>
										Play
>>>>>>> 4bec047156046f1b6f34595750a9e6bdaddfba7b
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

const ChallengesPage = (props) => {
	const classes = useStyles();
	return <ChallengesPageInner classes={classes} {...props} />;
};
export default ChallengesPage;
