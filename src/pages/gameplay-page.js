import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

import axios from "axios";

const styles = (theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: "center",
		color: "black",
	},
	won: {
		color: "green",
	},
	lost: {
		color: "red",
	},
	submit: {
		background: "green",
		color: "white",
	},
	reset: {
		background: "cyan",
		color: "black",
		"&:hover": {
			backgroundColor: "cyan",
		},
	},
	endGame: {
		backgroundColor: "red",
		color: "white",
		"&:hover": {
			backgroundColor: "pink",
		},
	},
	unselectedButton: {
		border: 5,
		borderRadius: 4,
		background: theme.color.grey,
		"&:hover": {
			backgroundColor: theme.color.lightOrange,
		},
		"&:disabled": {
			background: theme.color.grey,
		},
	},
	selectedButton: {
		background: theme.color.primary,
		"&:hover": {
			backgroundColor: theme.color.primary,
		},
		"&:disabled": {
			backgroundColor: theme.color.primary,
		},
	},
	correctButton: {
		background: "green",
		"&:hover": {
			backgroundColor: "green",
		},
		"&:disabled": {
			backgroundColor: "green",
		},
	},
});

class GamplayPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			size: 4, // 2 - 7
			numShips: 3,
			positions: [],
			triesLeft: 10,
			gameId: this.props.match.params.gameId,
			userId: this.props.userId,
			score: 0,
			gameOver: false,
			gameWon: false,
			correctPositions: [],
			loading: false,
			pageLoading: true,
			comment: "",
			windowWidth: window.innerWidth,
		};

		this.handleReset = this.handleReset.bind(this);
	}

	render() {
		const { classes } = this.props;
		const {
			triesLeft,
			score,
			comment,
			gameWon,
			gameOver,
			numShips,
			positions,
			loading,
			pageLoading,
		} = this.state;
		return (
			<div>
				{pageLoading ? (
					<div>Loading... </div>
				) : (
					<div className={classes.root}>
						{gameWon && (
							<div>
								<Typography
									variant="h2"
									className={classes.won}
									color="primary"
								>
									You Won!!
								</Typography>
								<Typography variant="h5">
									Score: {score}
								</Typography>
							</div>
						)}
						{gameOver && !gameWon && (
							<div>
								<Typography
									variant="h2"
									className={classes.lost}
								>
									You Lost
								</Typography>
								<Typography variant="h5">
									Score: {score}
								</Typography>
							</div>
						)}
						<Typography>
							{!loading ? comment : "Loading..."}
						</Typography>
						<div style={{ margin: "20px" }}>{this.board()}</div>
						{!gameOver && (
							<div>
								<Typography>
									Pick {numShips} ship locations
								</Typography>
								<div style={{ margin: "20px" }}>
									<Button
										variant="contained"
										id="Submit"
										onClick={this.handleSubmit}
										disabled={positions.length !== numShips}
										className={classes.submit}
									>
										Submit
									</Button>
									<Button
										variant="contained"
										id="Reset"
										onClick={this.handleReset}
										className={classes.reset}
									>
										Reset
									</Button>
								</div>

								<Typography>Tries left: {triesLeft}</Typography>
								<Typography>Score: {score}</Typography>
								<Button
									onClick={this.handleEnd}
									className={classes.endGame}
								>
									End Game
								</Button>
							</div>
						)}
					</div>
				)}
			</div>
		);
	}

	board = () => {
		var rows = [];
		const { size } = this.state;
		var i = 0;
		while (i < size) {
			rows.push(this.row(i));
			i += 1;
		}
		return (
			<Grid spacing={1} container>
				{rows}
			</Grid>
		);
	};

	row = (rowNumber) => {
		const {
			size,
			positions,
			correctPositions,
			windowWidth,
			numShips,
			gameOver,
		} = this.state;
		const { classes } = this.props;
		var row = [];
		var i = 0;
		var width = Math.round((0.6 * windowWidth) / size);
		if (width > 90) {
			width = 90;
		}
		while (i < size) {
			var id = String(rowNumber) + String(i);
			row.push(
				<Grid item key={id}>
					<Button
						id={id}
						className={
							correctPositions.includes(id)
								? classes.correctButton
								: positions.includes(id)
								? classes.selectedButton
								: classes.unselectedButton
						}
						onClick={this.handleClick}
						size="small"
						style={{ height: width, width: width, minWidth: 1 }}
						disabled={
							gameOver ||
							(!positions.includes(id) &&
								!correctPositions.includes(id) &&
								positions.length === numShips)
						}
					></Button>
				</Grid>
			);
			i += 1;
		}
		return (
			<Grid
				key={rowNumber}
				className={classes.row}
				container
				direction="row"
				justify="center"
				item
				xs={12}
				alignContent="center"
				spacing={1}
			>
				{row}
			</Grid>
		);
	};

	componentDidMount() {
		const { gameId } = this.state;
		window.addEventListener("resize", () => {
			this.setState({ windowWidth: window.innerWidth });
		});
		axios
			.post("/getGameInfo", { gameId })
			.then((response) => {
				if (response.status === 200) {
					const { numShips, size, triesLeft, userId } = response.data;
					if (userId !== this.state.userId && false) {
						alert("Game can only be played by correct user");
						this.props.history.push("/mode-selection");
					} else {
						this.setState({
							numShips,
							size,
							triesLeft,
							pageLoading: false,
						});
					}
				} else {
					alert("Game does not exist");
				}
			})
			.catch((error) => {
				alert("Something went wrong");
				console.log(error.message);
			});
	}

	componentWillUnmount() {
		const { gameOver, gameId } = this.state;
		if (!gameOver) {
			axios.post("/endGame", { gameId });
		}
	}

	handleClick = (event) => {
		const { id } = event.currentTarget;
		const { positions, numShips } = this.state;
		var newPositions = positions;
		if (positions.includes(id)) {
			newPositions.splice(positions.indexOf(id), 1);
			this.setState({ positions: newPositions });
		} else {
			if (positions.length === numShips) {
				return;
			}
			newPositions.push(id);
			this.setState({ positions: newPositions });
		}
	};

	handleEnd = () => {
		const { gameId } = this.state;
		axios.post("/endGame", { gameId }).then((response) => {
			const { gameOver, gameWon, positions, score } = response.data;
			var correctPositions = [];
			if (positions) {
				correctPositions = positions.map((position) => {
					return `${position.x}${position.y}`;
				});
			}
			this.setState({
				score,
				gameOver,
				gameWon,
				correctPositions,
				loading: false,
			});
		});
	};

	handleSubmit = async () => {
		const { positions, gameId, userId } = this.state;
		this.setState({ loading: true });
		var answers = positions.map((id) => {
			return { x: parseInt(id[0], 10), y: parseInt(id[1], 10) };
		});
		await axios
			.post("/getNumberCorrectPositions", {
				answers,
				gameId,
				userId,
			})
			.then((response) => {
				if (response.status === 200) {
					const {
						triesLeft,
						numCorrect,
						numShips,
						gameOver,
						gameWon,
						positions,
						score,
					} = response.data;
					var correctPositions = [];
					if (positions) {
						correctPositions = positions.map((position) => {
							return `${position.x}${position.y}`;
						});
					}
					this.setState({
						triesLeft,
						score,
						comment: `You got ${numCorrect} / ${numShips} correct`,
						gameOver,
						gameWon,
						correctPositions,
						loading: false,
					});
				} else {
					alert("something went wrong");
					console.log(response);
				}
			})
			.catch((err) => {
				console.log(err);
				alert("something went wrong");
			});
	};

	handleReset() {
		this.setState({ positions: [] });
	}
}

export default withStyles(styles)(GamplayPage);
