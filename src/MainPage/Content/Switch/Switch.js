import React from "react";

require("./Switch.scss");

export default class Switch extends React.Component
{
	constructor()
	{
		super();
	}

	render()
	{

		return (
			<div class="switch">
				<input type="checkbox" id="c1" />
				<label for="c1"></label>
			</div>
		);
	}
}