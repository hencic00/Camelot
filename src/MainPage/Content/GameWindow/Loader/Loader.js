import React from "react";

require("./Loader.scss");

export default class Loader extends React.Component
{
	constructor()
	{
		super();
	}

	render()
	{

		return (
			<div class="loading loading--double"></div>
		);
	}
}