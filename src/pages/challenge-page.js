import React, { Component } from "react";
import axios from "axios";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

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

				<div style={{ marginLeft: "550px", marginRight: "550px" }}>
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
								<b>PLAY</b>
							</Button>
						</CardActions>
						<CardContent>
							<h4>Highscores</h4>
							{/*this.highscoresRender()*/}
							<TableContainer component={Paper}>
								<Table size="small" aria-label="a dense table">
									<TableHead>
										<TableRow component="th" align="left">
											<TableCell align="inherit">Name</TableCell>
											<TableCell align="inherit">Score</TableCell>
											<TableCell align="inherit">Date</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>{this.highscoresRender()}</TableBody>
								</Table>
							</TableContainer>
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
		//{displayName} {score} {date}
		const highscoresRender = highscores.map((highscore) => {
			const { displayName, score, date } = highscore;
			return (
				<div key={displayName + score + date}>
					<TableRow component="th">
						<TableCell component="th" scope="row" align="inherit">
							{displayName}
						</TableCell>
						<TableCell align="inherit">{score}</TableCell>
						<TableCell align="inherit">{date}</TableCell>
					</TableRow>
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
