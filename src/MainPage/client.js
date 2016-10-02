import React from "react";
import ReactDOM from "react-dom";

import MainPage from "./MainPage.js";

import { Router, Route, IndexRoute, hashHistory } from "react-router";
import Cookie from 'js-cookie';
import Ajax from '../utils/Ajax';
import Auth from '../utils/Auth';
import NodeRSA from 'node-rsa';

var auth = new Auth("/#/", "/#/login");
var keyPair = new NodeRSA({b: 512});
keyPair.importKey(publicKey, 'public');




const app = document.getElementById('app');

ReactDOM.render(

	<Router history={hashHistory}>

		<Route path="/" component={MainPage}>
		</Route>

		<Route path="/home" component={MainPage}>
		</Route>

	</Router>

, app);
