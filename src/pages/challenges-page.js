import React, { Component } from "react";
import { Link } from "react-router-dom";
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

		color: "green",
	},
	bullet: {
		display: "inline-block",
		margin: "0 2px",
		transform: "scale(0.8)",
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
		return (
			<div>
				<div style={{ margin: "20px" }}>Challenges</div>
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
						const { challengeId, creator, name, date, highscore } = challenge;
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
	bull = () => {
		const classes = this.props.classes;
		return <span className={classes.bullet}>•</span>;
	};
	challengesList = () => {
		/*<h1>{name}</h1>
					<h2>Created by: {creator}</h2>
					<h4>{date}</h4>
					<h4>Highscore: {highscoreString}</h4>
					<Link to={url || ""}>Load</Link>*/
		//const classes = useStyles();
		//const bull = <span className={classes.bullet}>•</span>;
		/*
		const Styleclasses = this.props.classes;
		const bull = <span className={Styleclasses.bullet}>•</span>;*/
		const classes = this.props.classes;
		const { challenges } = this.state;
		//const makeStyles = this.props.classes;
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
									<h2>Created by: {creator}</h2>
								</Typography>
								<Typography variant="h5" component="h2">
									{name}
								</Typography>
								<Typography className={classes.pos} color="textSecondary">
									<h4>{date}</h4>
								</Typography>
								<Typography variant="body2" component="p">
									<h4>Highscore: {highscoreString}</h4>
								</Typography>
							</CardContent>
							<CardActions>
								<div className={classes.button}>
									<Button
										variant="containted"
										size="small"
										href={url || ""}
										color="inherit"
									>
										Play
									</Button>
								</div>
							</CardActions>
						</Card>
					</div>
				</Grid>
			);
		});
		return challengesList;
		//const bull = <span className={classes.bullet}>•</span>;
		//return <challengesList classes={classes} />;
	};
}

const ChallengesProps = () => {
	const classes = useStyles();
	return <ChallengesPage classes={classes} />;
};
export default ChallengesProps;
