import React from "react";
require("./BoxList.scss");

import ChatBox from "./ChatBox/ChatBox.js";
import ContactBox from "./ContactBox/ContactBox.js";


export default class BoxList extends React.Component
{

	constructor()
	{
		super();
		this.state = {chatBoxCounter: 0};
	}

	addChatBox()
	{
		console.log("mhm");
	}

	render()
	{

		return (
			<div className="boxList">

				<ContactBox/>

				<ChatBox name={"Jan Jurman"}/>
				<ChatBox name={"Jan Hencic"}/>

			</div>
		);
	}
}