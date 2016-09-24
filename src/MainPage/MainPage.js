import React from "react";
import NavBar from "./NavBar/NavBar.js";
import BoxList from "./BoxList/BoxList.js";
import Content from "./Content/Content.js";

require("./MainPage.scss");

export default class MainPage extends React.Component
{

	constructor()
	{
		super();
	}

	render()
	{

		return (
			<div className='MainPage'>
				<NavBar auth={this.props.route.auth}/>
				<BoxList/>
				<Content/>
			</div>
		);
	}
}