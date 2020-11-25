import React, { Component } from "react";
import axios from "axios";

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
				Challenge
				<h1>{name}</h1>
				<h5>{creator}</h5>
				<h5>{date}</h5>
				<button onClick={this.handlePlay}>PLAY</button>
				<h4>Highscores</h4>
				{this.highscoresRender()}
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
