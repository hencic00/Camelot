import NodeRSA from 'node-rsa';
import React from "react";
import ReactDOM from "react-dom";

import Auth from '../utils/Auth';
import LoginPage from "./LoginPage.js";

require("../master.scss");

var auth = new Auth("/#/", "/#/login");
var keyPair = new NodeRSA({b: 512});
keyPair.importKey(publicKey, 'public');

const app = document.getElementById('app');

ReactDOM.render(
	<LoginPage keyPair={keyPair}></LoginPage>
, app);





