import {
	Card,
	CardActions,
	CardActionArea,
	CardContent,
	Typography,
} from "@material-ui/core";
import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import axios from "axios";

export default class UserPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			displayName: "",
			challengesMade: [],
			challengesPlayed: [],
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	render() {
		const {
			displayName,
			numSinglePlayerGamesPlayed,
			highscoreSinglePlayer,
		} = this.state;
		return (
			<div>
				<div style={{ padding: "20px" }}>
					<TextField
						id="displayName"
						name="displayName"
						label="Display Name"
						value={displayName}
						onChange={this.handleChange}
					/>
					<button id="submit" onClick={this.handleSubmit}>
						Change
					</button>
				</div>
				<div>
					<Typography>
						Single Player Highscore: {highscoreSinglePlayer}
					</Typography>
					<Typography>
						Number of Single Player Games Played: {numSinglePlayerGamesPlayed}
					</Typography>
					<Typography>Challenges Made: </Typography>
					{this.challengesMadeList()}
					<Typography>Challenges Played: </Typography>
					{this.challengesPlayedList()}
				</div>
			</div>
		);
	}

	componentDidMount() {
		axios
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
			});
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
		return challengesMade.map((challenge) => {
			return (
				<div
					key={challenge.challengeId}
					style={{ marginLeft: "600px", marginRight: "600px" }}
				>
					<Card>
						<CardContent>
							<Typography>{challenge.name}</Typography>
							<Typography>{challenge.date}</Typography>
						</CardContent>
						<CardActions>
							<button
								onClick={() => {
									this.props.history.push(
										`/challenge/${challenge.challengeId}`
									);
								}}
							>
								Load
							</button>
						</CardActions>
					</Card>
				</div>
			);
		});
	};

	challengesPlayedList = () => {
		const { challengesPlayed } = this.state;
		return challengesPlayed.map((challenge) => {
			return (
				<div
					key={challenge.challengeId}
					style={{ marginLeft: "600px", marginRight: "600px" }}
				>
					<Card>
						<CardContent>
							<Typography>{challenge.name}</Typography>
							<Typography>{challenge.date}</Typography>
						</CardContent>
						<CardActions>
							<button
								onClick={() => {
									this.props.history.push(
										`/challenge/${challenge.challengeId}`
									);
								}}
							>
								Load
							</button>
						</CardActions>
					</Card>
				</div>
			);
		});
	};
}
