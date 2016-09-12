import React from "react";
import NavBar from "./NavBar/NavBar.js";
import BoxList from "./BoxList/BoxList.js";

export default class Layout extends React.Component
{

	constructor()
	{
		super();
	}

	render()
	{

		return (
			<div className='Layout'>
				<NavBar/>
				<BoxList/>
			</div>
		);
	}
}