import React from "react";

export default class ChatBox extends React.Component
{

	constructor()
	{
		super();
	}

	render()
	{

		return (
			<div className={"msg " + this.props.context}>
				<ul>
					
					<li className="topLevel">
						<ul>
							<li className="senderName">{ this.props.senderName }</li>
							<li className="time">23 Jan 2:00 pm</li>
						</ul>
					</li>

					<li className="bottomLevel">
						<ul>
							<li className="msgContent">{ this.props.content }</li>
							<li className="senderPic"><img src={ this.props.senderImgPath }/></li>
						</ul>
					</li>

				</ul>
			</div>
		);
	}
}