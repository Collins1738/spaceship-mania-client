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
import makeStyles from "@material-ui/core/styles/makeStyles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import orange from "@material-ui/core/colors/orange";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import logo from "./assets/logo.jpg";

axios.defaults.baseURL =
	"https://us-central1-space-maniaa.cloudfunctions.net/api";
// "http://localhost:5000/space-maniaa/us-central/api";

export const theme = createMuiTheme({
	palette: {
		primary: {
			light: orange["500"],
			main: orange["900"],
			dark: orange["700"],
			contrastText: "#fff",
		},
		secondary: {
			light: "#ff7961",
			main: "#FFFFFF",
			dark: "#ba000d",
			contrastText: "#000",
		},
	},

	color: {
		primary: orange["900"],
		lightOrange: orange["300"],
		white: "#FFFFFF",
		black: "#000000",
		grey: "#494949",
	},

	overrides: {
		MuiFormControlLabel: {
			"&$focused": {
				color: orange["900"],
			},
			borderColor: orange["900"],
			color: orange["900"],
		},
		MuiOutlinedInput: {
			root: {
				position: "relative",
				"& $notchedOutline": {
					borderColor: orange["900"],
				},
				"&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
					borderColor: orange["900"],
					// Reset on touch devices, it doesn't add specificity
					"@media (hover: none)": {
						borderColor: orange["900"],
					},
				},
				"&$focused $notchedOutline": {
					borderColor: orange["900"],
					borderWidth: 1,
				},
			},
		},
		MuiFormLabel: {
			root: {
				color: orange["900"],
			},
		},
	},
});

const useStyles = makeStyles(() => ({
	root: {
		flexGrow: 1,
	},
	input: {
		color: "white",
	},
	title: {
		flexGrow: 1,
	},
	body: {
		maxWidth: 800,
		margin: "150px auto auto auto",
	},
}));

class AppInner extends Component {
	constructor() {
		super();
		this.state = {
			username: null,
			userId: null,
			anchorElProfile: null,
			isProfileMenuOpen: false,
		};
		this.handleSignOut = this.handleSignOut.bind(this);
		this.handleProfileMenuOpen = this.handleProfileMenuOpen.bind(this);
		this.handleProfileMenuClose = this.handleProfileMenuClose.bind(this);
	}

	render() {
		const { username } = this.state;
		const classes = this.props.classes;
		return (
			<div className="App">
				<ThemeProvider theme={theme}>
					<div className="page">
						<Router>
							{this.navbar()}
							<div className={classes.body}>
								<h2>Space Mania</h2>

								<h1>Hey {username || "Anonymous"}</h1>

								<Switch>
									<Route
										component={LoginPage}
										exact
										path="/login"
									/>

									<Route
										path="/mode-selection"
										render={(props) => (
											<ModeSelectionPage {...props} />
										)}
									/>
									<Route
										path="/single-player"
										render={(props) => (
											<SinglePlayerPage
												userId={this.state.userId}
												{...props}
											/>
										)}
									/>
									<Route
										path="/gameplay/:gameId"
										render={(props) => (
											<GameplayPage
												userId={this.state.userId}
												{...props}
												key={props.match.params.gameId}
											/>
										)}
									/>
									<Route
										component={ChallengesPage}
										exact
										path="/challenges"
									/>
									<Route
										path="/challenge/:challengeId"
										render={(props) => (
											<ChallengePage
												userId={this.state.userId}
												{...props}
											/>
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
											<UserPage
												userId={this.state.userId}
												{...props}
											/>
										)}
									/>
									<Route
										exact
										path="/"
										render={(props) => (
											<ModeSelectionPage {...props} />
										)}
									/>
								</Switch>
							</div>
						</Router>
					</div>
				</ThemeProvider>
			</div>
		);
	}

	async componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user && user.uid !== this.state.userId) {
				axios
					.post("/getUserInfo", { userId: user.uid })
					.then((response) => {
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

	handleSignIn() {
		window.location.href = "/login";
	}

	handleProfileMenuOpen(event) {
		this.setState({ anchorElProfile: event.currentTarget });
	}

	handleProfileMenuClose() {
		this.setState({ anchorElProfile: null });
	}

	navbar = () => {
		const { classes, handleClick, handleClose, anchorEl } = this.props;
		const { userId, anchorElProfile } = this.state;
		return (
			<div className="navbar">
				<div className={classes.root}>
					<AppBar
						position="fixed"
						style={{ backgroundColor: "black" }}
					>
						<Toolbar>
							<div>
								<Button
									position="static"
									edge="start"
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
									color="white"
									anchorEl={anchorEl}
									keepMounted
									open={Boolean(anchorEl)}
									onClose={handleClose}
								>
									<MenuItem
										onClick={handleClose}
										component={Link}
										to="/single-player"
									>
										Single Player
									</MenuItem>
									<MenuItem
										onClick={handleClose}
										component={Link}
										to="/challenges"
									>
										Challenges
									</MenuItem>
								</Menu>
							</div>
							<Typography variant="h6" className={classes.title}>
								<div style={{ padding: "30px" }}>
									<Link to="/mode-selection">
										<img
											src={logo}
											alt="logo"
											width="100%"
											height="60px"
										/>
									</Link>
								</div>
							</Typography>

							{userId ? (
								<div>
									<IconButton
										color="inherit"
										edge="end"
										aria-label="account of current user"
										onClick={this.handleProfileMenuOpen}
									>
										<AccountCircle />
									</IconButton>
									<Menu
										anchorEl={anchorElProfile}
										id="profile-menu"
										open={Boolean(anchorElProfile)}
										keepMounted
										onClose={this.handleProfileMenuClose}
									>
										<MenuItem
											onClick={() => {
												this.handleProfileMenuClose();
											}}
											component={Link}
											to="/user"
										>
											My Profile
										</MenuItem>
										<MenuItem
											onClick={() => {
												this.handleProfileMenuClose();
												this.handleSignOut();
											}}
										>
											Sign Out
										</MenuItem>
									</Menu>
								</div>
							) : (
								<Button
									onClick={this.handleSignIn}
									color="inherit"
								>
									Sign In
								</Button>
							)}
						</Toolbar>
					</AppBar>
				</div>
			</div>
		);
	};
}
const App = (props) => {
	const classes = useStyles(theme);
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
			{...props}
		/>
	);
};
export default App;
