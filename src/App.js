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
import GameplayPage from "./pages/gameplay-page";
import ChallengePage from "./pages/challenge-page";
import ChallengeCreationPage from "./pages/challenge-creation-page";
import UserPage from "./pages/user-page";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
axios.defaults.baseURL =
	"https://us-central1-space-maniaa.cloudfunctions.net/api";

/*const theme = createMuiTheme({
	palette: {
		primary: {
			light: "#757ce8",
			main: "#3f50b5",
			dark: "#002884",
			contrastText: "#fff",
		},
		secondary: {
			light: "#ff7961",
			main: "#f44336",
			dark: "#ba000d",
			contrastText: "#000",
		},
	},
});*/
const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
}));

class AppInner extends Component {
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
		const classes = this.props.classes;
		const handleClick = this.props.handleClick;
		const anchorEl = this.props.anchorEl;
		const handleClose = this.props.handleClose;
		return (
			<div className="App">
				<div className="page">
					<Router>
						<div className="navbar">
							<div className={classes.root}>
								<AppBar position="static" style={{ backgroundColor: "black" }}>
									<Toolbar>
										<div>
											<Button
												edge="start"
												className={classes.menuButton}
												color="inherit"
												aria-label="menu"
												aria-controls="simple-menu"
												aria-haspopup="true"
												onClick={handleClick}
											>
												<MenuIcon />
											</Button>

											<Menu
												id="simple-menu"
												anchorEl={anchorEl}
												keepMounted
												open={Boolean(anchorEl)}
												onClose={handleClose}
											>
												<MenuItem onClick={handleClose}>Profile</MenuItem>
												<MenuItem onClick={handleClose}>My account</MenuItem>
												<MenuItem onClick={handleClose}>Logout</MenuItem>
											</Menu>
										</div>
										<Typography variant="h6" className={classes.title}>
											<h2>Space Mania</h2>
										</Typography>
										<Link to="/login">
											<Button color="inherit">Login</Button>
										</Link>
									</Toolbar>
								</AppBar>
							</div>
							<Link to="/login">
								<button>Sign In</button>
							</Link>
							<Link to="/mode-selection">
								<button>Mode Selection</button>
							</Link>
							<Link to="/user">
								<button>Profile</button>
							</Link>
							<button onClick={this.handleSignOut}>Sign Out</button>
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
							<Route component={ChallengesPage} exact path="/challenges" />
							<Route
								path="/challenge/:challengeId"
								render={(props) => (
									<ChallengePage userId={this.state.userId} {...props} />
								)}
							/>
							<Route component={SinglePlayerPage} exact path="/single-player" />
							<Route
								path="/gameplay/:gameId"
								render={(props) => (
									<GameplayPage userId={this.state.userId} {...props} />
								)}
							/>
							<Route
								path="/challenge-creation"
								render={(props) => (
									<ChallengeCreationPage
										userId={this.state.userId}
										{...props}
									/>
								)}
							/>
							<Route
								path="/user"
								render={(props) => (
									<UserPage userId={this.state.userId} {...props} />
								)}
							/>
							<Route component={ModeSelectionPage} exact path="/" />
						</Switch>
					</Router>
				</div>
			</div>
		);
	}

	async componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user && user.uid !== this.state.userId) {
				axios.post("/getUserInfo", { userId: user.uid }).then((response) => {
					this.setState({
						username: response.data.displayName,
					});
				});
				this.setState({ userId: user.uid });
			}
		});
	}

	handleSignOut() {
		firebase.auth().signOut();
		window.location.href = "/mode-selection";
	}
}
const App = () => {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<AppInner
			classes={classes}
			handleClick={handleClick}
			handleClose={handleClose}
			anchorEl={anchorEl}
		/>
	);
};
export default App;
