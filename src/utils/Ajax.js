export default class Ajax
{

	POST(url, data, callback)
	{

		var xhttp = new XMLHttpRequest();
		if (callback != undefined)
		{
			xhttp.onreadystatechange = function()
			{
				if (this.readyState == 4 && this.status == 200)
				{
					callback(this.responseText);
				}
			};
		}

		xhttp.open("POST", url);

		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(data);
	}

	GET(url, callback)
	{
		var xhttp = new XMLHttpRequest();
		if (callback != undefined)
		{
			xhttp.onreadystatechange = function()
			{
				if (this.readyState == 4 && this.status == 200)
				{
					callback(this.responseText);
				}
			};
		}

		xhttp.open('GET', url, true);
		xhttp.send();
	}
}