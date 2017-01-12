import React from "react";
import indexOf from 'lodash/indexOf';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';

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
			chatList: [],
			chatBoxCounter: 0,
			selectedChatBox: "",
			isContactBoxHidden: "hidden"
		};
	}


	addChatBox(userName)
	{
		
		var index = findIndex(this.state.chatList, {id: userName});
		
		if (index == -1) 
		{
			this.setState
			(
				{
					chatList: this.state.chatList.concat({id: userName, isHidden: ""}),
					chatBoxCounter: this.state.chatBoxCounter + 1
				}
			);
		}
		else if (index > -1)
		{
			this.removeChatBox(userName);
		}

	}

	removeChatBox(userName)
	{


		var index = findIndex(this.state.chatList, {id: userName});

		var chatList = this.state.chatList;
		chatList.splice(index, 1);

		if (this.state.selectedChatBox == userName) 
		{
			this.setState
			(
				{
					chatList: chatList,
					chatBoxCounter: this.state.chatBoxCounter - 1,
					selectedChatBox: ""
				}
			);
		}
		else
		{
			this.setState
			(
				{
					chatList: chatList,
					chatBoxCounter: this.state.chatBoxCounter - 1
				}
			);
		}
	}

	hideShowBox(userName)
	{
		var index = findIndex(this.state.chatList, {id: userName});
		var chatList = this.state.chatList;

		if (this.state.chatList[index].isHidden == "")
		{
			chatList[index] = {id: userName, isHidden: "hidden"};

			if (this.state.selectedChatBox == userName)
			{
				this.setState({selectedChatBox: "", chatList: chatList});
			}
			else
			{
				this.setState({chatList: chatList});
			}
		}
		else
		{
			chatList[index] = {id: userName, isHidden: ""};

			this.setState({chatList: chatList, selectedChatBox: userName});
		}		

	}

	updateSelectedChatBox(userName)
	{
		
		if (this.state.selectedChatBox != userName)
		{
			var index = findIndex(this.state.chatList, {id: userName});

			this.setState({selectedChatBox: userName});
		}

	}

	hideContactBox()
	{
		if (this.state.isContactBoxHidden == "")
		{
			this.setState({isContactBoxHidden: "hidden"});
		}
		else if (this.state.isContactBoxHidden == "hidden")
		{
			this.setState({isContactBoxHidden: ""});
		}
	}

	render()
	{
		var nekaj = [];
		for (var i = 0; i < this.state.chatList.length; i++)
		{
			if (this.state.selectedChatBox == this.state.chatList[i].id)
			{
				nekaj.push(<ChatBox removeMyself={this.removeChatBox.bind(this)} updateSelectedChatBox={this.updateSelectedChatBox.bind(this)} context={"selected " + this.state.chatList[i].isHidden} hideShowMyself={this.hideShowBox.bind(this)} key={this.state.chatList[i].id} userName={this.state.chatList[i].id}/>);
			}
			else
			{
				nekaj.push(<ChatBox removeMyself={this.removeChatBox.bind(this)} updateSelectedChatBox={this.updateSelectedChatBox.bind(this)} context={this.state.chatList[i].isHidden} hideShowMyself={this.hideShowBox.bind(this)} key={this.state.chatList[i].id} userName={this.state.chatList[i].id}/>);
			}
			
		}


		return (
			<div className="boxList">

				<ContactBox addChatBox={this.addChatBox.bind(this)} hideMyself={this.hideContactBox.bind(this)} context={this.state.isContactBoxHidden}/>

				{nekaj}

			</div>
		);
	}
}