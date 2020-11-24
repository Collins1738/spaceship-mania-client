import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import firebase from "firebase/app";
import LoginPage from "./pages/login-page";
import React, { Component } from "react";
import axios from "axios";
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { green, purple } from '@material-ui/core/colors';
// Pages
import ChallengesPage from "./pages/challenges-page";
import ModeSelectionPage from "./pages/mode-selection-page";
import SinglePlayerPage from "./pages/single-player-page";

axios.defaults.baseURL =
	"https://us-central1-space-maniaa.cloudfunctions.net/api";

class App extends Component {
	constructor() {
		super();
		this.state = {
			username: null,
		};
		this.handleSignOut = this.handleSignOut.bind(this);
	}

	render() {
		const { username } = this.state;
		return (
			<div className="App">
				<div className="page">
					<Router>
						<div className="navbar" >
							<Link to="/login"  >
								<button>Sign In</button>
							</Link>
							<Link to="/mode-selection">
								<button>Mode Selection</button>
							</Link>
							<button onClick={this.handleSignOut}>
								Sign Out
							</button>
						</div>
						<h2>Space Mania</h2>
						<h1>Hey {username || "Anonymous"}</h1>

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

	async componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user && user.displayName !== this.state.user) {
				this.setState({ username: user.displayName });
			}
		});
	}

	handleSignOut() {
		firebase.auth().signOut();
		window.location.href = "/mode-selection";
	}
}
export default App;
