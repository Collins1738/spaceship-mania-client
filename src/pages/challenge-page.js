import React, { Component } from "react";
import axios from "axios";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

export default class ChallengePage extends Component {
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
		return (
			<div>
				<div style={{ margin: "20px" }}>Challenge</div>

				<div style={{ marginLeft: "600px", marginRight: "600px" }}>
					<Card
						style={{
							minWidth: 275,
							justifyContent: "center",
							alignItems: "center",
							alignSelf: "center",
							alignContent: "center",
						}}
					>
						<CardContent>
							<h1>{name}</h1>
							<h5>{creator}</h5>
							<h5>{date}</h5>
						</CardContent>
						<CardActions>
							<Button
								style={{
									justifyContent: "center",
									alignItems: "center",
									alignSelf: "center",
									alignContent: "center",
									backgroundColor: "#4CAF50",
								}}
								onClick={this.handlePlay}
							>
								PLAY
							</Button>
						</CardActions>
						<CardContent>
							<h4>Highscores</h4>
							{this.highscoresRender()}
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	componentDidMount() {
		const { challengeId } = this.state;
		axios.post("/getChallenge", { challengeId }).then((response) => {
			const { highscores, creator, date, name, size, tries } = response.data;
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
				<div key={displayName + score + date}>
					{displayName} {score} {date}
				</div>
			);
		});
		return highscoresRender[0] ? highscoresRender : <div>No highscores</div>;
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
