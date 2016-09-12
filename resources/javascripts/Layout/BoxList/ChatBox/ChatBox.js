import React from "react";
import Message from "./Message/Message.js";

export default class ChatBox extends React.Component
{

	constructor()
	{
		super();

		this.state =
		{
			msg: ["To si res sam dzajniral? Pa ti si neverjeten Henčič!", "Jap. Skoda da nisi taki mojster ko jas..." , "Res je! Moram se še dosti naučit."]
		};
	}

	render()
	{

		return (
			<div className="chat box">
				<ul>
					<li className="title">
						<ul>
							<li className="name">
								<div>{this.props.name}</div>
							</li>
							<li className="alert">
								<div>3</div>
							</li>
							<li className="closeIcon">
								<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 28 28"  xmlSpace="preserve"> <g> <g id="x"> <g> <polygon  points="28,22.398 19.594,14 28,5.602 22.398,0 14,8.402 5.598,0 0,5.602 8.398,14 0,22.398 5.598,28 14,19.598 22.398,28 			"/> </g> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>
								</svg>
							</li>
						</ul>
					</li>

					<li className="content">
						<Message context="received" content={this.state.msg[0]} senderName="Jan Jurman" senderImgPath="images/jurman.jpg" time="23 Jan 2:00 pm"/>
						<Message context="sent" content={this.state.msg[1]} senderName="Jan Hencic" senderImgPath="images/hencic.jpg" time="23 Jan 2:00 pm"/>
						<Message context="received" content={this.state.msg[2]} senderName="Jan Jurman" senderImgPath="images/jurman.jpg" time="23 Jan 2:00 pm"/>
					</li>

					<li className="input">
						<input type="text" placeholder="Type a message"/>
					</li>
				</ul>
			</div>
		);
	}
}