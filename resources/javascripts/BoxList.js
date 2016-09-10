import React from "react";
require("../sass/BoxList.scss");

export default class BoxList extends React.Component
{

	constructor(props)
	{
		super(props);
	}

	render()
	{

		return (
			<div className="boxList">

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

				<div className="chat box">
					<ul>
						<li className="title">
							<ul>
								<li className="name">
									<div>Jan Jurman</div>
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
							<div className="msg received">
								<ul>
									
									<li className="topLevel">
										<ul>
											<li className="senderName">Jan Jurman</li>
											<li className="time">23 Jan 2:00 pm</li>
										</ul>
									</li>

									<li className="bottomLevel">
										<ul>
											<li className="msgContent">To si res sam dzajniral? Pa ti si neverjeten Henčič!</li>
											<li className="senderPic"><img src="/images/jurman.jpg"/></li>
										</ul>
									</li>

								</ul>
							</div>

							<div className="msg sent">
								<ul>
									<li className="topLevel">
										<ul>
											<li className="senderName">Jan Henčič</li>
											<li className="time">23 Jan 2:00 pm</li>
										</ul>
									</li>

									<li className="bottomLevel">
										<ul>
											<li className="msgContent">Jap. Skoda da nisi taki mojster ko jas...</li>
											<li className="senderPic">
												<img src="/images/hencic.jpg"/>
											</li>
										</ul>
									</li>
								</ul>

							</div>

							<div className="msg received">
								<ul>
									<li className="topLevel">
										<ul>
											<li className="senderName">Jan Jurman</li>
											<li className="time">23 Jan 2:00 pm</li>
										</ul>
									</li>
										<li className="bottomLevel">
											<ul>
												<li className="msgContent">Res je! Moram se še dosti naučit.</li>
												<li className="senderPic"><img src="/images/jurman.jpg"/></li>
											</ul>
										</li>
								</ul>
							</div>
						</li>

						<li className="input">
							<input type="text" placeholder="Type a message"/>
						</li>
					</ul>
				</div>

				<div className="chat box">
					<ul>
						<li className="title">
							<ul>
								<li className="name">
									<div>Jan Henčič</div>
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
							<div className="msg sent">
								<ul>
									
									<li className="topLevel">
										<ul>
											<li className="senderName">Jan Jurman</li>
											<li className="time">23 Jan 2:00 pm</li>
										</ul>
									</li>

									<li className="bottomLevel">
										<ul>
											<li className="msgContent">To si res sam dzajniral? Pa ti si neverjeten Henčič!</li>
											<li className="senderPic"><img src="/images/jurman.jpg"/></li>
										</ul>
									</li>

								</ul>
							</div>

							<div className="msg received">
								<ul>
									<li className="topLevel">
										<ul>
											<li className="senderName">Jan Henčič</li>
											<li className="time">23 Jan 2:00 pm</li>
										</ul>
									</li>

									<li className="bottomLevel">
										<ul>
											<li className="msgContent">Jap. Skoda da nisi taki mojster ko jas...</li>
											<li className="senderPic">
												<img src="/images/hencic.jpg"/>
											</li>
										</ul>
									</li>
								</ul>

							</div>

							<div className="msg sent">
								<ul>
									<li className="topLevel">
										<ul>
											<li className="senderName">Jan Jurman</li>
											<li className="time">23 Jan 2:00 pm</li>
										</ul>
									</li>
										<li className="bottomLevel">
											<ul>
												<li className="msgContent">Res je! Moram se še dosti naučit.</li>
												<li className="senderPic"><img src="/images/jurman.jpg"/></li>
											</ul>
										</li>
								</ul>
							</div>
						</li>

						<li className="input">
							<input type="text" placeholder="Type a message"/>
						</li>
					</ul>
				</div>

			</div>
		);
	}
}