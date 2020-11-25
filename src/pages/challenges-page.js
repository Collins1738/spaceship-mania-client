import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
	root: {
		minWidth: 275,
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
export default class ChallengesPage extends Component {
	constructor(props) {
		super(props);

		this.state = { challenges: [] };
	}

	render() {
		return (
			<div>
				Challenges
				{this.challengesList()}
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

	challengesList = () => {
		/*<h1>{name}</h1>
					<h2>Created by: {creator}</h2>
					<h4>{date}</h4>
					<h4>Highscore: {highscoreString}</h4>
					<Link to={url || ""}>Load</Link>*/
		const Styleclasses = this.props.classes;
		const bull = <span className={Styleclasses.bullet}>•</span>;
		const { challenges } = this.state;
		var challengesList = challenges.map((challenge) => {
			const { name, url, creator, date, highscore } = challenge;
			var highscoreString = highscore
				? `${highscore.displayName} - ${highscore.score}`
				: `No highscore`;
			return (
				<div key={url}>
					<Card className={Styleclasses.root}>
						<CardContent>
							<Typography
								className={Styleclasses.title}
								color="textSecondary"
								gutterBottom
							>
								<h1>{name}</h1>
							</Typography>
							<Typography variant="h5" component="h2">
								<h2>Created by: {creator}</h2>
							</Typography>
							<Typography className={Styleclasses.pos} color="textSecondary">
								<h4>{date}</h4>
							</Typography>
							<Typography variant="body2" component="p">
								<h4>Highscore: {highscoreString}</h4>
								<br />
								{'"a benevolent smile"'}
							</Typography>
						</CardContent>
						<CardActions>
							<Button size="small">
								<Link to={url || ""}>Load</Link>
							</Button>
						</CardActions>
					</Card>
				</div>
			);
		});
		return challengesList;
	};
}
const ChallengesProps = () => {
	const classes = useStyles();
	return <challengesList classes={classes} />;
};
export default ChallengesProps;
