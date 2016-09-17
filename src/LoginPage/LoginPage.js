import React from "react";

require("./loginForm.scss");

export default class LoginPage extends React.Component
{

	constructor(props)
	{
		super(props);
		this.switch = "login";
	}

	signUp()
	{
		if (this.switch == "login")
		{
			this.switch = "signUp";

			document.querySelector(".inputFields").innerHTML = '<div class="inputField"><input type="text" placeholder="E-mail"></div><div class="inputField"><input type="text" placeholder="Password"></div><div class="inputField"><input type="text" placeholder="Retype password"></div><div class="inputField"><input type="text" placeholder="First name"></div><div class="inputField"><input type="text" placeholder="Last name"></div><div class="inputField"><input type="date" placeholder="Date of birth"></div><div class="inputField"><select> <option value="volvo">Volvo</option> <option value="saab">Saab</option> <option value="mercedes">Mercedes</option> <option value="audi">Audi</option> </select></div>';

			document.querySelector(".form .signUp").classList.add("selected");
			document.querySelector(".form .login").classList.remove("selected");
			document.querySelector(".form > .submitButton").innerHTML = '<a href="#/">Get started</a>';
			document.querySelector(".form .title").innerHTML = "Sign up for free";


		}

	}

	login()
	{
		if (this.switch == "signUp")
		{
			this.switch = "login";

			document.querySelector(".inputFields").innerHTML = '<div class="inputField"><input type="text" placeholder="E-mail"></div><div class="inputField"><input type="text" placeholder="Password"></div';

			document.querySelector(".form .login").classList.add("selected");
			document.querySelector(".form .signUp").classList.remove("selected");
			document.querySelector(".form > .submitButton").innerHTML = '<a href="#/">Log in</a>';
			document.querySelector(".form .title").innerHTML = "Welcome back";

		}
	}

	render()
	{

		return (
			<div class="form">

				<div class="switch">
					<ul><li class="login selected" onClick={this.login.bind(this)}>Log in</li><li onClick={this.signUp.bind(this)} class="signUp">Sign up</li></ul>	
				</div>
				
				<div class="title">
					Welcome back
				</div>

				<div class="inputFields">
					<div class="inputField">
						<input type="text" placeholder="E-mail"/>
					</div>
					
					<div class="inputField">
						<input type="text" placeholder="Get started"/>
					</div>
				</div>

				<button class="submitButton">
					<a href="#/">Log in</a>
				</button>

			</div>
		);
	}
}