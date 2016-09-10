import React from "react";
require("../sass/NavBar.scss");

export default class NavBar extends React.Component
{

	constructor(props)
	{
		super(props);
	}

	render()
	{

		return (
			<div className='NavBar'>
				<ul>
					<li className="floatLeft dot selected"><a href=''>Home</a></li>
					<li className="floatLeft dot"><a href=''>Chat</a></li>
					<li className="floatLeft dot"><a href=''>Leaderboard</a></li>
					<li className="floatLeft"><a href=''>Play</a></li>
					<li className="floatRight"><a href=''>Logout</a></li>
					<li className="floatRight dot"><a href=''>Profile</a></li>
				</ul>
			</div>
		);
	}
}