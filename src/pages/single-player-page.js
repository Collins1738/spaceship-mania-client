import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import withStyles from "@material-ui/styles/withStyles";
import axios from "axios";

const styles = (theme) => ({
	a: {
		background: "green",
		color: "white",
		"&:hover": {
			backgroundColor: "green",
		},
		margin: "40px",
	},
	input: {
		color: "white",
	},
});

class SinglePlayerPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			size: 2,
			options: [2, 3, 4, 5, 6, 7],
			ships: 2,
			loading: false,
		};

		this.handleClick = this.handleClick.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	render() {
		const { size, loading } = this.state;
		const { classes } = this.props;
		return (
			<div>
				{loading ? (
					<div>Loading... </div>
				) : (
					<div>
						<div>
							<FormControl style={{ width: "200px" }}>
								<InputLabel>Select the board size</InputLabel>
								<Select
									id="size"
									value={size}
									name="size"
									onChange={this.handleChange}
									inputProps={{ className: classes.input }}
								>
									{this.menuItems()}
								</Select>
							</FormControl>
						</div>

						<Button
							className={classes.a}
							onClick={this.handleClick}
							size="small"
						>
							START
						</Button>
					</div>
				)}
			</div>
		);
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

	async handleClick() {
		const { size } = this.state;
		let ships = 1;
		switch (size) {
			case 2:
				ships = 2;
				break;
			case 3:
				ships = 3;
				break;
			case 4:
				ships = 4;
				break;
			case 5:
				ships = 5;
				break;
			case 6:
				ships = 6;
				break;
			case 7:
				ships = 7;
				break;
			default:
				ships = 1;
		}
		this.setState({ loading: true });
		const res = await axios.post("/makeSinglePlayerGame", {
			userId: this.props.userId,
			numShips: ships,
			size: size,
		});
		this.setState({ loading: false });
		this.props.history.push(`/gameplay/${res.data.gameId}`);
	}
}

export default withStyles(styles)(SinglePlayerPage);
