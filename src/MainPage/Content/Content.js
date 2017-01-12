import React from "react";
import GameWindow from "./GameWindow/GameWindow.js";
import Ajax from '../../utils/Ajax';
import Cookie from 'js-cookie';

require("./Content.scss");

export default class MainPage extends React.Component
{

	constructor()
	{
		super();

		this.state = 
		{
			button: <button type="button" onClick={this.lookForMatch.bind(this)}>Click Me!</button>,
			gameWindow: null
		};
	}

	lookForMatch()
	{
		this.setState({button: null, gameWindow: <div className='GameWindowContainer'><GameWindow socket = {this.props.socket}/></div>});

		var ajax = new Ajax();

		var data = {name: Cookie.get('eMail')};
		data = encodeURIComponent(JSON.stringify(data));
		data = "json=" + data;

		ajax.POST("/lookingForGame", data, function(response)
		{
			console.log(response);
		});
	}

	render()
	{
		return (
			<div className='Content'>
				{this.state.button}
				{this.state.gameWindow}
			</div>
		);
	}
}