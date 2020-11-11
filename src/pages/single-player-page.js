import React, { Component } from "react";
import Button from "@material-ui/core/button";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/grid";
import Typography from "@material-ui/core/typography";
import axios from "axios";

const styles = (theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: "center",
		color: theme.palette.text.secondary,
	},
});

class SinglePlayerPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			size: 4,
			numOfShips: 3,
			positions: [],
			triesLeft: 10,
			gameId: "BmJqiqUgRIg2i7xKl5Gr",
			userId: "xlRBt8wsuRhvn0y2iEfo5TzpDlD2",
			score: 0,
			gameOver: false,
			gameWon: false,
			correctPositions: [],
		};

		this.handleReset = this.handleReset.bind(this);
	}

	render() {
		const { classes } = this.props;
		const { triesLeft, score, comment, gameWon } = this.state;
		return (
			<div className={classes.root}>
				Single Player
				<div>{this.board()}</div>
				<Button id="Submit" onClick={this.handleSubmit}>
					Submit
				</Button>
				<Button id="Reset" onClick={this.handleReset}>
					Reset
				</Button>
				<Typography>Tries left: {triesLeft}</Typography>
				<Typography>Score: {score}</Typography>
				<Typography>{comment}</Typography>
				{gameWon ? <Typography>You won! </Typography> : <div></div>}
				<Typography>
					For testing purposes, the answers are (0, 0), (1, 0), (0, 3)
				</Typography>
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
		var row = [];
		var i = 0;
		while (i < size) {
			var id = String(rowNumber) + String(i);
			row.push(
				<Grid item xs={12 / size} key={id}>
					<Button
						id={id}
						variant={
							positions.includes(id) ? "outlined" : "contained"
						}
						onClick={this.handleClick}
					>
						<Typography id={id}>Hiii</Typography>
					</Button>
				</Grid>
			);
			i += 1;
		}
		return (
			<Grid key={rowNumber} container>
				{row}
			</Grid>
		);
	};

	handleClick = (event) => {
		const { id } = event.target;
		const { positions } = this.state;
		var newPositions = positions;
		if (positions.includes(id)) {
			newPositions.splice(positions.indexOf(id), 1);
			this.setState({ positions: newPositions });
		} else {
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
					console.log(response.data);
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

export default withStyles(styles)(SinglePlayerPage);
