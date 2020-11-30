import React, { Component } from "react";
// import React, {useState} from 'react';
import Button from "@material-ui/core/Button"; //start/stop button
//import {GAME_STATE} from './GameState.js';
import MenuItem from '@material-ui/core/MenuItem'; //drop down menu
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from "@material-ui/core/InputLabel";
import axios from "axios";


class SinglePlayerPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			//userId: this.props.userId,
			size: 2,
			options: [2, 3, 4, 5, 6, 7],
			//positions: [],
			//tries: 5,
			//challengeName: "",
			ships: 2,
		};

		this.handleClick = this.handleClick.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	// const [gameState, setGameState] = useState(GAME_STATE.BEFORE); // Just an enuerator or the three states see below
  	// const [grid, setGrid] = useState([]);   // the grid
  	// const [totalTime, setTotalTime] = useState(0);  // total time elapsed
	// const [size, setSize] = useState(3);  // selected grid size
	
	// This will run when gameState changes.
	// When a new game is started, generate a new random grid and reset solutions
	// useEffect = ([gameState, size]) => {
	// 	if (gameState === GAME_STATE.IN_PROGRESS) {
	// 		//setGrid(RandomGrid(size));
	// 		//setFoundSolutions([]);
	// 		//get gameID here?
	// 	}
	// };
	    
	render() {
		const {size} = this.state;
		return (
			//Modify to pass any props. CALLBACK functions to each of the components.
			//Componenets can render output based on this data, or update state.
			//Call gameplay during in progress?
			//what to do when game ends?
			
			<div>
				{/*
				<input value={this.state.size}></input> */}
				<button onClick={this.handleClick}> START </button> 
				<FormControl style={{ width: "200px" }}>
					<InputLabel>Select the board size</InputLabel>
					<Select
						id="size"
						value={size}
						name="size"
						onChange={this.handleChange}
					>
						{this.menuItems()}
					</Select>
				</FormControl>
			</div>
		);
	}
	//board size items
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
		let {size} = this.state
		let {ships} = this.state;
		switch(true){
			case size = 2:
				ships = 2;
				break;
			case size = 3:
				ships = 6;
				break;
			case size = 4:
				ships = 8;
				break;
			case size = 5:
				ships = 10;
				break;
			case size = 6:
				ships = 12;
				break;
			case size = 7:
				ships = 14;
				break;
			default:
				ships = 2;
		}
		//this.setState({size: value});
		const res = await axios.post("/makeSinglePlayerGame", {userId: this.props.userId, numShips: {ships}, size: {size}});
		console.log(res);
		this.props.history.push(`/gameplay/${res.data.gameId}`);
		// this game id is hard coded, We actually want this functions to actually make a request and get a gameId and then redirect to /gameplay/theRecievedGameId
	}
}

export default SinglePlayerPage;
