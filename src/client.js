import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";

import AuthService from './utils/AuthService'
import LoginPage from "./LoginPage/LoginPage.js";
import MainPage from "./MainPage/MainPage.js";

// require('!webpack-env-loader!./.env')

require("./master.scss");

const app = document.getElementById('app');

var nekaj = 'jzmdfuh4mqGsLUBusBRr8c7negvhr8ze';
var nekaj1 = 'hencic00.eu.auth0.com';

const auth = new AuthService(nekaj, nekaj1);

ReactDOM.render(

	<Router history={hashHistory}>
		<Route path="/" component={MainPage}>
		</Route>

		<Route path="/login" component={LoginPage}>
		</Route>
	</Router>

, app);
