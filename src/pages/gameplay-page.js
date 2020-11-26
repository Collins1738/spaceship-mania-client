import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

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
	unselectedButton: {
		boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
		background: "black",
		height: 80,
		width: 80,
	},
	selectedButton: {
		boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
		background: "white",
		height: 80,
		width: 80,
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
			loading: true,
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
			numShips,
			positions,
			loading,
		} = this.state;
		return (
			<div>
				{loading ? (
					<div>Loading... </div>
				) : (
					<div className={classes.root}>
						Gameplay
						<div style={{ margin: "20px" }}>{this.board()}</div>
						<Typography>Pick {numShips} ship locations</Typography>
						<div style={{ margin: "20px" }}>
							<Button
								variant="contained"
								color="secondary"
								id="Submit"
								onClick={this.handleSubmit}
								disabled={positions.length !== numShips}
							>
								Submit
							</Button>
							<Button
								variant="contained"
								color="primary"
								id="Reset"
								onClick={this.handleReset}
							>
								Reset
							</Button>
						</div>
						<Typography>Tries left: {triesLeft}</Typography>
						<Typography>Score: {score}</Typography>
						<Typography>{comment}</Typography>
						{gameWon ? (
							<Typography>You won! </Typography>
						) : (
							<div></div>
						)}
						<Typography>
							For testing purposes, the answers are (0, 0), (1,
							0), (0, 3)
						</Typography>
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
		return <Grid container>{rows}</Grid>;
	};

	row = (rowNumber) => {
		const { size, positions } = this.state;
		const { classes } = this.props;
		var row = [];
		var i = 0;
		while (i < size) {
			var id = String(rowNumber) + String(i);
			row.push(
				<Grid item key={id}>
					<Button
						id={id}
						className={
							positions.includes(id)
								? classes.selectedButton
								: classes.unselectedButton
						}
						onClick={this.handleClick}
						size="small"
					></Button>
				</Grid>
			);
			i += 1;
		}
		return (
			<Grid
				key={rowNumber}
				className={classes.row}
				style={{}}
				container
				direction="row"
				justify="center"
				item
				xs={12}
				alignContent="center"
			>
				{row}
			</Grid>
		);
	};

	componentDidMount() {
		const { gameId } = this.state;
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
							loading: false,
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

	handleSubmit = async () => {
		const { positions, gameId, userId } = this.state;
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
					this.setState({
						triesLeft,
						score,
						comment: `You got ${numCorrect} / ${numShips} correct`,
						gameOver,
						gameWon,
						correctPositions: positions,
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
