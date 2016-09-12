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
			<div className="contact box">
					<ul>

						<li className="title">
							<ul>
								<li className="name">
									<div>Contacts</div>
								</li>
							</ul>
						</li>

						<li className="content">
							<ul>
								<li>Jan Henčič</li>
								<li>Jan Henčič</li>
								<li>Jan Henčič</li>
								<li>Jan Henčič</li>
								<li>Jan Henčič</li>
								<li>Jan Henčič</li>
								<li>Jan Henčič</li>
								<li>Jan Henčič</li>
								<li>Jan Henčič</li>
								<li>Jan Henčič</li>
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