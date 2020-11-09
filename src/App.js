import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import firebase from "firebase";
import LoginPage from "./pages/login-page";
import React, { Component } from "react";

// Pages
import ChallengesPage from "./pages/challenges-page";
import ModeSelectionPage from "./pages/mode-selection-page";
import SinglePlayerPage from "./pages/single-player-page";

class App extends Component {
	constructor() {
		super();
		this.state = {};

		this.handleSignIn = this.handleSignIn.bind(this);
		this.handleSignOut = this.handleSignOut.bind(this);
	}

	render() {
		return (
			<div className="App">
				<div className="page">
					<div className="navbar">
						<button onClick={this.handleSignIn}>Sign In</button>
						<button onClick={this.redirectChallenges}>
							Mode Selection
						</button>
						<button onClick={this.handleSignOut}>Sign Out</button>
					</div>
					<h2>Space Mania</h2>
					<h1>
						Hey{" "}
						{firebase.auth().currentUser?.displayName ||
							"Anonymous"}
					</h1>
					<Router>
						<Switch>
							<Route component={LoginPage} exact path="/login" />
							<Route
								component={ModeSelectionPage}
								exact
								path="/mode-selection"
							/>
							<Route
								component={ChallengesPage}
								exact
								path="/challenges"
							/>
							<Route
								component={SinglePlayerPage}
								exact
								path="/single-player"
							/>
							<Route
								component={ModeSelectionPage}
								exact
								path="/"
							/>
						</Switch>
					</Router>
				</div>
			</div>
		);
	}

	handleSignIn() {
		window.location.href = "/login";
	}

	handleSignOut() {
		firebase.auth().signOut();
		window.location.href = "/mode-selection";
	}

	redirectChallenges() {
		window.location.href = "/mode-selection";
	}
}
export default App;
