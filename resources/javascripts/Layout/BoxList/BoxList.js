import React from "react";
import _ from 'lodash';

require("./BoxList.scss");

import ChatBox from "./ChatBox/ChatBox.js";
import ContactBox from "./ContactBox/ContactBox.js";


export default class BoxList extends React.Component
{

	constructor()
	{
		super();
		this.state = 
		{
			activeChats: [],
			chatBoxCounter: 0,
			chatList: [],
			selectedChatBox: ""
		};
	}


	addChatBox(userName)
	{
		
		var index = _.indexOf(this.state.activeChats, userName);
		// var tmp = this.state.selectedChatBoxes;
		// tmp.push("");
		if (index == -1) 
		{
			this.setState
			(
				{
					chatList: this.state.chatList.concat(<ChatBox removeChatBox={this.removeChatBox.bind(this)} updateSelectedChatBox={this.updateSelectedChatBox.bind(this)} context={""} key={userName} userName={userName}/>),
					activeChats: this.state.activeChats.concat(userName),
					chatBoxCounter: this.state.chatBoxCounter + 1
					// selectedChatBoxes: tmp	
				}
			);
		}
		else if (index > -1)
		{
			this.removeChatBox(userName);
		}

	}

	//.selectedChatBoxes[this.state.chatBoxCounter]

	updateSelectedChatBox(userName)
	{
		
		
		var index = _.indexOf(this.state.activeChats, userName);

		console.log(this.state.selectedChatBox);

		if (this.state.selectedChatBox == "")
		{
			var tmp = this.state.chatList;
			tmp[index] = <ChatBox removeChatBox={this.removeChatBox.bind(this)} updateSelectedChatBox={this.updateSelectedChatBox.bind(this)} context={"selected"} key={userName} userName={userName}/>;

			this.setState
			(
				{
					chatList: tmp, 
					selectedChatBox: userName
				}
			);
		}

		else
		{
			var index1 = _.indexOf(this.state.activeChats, this.state.selectedChatBox);

			var tmp = this.state.chatList;

			tmp[index] = <ChatBox removeChatBox={this.removeChatBox.bind(this)} updateSelectedChatBox={this.updateSelectedChatBox.bind(this)} context={"selected"} key={userName} userName={userName}/>;

			tmp[index1] = <ChatBox removeChatBox={this.removeChatBox.bind(this)} updateSelectedChatBox={this.updateSelectedChatBox.bind(this)} context={""} key={this.state.selectedChatBox} userName={this.state.selectedChatBox}/>;



			this.setState
			(
				{
					chatList: tmp, 
					selectedChatBox: userName
				}
			);

		}

		

	}

	removeChatBox(userName)
	{
		var index = _.indexOf(this.state.activeChats, userName);

		var tmp = this.state.chatList;
		tmp.splice(index, 1);

		var tmp1 = this.state.activeChats;
		tmp1.splice(index, 1);

		this.setState
		(
			{
				chatList: tmp,
				activeChats: tmp1,
				chatBoxCounter: this.state.chatBoxCounter - 1	
			}
		);
	}

	render()
	{
		return (
			<div className="boxList">

				<ContactBox addChatBox={this.addChatBox.bind(this)}/>

				{this.state.chatList}

			</div>
		);
	}
}