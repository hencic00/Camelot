import Cookie from 'js-cookie';

export default class AuthService
{

	login()
	{
		Cookie.set('eMail', "dwdw");
		Cookie.set('passHash', "wwwe");
	}

	logout()
	{
		Cookie.remove('eMail');
		Cookie.remove('passHash');
	}

	requireAuth()
	{
		if ((Cookie.get('passHash') == "" || Cookie.get('passHash') == undefined) && (Cookie.get('eMail') == "" || Cookie.get('eMail') == undefined))
		{
			window.location = "/#/login";
		}
	}

	requireNotAuth()
	{
		if ((Cookie.get('passHash') != undefined && Cookie.get('passHash') != "") && (Cookie.get('eMail') != undefined && Cookie.get('eMail') != ""))
		{
			window.location = "/#/";
		}
	}


}