import React from "react";

export default class ChatBox extends React.Component
{

	constructor()
	{
		super();
	}

	handleClick(e)
	{
		this.props.addChatBox(e.target.innerHTML);
	}

	hideMyself()
	{
		this.props.hideMyself();
	}

	render()
	{

		return (
			<div className={"contact box " + this.props.context}>
				<ul>

					<li className="title" onClick={this.hideMyself.bind(this)}>
						<ul>
							<li className="name">
								<div>Contacts</div>
							</li>
						</ul>
					</li>

					<li className="content">
						<ul onClick={this.handleClick.bind(this)}>
							<li>Jan Henčič</li>
							<li>Jan Jurman</li>
							<li>Damjan Novarlić</li>
						</ul>
					</li>

					<li className="input">
						<input type="text" placeholder="Search contacts"/>
					</li>
				</ul>
			</div>
		);
	}
}