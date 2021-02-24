import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import axios from "axios";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = (theme) => ({
	root: {
		flexGrow: 1,
	},
	input: {
		color: "white",
	},
	space: {
		padding: "20px",
	},
	loadButton: {
		backgroundColor: "#4CAF50",
		display: "flex",
	},
	card: {
		minWidth: 275,
		backgroundColor: theme.color.grey,
		color: theme.color.white,
		"&:hover": {
			backgroundColor: theme.color.primary,
			color: theme.color.white,
		},
		outlineColor: theme.color.primary,
	},
});

class UserPageInner extends Component {
	constructor(props) {
		super(props);

		this.state = {
			displayName: "",
			challengesMade: [],
			challengesPlayed: [],
			userId: this.props.userId,
			loading: true,
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	render() {
		const {
			displayName,
			numSinglePlayerGamesPlayed,
			highscoreSinglePlayer,
			loading,
		} = this.state;
		const { classes } = this.props;
		return (
			<div>
				{loading ? (
					<div>Loading...</div>
				) : (
					<div style={{}}>
						<div
							style={{
								padding: "20px",
								// alignItems: "flex-start",
								// display: "flex",
							}}
						>
							<TextField
								id="displayName"
								name="displayName"
								label="Display Name"
								value={displayName}
								onChange={this.handleChange}
								inputProps={{ className: classes.input }}
								variant="outlined"
							/>
							{/* <span style={{ padding: "20px" }}> */}
							<Button
								id="submit"
								onClick={this.handleSubmit}
								color="primary"
								variant="contained"
								style={{ width: "100px", height: "60px" }}
							>
								Change
							</Button>
							{/* </span> */}
						</div>
						<div className={classes.space}>
							<Typography>
								Single Player Highscore: {highscoreSinglePlayer}
							</Typography>
						</div>
						<div className={classes.space}>
							<Typography>
								Number of Single Player Games Played:{" "}
								{numSinglePlayerGamesPlayed}
							</Typography>
						</div>
						<div className={classes.space}>
							<Typography>Challenges Made: </Typography>
							{this.challengesMadeList()}
						</div>
						<div className={classes.space}>
							<Typography>Challenges Played: </Typography>
							{this.challengesPlayedList()}
						</div>
					</div>
				)}
			</div>
		);
	}

	async componentDidMount() {
		this.setState({ loading: true });
		await axios
			.post("/getUserInfo", { userId: this.props.userId })
			.then((response) => {
				const {
					displayName,
					highscoreSinglePlayer,
					numSinglePlayerGamesPlayed,
					challengesMade,
					challengesPlayed,
				} = response.data;
				this.setState({
					displayName,
					highscoreSinglePlayer,
					numSinglePlayerGamesPlayed,
					challengesMade,
					challengesPlayed,
				});
			})
			.catch((err) => {
				console.error(err.message);
			});
		this.setState({ loading: false });
	}

	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

	handleSubmit() {
		const { displayName } = this.state;
		axios
			.post("/changeName", { userId: this.props.userId, displayName })
			.then((response) => {
				alert(response.data.message);
			})
			.catch((err) => {
				console.log(err.message);
				alert("Something went wrong");
			});
	}

	challengesMadeList = () => {
		const { challengesMade } = this.state;
		const { classes } = this.props;
		return (
			<div style={{ padding: "20px" }}>
				<Grid container spacing={2} justify="center">
					{challengesMade.map((challenge) => {
						return (
							<Grid key={challenge.challengeId} item>
								<Card className={classes.card}>
									<CardContent>
										<Typography variant="h6">
											<b>{challenge.name}</b>
										</Typography>
										<Typography style={{ fontSize: 10 }}>
											{challenge.date}
										</Typography>
									</CardContent>
									<CardActions>
										<Button
											onClick={() => {
												this.props.history.push(
													`/challenge/${challenge.challengeId}`
												);
											}}
											className={classes.loadButton}
											color="inherit"
											style={{
												width: "100%",
											}}
										>
											Load
										</Button>
									</CardActions>
								</Card>
							</Grid>
						);
					})}
				</Grid>
			</div>
		);
	};

	challengesPlayedList = () => {
		const { challengesPlayed } = this.state;
		const { classes } = this.props;
		return (
			<div style={{ padding: "20px" }}>
				<Grid container spacing={2} justify="center">
					{challengesPlayed.map((challenge) => {
						return (
							<Grid item key={challenge.challengeId}>
								<Card className={classes.card}>
									<CardContent>
										<Typography variant="h6">
											<b>{challenge.name}</b>
										</Typography>
										<Typography style={{ fontSize: 10 }}>
											{challenge.date}
										</Typography>
									</CardContent>
									<CardActions>
										<Button
											onClick={() => {
												this.props.history.push(
													`/challenge/${challenge.challengeId}`
												);
											}}
											color="inherit"
											style={{
												width: "100%",
											}}
											className={classes.loadButton}
										>
											Load
										</Button>
									</CardActions>
								</Card>
							</Grid>
						);
					})}
				</Grid>
			</div>
		);
	};
}

function UserPage(props) {
	const { userId } = props;
	return <div>{userId && <UserPageInner {...props} />} </div>;
}
export default withStyles(styles)(UserPage);
