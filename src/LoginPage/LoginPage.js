import React from "react";
import Ajax from '../utils/Ajax';
import Cookie from 'js-cookie';
import crypto from 'crypto-browserify';

require("./loginForm.scss");

export default class LoginPage extends React.Component
{

	constructor(props)
	{
		super(props);
		this.state = 
		{
			loginSwitch: "selected",
			signUpSwitch: "",
			title:
			{	
				content: "Welcome back"
			},
			inputFields:
			[
				{
					placeholder: "E-mail",
					type: "text"
				},
				{
					placeholder: "Password",
					type: "password"
				}
			],
			button:
			{	
				content: "Login",
				pressed: ""
			}
		};
		// this.auth = new Auth();
		this.mailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
		this.listenForKeyPress();
	}

	switchToSignUp()
	{
		if (this.state.signUpSwitch == "" && this.state.loginSwitch == "selected")
		{

			this.setState(
			{
				loginSwitch: "",
				signUpSwitch: "selected",
				title: 
				{	
					content: "Sign up"
				},
				inputFields:
				[
					{
						type: "text",
						placeholder: "E-mail"
					},
					{
						type: "password",
						placeholder: "Password"
					},
					{
						type: "password",
						placeholder: "Retype password"
					},
					{
						type: "text",
						placeholder: "First name"
					},
					{
						type: "text",
						placeholder: "Last name"
					},
					{
						type: "date",
						placeholder: "Date of birth"
					},
					{
						type: "select",
						options: ["male", "female", "other"]
					}
				],
				button: 
				{	
					content: "Get started"
				}
			});


		}

	}

	switchToLogin()
	{
		if (this.state.signUpSwitch == "selected" && this.state.loginSwitch == "")
		{
			this.setState(
			{
				loginSwitch: "selected",
				signUpSwitch: "",
				title: 
				{	
					content: "Welcome back"
				},
				inputFields:
				[
					{
						placeholder: "E-mail",
						type: "text"
					},
					{
						placeholder: "Get started",
						type: "text"
					}
				],
				button: 
				{	
					content: "Login",
				}
			});


		}
	}

	fadeIn(el)
	{
		el.style.opacity = 0;

		var last = +new Date();
		var tick = function()
		{
			el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
			last = +new Date();

			if (+el.style.opacity < 1)
			{
				(window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
			}
		};

		tick();
	}

	listenForKeyPress()
	{
		var html = document.querySelector("html");
		var toti = this;
		html.onkeydown=function(event)
		{
			if (event.keyCode == 13)
			{
				document.querySelector(".submitButton").click();
				toti.setState(
				{
					button: 
					{	
						content: toti.state.button.content,
						pressed: "pressed"
					}
				});
			}
		}
		html.onkeyup=function(event)
		{
			toti.setState(
			{
				button: 
				{
					content: toti.state.button.content,
					pressed: ""
				}
			});
		}

	}

	login()
	{
		var toti = this;
		var ajax = new Ajax();

		var inputFields = document.querySelector(".form .inputFields");
		var eMail = inputFields.children[0].children[0].value;
		var passwd = inputFields.children[1].children[0].value;

		if (eMail != "" && passwd != "")
		{
			if (this.mailRegex.test(eMail))
			{
				var key = (Math.random() + 1).toString(36).substring(1,6);
				var json = JSON.stringify
				(
					{
						eMail: eMail,
						passwd: passwd
					}
				);

				var cipher = crypto.createCipher('aes-256-ctr',key)
				var crypted = cipher.update(json,'utf8','hex')
				crypted += cipher.final('hex');

				var data = "key=" + encodeURIComponent(this.props.keyPair.encrypt(key, 'base64')) + "&json=" + encodeURIComponent(crypted);

				ajax.POST("/authenticate", data, function(response)
				{
					if (response == "false")
					{
						var infoBanner = document.querySelector(".info");
						infoBanner.innerHTML = "Email or password do no match";
						toti.fadeIn(infoBanner);
					}
					else
					{
						var decipher = crypto.createDecipher('aes-256-ctr', key);
						var dec = decipher.update(response,'hex','utf8');
  						dec += decipher.final('utf8');
  						
  						Cookie.set('eMail', eMail);
						Cookie.set('loginHash', dec);

						document.location = "/#/";

					}
				});
			}
			else
			{
				var infoBanner = document.querySelector(".info");
				infoBanner.innerHTML = "Email is not valid";
				this.fadeIn(infoBanner);
			}
		}
		else
		{
			var infoBanner = document.querySelector(".info");
			infoBanner.innerHTML = "Some fields are ampty";
			this.fadeIn(infoBanner);
		}
	}

	signUp()
	{
		var ajax = new Ajax();

		var inputFields = document.querySelector(".form .inputFields");

		var eMail = inputFields.children[0].children[0].value;
		var passwd = inputFields.children[1].children[0].value;
		var passwd1 = inputFields.children[2].children[0].value;
		var firstName = inputFields.children[3].children[0].value;
		var lastName = inputFields.children[4].children[0].value;
		var dateOfBirth = inputFields.children[5].children[0].value;
		var sex = inputFields.children[6].children[0].value;

		if (eMail != "" && passwd != "" && firstName != "" && lastName != "" && dateOfBirth != "" && sex != "")
		{
			if (this.mailRegex.test(eMail))
			{
				if (passwd == passwd1)
				{
					if (passwd.length >= 12)
					{

						var toti = this;

						ajax.GET('/userMailExists/' + eMail, function(response)
						{
							if (response == "false")
							{
								var key = (Math.random() + 1).toString(36).substring(1,6);
								var json = JSON.stringify
								(
									{
										eMail: eMail,
										passwd: passwd,
										firstName: firstName,
										lastName: lastName,
										dateOfBirth: dateOfBirth,
										sex: sex 
									}
								);

								var cipher = crypto.createCipher('aes-256-ctr',key)
  								var crypted = cipher.update(json,'utf8','hex')
								crypted += cipher.final('hex');

								var data = "key=" + encodeURIComponent(toti.props.keyPair.encrypt(key, 'base64')) + "&json=" + encodeURIComponent(crypted);

								ajax.POST("/users", data);
							}
							else
							{
								var infoBanner = document.querySelector(".info");
								infoBanner.innerHTML = "Email already in use";
								toti.fadeIn(infoBanner);
							}
						});

					}
					else
					{
						var infoBanner = document.querySelector(".info");
						infoBanner.innerHTML = "Password needs to be at least 12 characters long";
						this.fadeIn(infoBanner);
					}
				}
				else
				{
					var infoBanner = document.querySelector(".info");
					infoBanner.innerHTML = "Passwords do not match";
					this.fadeIn(infoBanner);
				}
				
			}
			else
			{
				var infoBanner = document.querySelector(".info");
				infoBanner.innerHTML = "Email is not valid";
				this.fadeIn(infoBanner);
			}
			
		}
		else
		{
			var infoBanner = document.querySelector(".info");
			infoBanner.innerHTML = "Some fields are ampty";
			this.fadeIn(infoBanner);
		}
	}
	render()
	{

		var inputFields = [];

		for (var i = 0; i < this.state.inputFields.length; i++)
		{
			if (this.state.inputFields[i].type == "select")
			{
				var options = [];
				for (var j = 0; j < this.state.inputFields[i].options.length; j++)
				{
					options.push(<option key={"option" + j} value={this.state.inputFields[i].options[j]}>{this.state.inputFields[i].options[j]}</option>);
				}

				inputFields.push(<div className="inputField" key={"inputField" + i}>
						<select>
							{options}
						</select>
					</div>);
			}
			else
			{
				inputFields.push(<div className="inputField" key={"inputField" + i}>
						<input type={this.state.inputFields[i].type} placeholder={this.state.inputFields[i].placeholder}/>
					</div>);
			}
		}

		var button = null;

		if (this.state.signUpSwitch == "selected" && this.state.loginSwitch == "")
		{
			button = <button class={"submitButton " + this.state.button.pressed} onClick={this.signUp.bind(this)}>
					{this.state.button.content}
				</button>;
		}
		else if (this.state.signUpSwitch == "" && this.state.loginSwitch == "selected")
		{
			button = <button class={"submitButton " + this.state.button.pressed} onClick={this.login.bind(this)}>
					{this.state.button.content}
				</button>;
		}

		return (
			<div>
				<div class="form">

					<div class="switch">
						<ul><li class={"login " + this.state.loginSwitch} onClick={this.switchToLogin.bind(this)}>Log in</li><li onClick={this.switchToSignUp.bind(this)} class={"register " + this.state.signUpSwitch}>Sign up</li></ul>	
					</div>
					
					<div class="title">
						{this.state.title.content}
					</div>

					<div class="inputFields">
						{inputFields}
					</div>

					{button}

				</div>

				<div class="info">
				</div>
			</div>
		);
	}
}