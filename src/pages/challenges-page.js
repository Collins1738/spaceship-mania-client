import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default class ChallengesPage extends Component {
	constructor(props) {
		super(props);

		this.state = { challenges: [] };
	}

	render() {
		return (
			<div>
				<h3>Challenges</h3>
				<button
					onClick={() => {
						this.props.history.push("/challenge-creation");
					}}
				>
					Make A Challenge
				</button>
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
		const { challenges } = this.state;
		var challengesList = challenges.map((challenge) => {
			const { name, url, creator, date, highscore } = challenge;
			var highscoreString = highscore
				? `${highscore.displayName} - ${highscore.score}`
				: `No highscore`;
			return (
				<div key={url}>
					<h1>{name}</h1>
					<h2>Created by: {creator}</h2>
					<h4>{date}</h4>
					<h4>Highscore: {highscoreString}</h4>
					<Link to={url || ""}>Load</Link>
				</div>
			);
		});
		return challengesList;
	};
}
