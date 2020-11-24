import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import firebase from "firebase/app";
import LoginPage from "./pages/login-page";
import React, { Component } from "react";
import axios from "axios";
// Pages
import ChallengesPage from "./pages/challenges-page";
import ModeSelectionPage from "./pages/mode-selection-page";
import SinglePlayerPage from "./pages/single-player-page";
import ChallengePage from "./pages/challenge-page";

axios.defaults.baseURL =
	"https://us-central1-space-maniaa.cloudfunctions.net/api";

class App extends Component {
	constructor() {
		super();
		this.state = {
			username: null,
			userId: null,
		};
		this.handleSignOut = this.handleSignOut.bind(this);
	}

	render() {
		const { username } = this.state;
		return (
			<div className="App">
				<div className="page">
					<Router>
						<div className="navbar">
							<Link to="/login">
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
								component={ChallengePage}
								exact
								path="/challenge/:challengeId"
								render={() => (
									<ChallengePage userId={this.state.userId} />
								)}
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
			if (user && user.uid !== this.state.userId) {
				this.setState({ username: user.displayName, userId: user.uid });
			}
		});
	}

	handleSignOut() {
		firebase.auth().signOut();
		window.location.href = "/mode-selection";
	}
}
export default App;
