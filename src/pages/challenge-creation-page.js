import React, { Component } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import withStyles from "@material-ui/styles/withStyles";
import axios from "axios";

const styles = (theme) => ({
	root: {
		flexGrow: 1,
	},
	input: {
		color: "white",
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: "center",
		color: "black",
	},
	create: {
		color: "white",
		backgroundColor: "green",
		"&:disabled": {
			backgroundColor: "transparent",
		},
	},
	unselectedButton: {
		border: 5,
		borderRadius: 4,
		background: theme.color.grey,
		"&:hover": {
			backgroundColor: theme.color.lightOrange,
		},
	},
	selectedButton: {
		background: "green",
		"&:hover": {
			backgroundColor: "green",
		},
	},
});

class ChallengeCreationPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userId: this.props.userId,
			size: 2,
			sizeOptions: [2, 3, 4, 5, 6, 7],
			triesOptions: [5, 10, 15, 20, 25, 30, 40, 50, 60],
			positions: [],
			tries: 5,
			challengeName: "",
			windowWidth: window.innerWidth,
		};

		this.handleChange = this.handleChange.bind(this);
	}

	render() {
		const { size, tries, challengeName, positions } = this.state;
		const { classes } = this.props;
		return (
			<div>
				<h3>Create a challenge</h3>
				<div>
					<div style={{ padding: "20px" }}>
						<TextField
							id="challengeName"
							name="challengeName"
							label="Pick a Challenge Name"
							variant="outlined"
							value={challengeName}
							onChange={this.handleChange}
							inputProps={{ className: classes.input }}
						/>
					</div>
					<FormControl style={{ width: "200px" }}>
						<InputLabel>Pick the Size</InputLabel>
						<Select
							id="size"
							value={size}
							name="size"
							onChange={this.handleChange}
							inputProps={{ className: classes.input }}
						>
							{this.menuItemsSize()}
						</Select>
					</FormControl>
					<h4>Select the ship positions</h4>
					<div style={{ margin: "20px" }}>{this.board()}</div>
					<FormControl style={{ width: "250px" }}>
						<InputLabel>Pick number of tries</InputLabel>
						<Select
							id="tries"
							name="tries"
							value={tries}
							onChange={this.handleChange}
							inputProps={{ className: classes.input }}
						>
							{this.menuItemsTries()}
						</Select>
					</FormControl>
				</div>

				<Button
					className={classes.create}
					color="inherit"
					disabled={!positions[0]}
					onClick={this.handleSubmit}
					style={{ margin: "20px" }}
				>
					Create Challenge
				</Button>
			</div>
		);
	}

	componentDidMount() {
		const { userId } = this.state;
		if (!userId) {
			alert("Login to create challenge");
			this.props.history.push("/login");
		}
		window.addEventListener("resize", () => {
			this.setState({ windowWidth: window.innerWidth });
		});
	}

	menuItemsSize = () => {
		const { sizeOptions } = this.state;
		return sizeOptions.map((option) => {
			return <MenuItem value={option}>{option}</MenuItem>;
		});
	};

	menuItemsTries = () => {
		const { triesOptions } = this.state;
		return triesOptions.map((option) => {
			return <MenuItem value={option}>{option}</MenuItem>;
		});
	};

	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value });
		if (event.target.name === "size") {
			this.setState({ positions: [] });
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
		return (
			<Grid spacing={1} container>
				{rows}
			</Grid>
		);
	};

	row = (rowNumber) => {
		const { size, positions, windowWidth } = this.state;
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
							positions.includes(id)
								? classes.selectedButton
								: classes.unselectedButton
						}
						style={{ height: width, width: width, minWidth: 1 }}
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
}

export default withStyles(styles)(ChallengeCreationPage);
