import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";

require("./master.scss");


import Layout from "./Layout/Layout.js";
import LoginPage from "./LoginPage.js";


const app = document.getElementById('app');

ReactDOM.render(

	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
		</Route>

		<Route path="/login" component={LoginPage}>
		</Route>
	</Router>

, app);
