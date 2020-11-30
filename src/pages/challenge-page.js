import React, { Component } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/styles/withStyles";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

const styles = (theme) => ({
	a: {
		color: theme.color.primary,
	},
	play: {
		color: "white",
		backgroundColor: "green",
		"&:hover": {
			backgroundColor: "#006600",
			color: "white",
		},
	},
});

class ChallengePage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			challengeId: this.props.match.params.challengeId,
			name: "",
			creator: "",
			date: "",
			highscores: [],
			size: 0,
			tries: 0,
			userId: this.props.userId,
		};

		this.handlePlay = this.handlePlay.bind(this);
	}

	render() {
		const { name, date, creator } = this.state;
		const { classes } = this.props;
		return (
			<div>
				<div style={{ margin: "20px" }}>Challenge</div>

				<div className={classes.a}>
					<Typography variant="h3">{name}</Typography>
					<Typography variant="h5">By: {creator}</Typography>
					<Typography variant="body2">{date}</Typography>
					<Button
						style={{
							width: "200px",
							height: "100px",
							margin: "30px",
						}}
						className={classes.play}
						onClick={this.handlePlay}
						startIcon={<PlayArrowIcon />}
					>
						<b>PLAY</b>
					</Button>
					<Typography>Highscores</Typography>
					{this.highscoresRender()}
				</div>
			</div>
		);
	}

	componentDidMount() {
		const { challengeId, userId } = this.state;
		if (!userId) {
			alert("Login to Load a challenge");
			this.props.history.push("/login");
		}
		axios.post("/getChallenge", { challengeId }).then((response) => {
			const {
				highscores,
				creator,
				date,
				name,
				size,
				tries,
			} = response.data;
			this.setState({
				highscores,
				creator,
				date,
				name,
				size,
				tries,
			});
		});
	}

	highscoresRender = () => {
		const { highscores } = this.state;
		const highscoresRender = highscores.map((highscore) => {
			const { displayName, score, date } = highscore;
			return (
				<Grid key={displayName + score + date} item container>
					<Grid item xs={5}>
						{displayName}
					</Grid>
					<Grid item xs={3}>
						{score}
					</Grid>
					<Grid item xs={4}>
						{date}
					</Grid>
				</Grid>
			);
		});
		return highscoresRender[0] ? (
			<Grid container spacing={1}>
				{highscoresRender}
			</Grid>
		) : (
			<div>No highscores</div>
		);
	};

	handlePlay() {
		const { challengeId, userId } = this.state;
		axios
			.post("/makeChallengeGame", { challengeId, userId })
			.then((response) => {
				const { gameId } = response.data;
				this.props.history.push(`/gameplay/${gameId}`);
			})
			.catch((err) => {
				alert("something went wrong");
				console.log(err.message);
			});
	}
}

export default withStyles(styles)(ChallengePage);
