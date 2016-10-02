import Cookie from 'js-cookie';

export default class Auth
{

	constructor(logedInStartingPage, logedOutStartingPage)
	{
		this.logedInStartingPage = logedInStartingPage;
		this.logedOutStartingPage = logedOutStartingPage;
	}

	login()
	{
		Cookie.set('eMail', "dwdw");
		Cookie.set('passHash', "wwwe");

		window.location = this.logedInStartingPage;
	}

	logout()
	{
		Cookie.remove('eMail');
		Cookie.remove('passHash');

		window.location = this.logedOutStartingPage;
	}

	requireAuth()
	{
		console.log("www");
		if ((Cookie.get('passHash') == "" || Cookie.get('passHash') == undefined) && (Cookie.get('eMail') == "" || Cookie.get('eMail') == undefined))
		{
			window.location = this.logedOutStartingPage;
		}
	}

	requireNotAuth()
	{
		if ((Cookie.get('passHash') != undefined && Cookie.get('passHash') != "") && (Cookie.get('eMail') != undefined && Cookie.get('eMail') != ""))
		{
			window.location = this.logedInStartingPage;
		}
	}


}