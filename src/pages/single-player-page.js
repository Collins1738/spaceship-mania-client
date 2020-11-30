import React, { Component } from "react";
// import React, {useState} from 'react';
import Button from "@material-ui/core/Button"; //start/stop button
//import {GAME_STATE} from './GameState.js';
import MenuItem from '@material-ui/core/MenuItem'; //drop down menu
//import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from "@material-ui/core/InputLabel";
import axios from "axios";



class SinglePlayerPage extends Component {
  constructor(props) {
    super(props);

		this.state = {
			size: 2,
			options: [2, 3, 4, 5, 6, 7],
			ships: 2,
		};

		this.handleClick = this.handleClick.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	    
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
				<Button onClick={this.handleClick}> START </Button> 
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
		const {size} = this.state
		let ships = 1;
		switch(size){
			case 2:
				ships = 2;
				break;
			case 3:
				ships = 6;
				break;
			case 4:
				ships = 8;
				break;
			case 5:
				ships = 10;
				break;
			case 6:
				ships = 12;
				break;
			case 7:
				ships = 14;
				break;
			default:
				ships = 1;
		}
		
		const res = await axios.post("/makeSinglePlayerGame", {userId: this.props.userId, numShips: ships, size: size});
		this.props.history.push(`/gameplay/${res.data.gameId}`);
		// this game id is hard coded, We actually want this functions to actually make a request and get a gameId and then redirect to /gameplay/theRecievedGameId
	}
}

export default SinglePlayerPage;
