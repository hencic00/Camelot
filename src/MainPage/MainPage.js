import React from "react";
import NavBar from "./NavBar/NavBar.js";
import BoxList from "./BoxList/BoxList.js";
import Content from "./Content/Content.js";
import Cookie from 'js-cookie';

require("./MainPage.scss");
var socket = require('socket.io-client')('http://localhost:4000', {query: "ime=" + Cookie.get('eMail')});

export default class MainPage extends React.Component
{

	constructor()
	{
		super();
	}

	componentDidMount()
	{
		// var io = require('socket.io')('http://localhost:4000');
		// socket.on('tweet', function(data)
		// {
		// 	console.log(data);
		// });
	}

	render()
	{

		return (
			<div className='MainPage'>
				<Content socket = {socket}/>
				<NavBar/>
				<BoxList/>
			</div>
		);
	}
}