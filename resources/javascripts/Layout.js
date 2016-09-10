import React from "react";
import NavBar from "./NavBar.js";
import BoxList from "./BoxList.js";

export default class Layout extends React.Component
{

	constructor(props)
	{
		super(props);
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