import React, { Component } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
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

class ChallengeCreationPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userId: this.props.userId,
			size: 2,
			options: [2, 3, 4, 5, 6, 7],
			positions: [],
			tries: 5,
			challengeName: "",
		};

		this.handleChange = this.handleChange.bind(this);
	}

	render() {
		const { size, tries, challengeName } = this.state;
		return (
			<div>
				<h3>Create a challenge</h3>
				<div>
					<div style={{ padding: "20px" }}>
						<TextField
							id="challengeName"
							name="challengeName"
							label="Pick a Challenge Name"
							value={challengeName}
							onChange={this.handleChange}
						/>
					</div>
					<FormControl style={{ width: "200px" }}>
						<InputLabel>Pick the Size of your board</InputLabel>
						<Select
							id="size"
							value={size}
							name="size"
							onChange={this.handleChange}
						>
							{this.menuItems()}
						</Select>
					</FormControl>
					<h4>Select the ship positions</h4>
					<div style={{ margin: "20px" }}>{this.board()}</div>
					<FormControl style={{ width: "250px" }}>
						<InputLabel>
							Pick the number of tries allowed
						</InputLabel>
						<Select
							id="tries"
							name="tries"
							value={tries}
							onChange={this.handleChange}
						>
							{this.menuItems()}
						</Select>
					</FormControl>
				</div>

				<button onClick={this.handleSubmit}>Create Challenge</button>
			</div>
		);
	}

	componentDidMount() {
		const { userId } = this.state;
		if (!userId) {
			alert("Login to create challenge");
			this.props.history.push("/login");
		}
	}

	menuItems = () => {
		const { options } = this.state;
		return options.map((option) => {
			return <MenuItem value={option}>{option}</MenuItem>;
		});
	};

	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value });
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
		const { positions, userId, challengeName, size, tries } = this.state;
		var answers = positions.map((id) => {
			return { x: parseInt(id[0], 10), y: parseInt(id[1], 10) };
		});
		const numShips = answers.length;
		await axios
			.post("/addChallenge", {
				challengeName,
				positions: answers,
				userId,
				size,
				numShips,
				tries,
			})
			.then((response) => {
				if (response.status === 200) {
					alert("Challenge Created Successfully");
				} else {
					alert("something went wrong");
					console.log(response);
				}
			})
			.catch((err) => {
				console.log(err);
				alert("something went wrong");
			})
			.then(() => {
				this.props.history.push("/challenges");
			});
	};

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
}

export default withStyles(styles)(ChallengeCreationPage);
