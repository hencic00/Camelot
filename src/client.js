import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";
import Cookie from 'js-cookie';
import Ajax from './utils/Ajax';
import Auth from './utils/Auth';

import LoginPage from "./LoginPage/LoginPage.js";
import MainPage from "./MainPage/MainPage.js";


require("./master.scss");

var auth = new Auth();

const app = document.getElementById('app');

ReactDOM.render(

	<Router history={hashHistory}>

		<Route path="/" component={MainPage} onEnter={auth.requireAuth} auth={auth}>
		</Route>

		<Route path="/home" component={MainPage} onEnter={auth.requireAuth} auth={auth}>
		</Route>

		<Route path="/login" component={LoginPage} onEnter={auth.requireNotAuth} auth={auth}>
		</Route>
	</Router>

, app);
