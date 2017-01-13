var SIRINA = 14;

function Polje(nRow, nCol, deska)
{
	this.row = nRow;
	this.col = nCol;
	this.znak = deska.val[nRow*SIRINA + nCol];

};

function Figura(nRow,nCol,deska)
{
	Polje.call(this,nRow,nCol,deska);
	this.castle;
	if(this.znak == "A" || this.znak == "a")
	{
		this.castle = "+";
	}
	else
	{
		this.castle = "-";
	}
}

function Premik(vF,vP)
{
	this.figura = vF; 
	this.skokNa = vP; 
}



function getJumpType(figura, preskocen)
{
	if(figura.castle=="+")
	{
		if(preskocen=="B" || preskocen=="b")
		{
			return "LEAP";
		}
		else if(preskocen=="A" || preskocen=="a")
		{
			return "CANTER";            
		}
	}
	else if (figura.castle=="-")
	{
		if(preskocen=="B" || preskocen=="b")
		{
			return "CANTER";
		}
		else if(preskocen=="A" || preskocen=="a")
		{
			return "LEAP";
		}
	}
	return null;
}

function izvediPremik(figura,target,deska,dolzina,type)
{
	if(dolzina==2) 
	{
		if(type=="LEAP")
		{
			var preskocenLocation = (figura.row + parseInt((target.row-figura.row)/2 , 10))*SIRINA + figura.col+parseInt((target.col-figura.col)/2 , 10);
			deska.val = deska.val.substr(0, preskocenLocation) + "O" + deska.val.substr(preskocenLocation+1);
		}
	}
	
	deska.val = deska.val.substr(0, target.row*SIRINA + target.col) + figura.znak + deska.val.substr(target.row*SIRINA + target.col + 1);
	if(figura.row == 1)
	{
		deska.val = deska.val.substr(0, figura.row*SIRINA + figura.col) + "+" + deska.val.substr(figura.row*SIRINA + figura.col + 1);
		
	}
	else if(figura.row == 16)
	{
		deska.val = deska.val.substr(0, figura.row*SIRINA + figura.col) + "-" + deska.val.substr(figura.row*SIRINA + figura.col + 1);
		
	}
	else
	{
		deska.val = deska.val.substr(0, figura.row*SIRINA + figura.col) + "O" + deska.val.substr(figura.row*SIRINA + figura.col + 1);
		
	}
}

function dobiNapadanje(figura, deska) 
{
	var napada = new Array();
	for (var i = -1; i <= 1; ++i)
		for (var j = -1; j <= 1; ++j)
			if(i!=0 || j != 0)    
			{
				var sosed = deska.val[(figura.row+i)*SIRINA + figura.col+j];
				
				if((sosed == "A" || sosed == "a") && figura.castle=="-")
				{   
					var zaNasprotnikom = deska.val[(figura.row+i*2)*SIRINA + figura.col+j*2];
					if(zaNasprotnikom == "O" || zaNasprotnikom == "+" || zaNasprotnikom == "-")
					{
						napada.push(new Premik(figura,new Polje(figura.row+i*2, figura.col+j*2,deska)));
					}
					// console.log("A");
				}
				else if((sosed == "B" || sosed == "b") && figura.castle=="+")
				{
					var zaNasprotnikom = deska.val[(figura.row+i*2)*SIRINA + figura.col+j*2];    
					if(zaNasprotnikom == "O" || zaNasprotnikom == "+" || zaNasprotnikom == "-")
					{
						napada.push(new Premik(figura,new Polje(figura.row+i*2, figura.col+j*2,deska)));
					}
					// console.log("B");
				}
			}
	// console.log(napada);
	return napada;

}

module.exports = 
{
	mozniPremikiAI: function(deska, lokacijaFigure, player, prevFigura, prevMove, castleMoveCount)
	{

			var pozicija = lokacijaFigure.split(",");
			pozicija[0] = parseInt(pozicija[0]);
			pozicija[1] = parseInt(pozicija[1]);

			if(pozicija[0] <= 16 && pozicija[1] <= 12)
			{
				var znak = deska.val[pozicija[0] * SIRINA + pozicija[1]];
				
			
				if(znak == "A" || znak == "a" || znak == "B" || znak == "b")
				{
					if(prevFigura.val != lokacijaFigure && prevFigura.val != null)
					{
						var prevPozicija = prevFigura.val.split(",");
						return null;
					}
					

					var figura = new Figura(pozicija[0], pozicija[1], deska);
					
					if(figura.castle == player)  
					{
						var mojeFig = null;
						var castleRow = null;
						var napadamo = [];

						if(prevMove.val == "MOVE")
						{
							return null;
						}

						if(player == "+")
						{
							mojeFig = ["a", "A"];
							castleRow = 1;
						}
						else
						{
							mojeFig = ["b", "B"];
							castleRow = 16;
						}
						castleFig = null;

						if(mojeFig.indexOf(deska.val[SIRINA*castleRow + 6]) > -1)
						{
							castleFig = new Figura(castleRow, 6, deska);
						}
						else if(mojeFig.indexOf(deska.val[SIRINA*castleRow + 7]) > -1)
						{
							castleFig = new Figura(castleRow, 7, deska);
						}

						mozniPremiki = [];
						if(castleFig != null && castleFig != figura)
						{
							return null;
						}
						else if(castleFig != null && castleFig == figura)
						{
							var napadCastle = dobiNapadanje(figura, deska);

							if(napadCastle.length > 0 && (prevMove.val == "LEAP" || prevMove.val == null))
							{
								for (var a = 0; a < napadCastle.length; ++a)
								{
									mozniPremiki.push(napadCastle[a].skokNa);
								}
								return mozniPremiki;
							}
						}

						if(castleFig != null)
						{
							if(prevMove.val != null)
							{
								return null;
							}
							var rowMod = null;
							if(player == "+")
							{
								rowMod = 1;
							}
							else if(player == "-")
							{
								rowMod = -1;
							}
							
							for (var j = -1;j <= 1; ++j)
							{
								var znakCheck = deska.val[(figura.row + rowMod) * SIRINA + figura.col + j];
								if(znakCheck == "O")
								{
									mozniPremiki.push(new Polje(figura.row + rowMod, figura.col + j, deska));
								}
								else if(mojeFig.indexOf(znakCheck) > -1)
								{
									mozniPremiki.push(new Polje(figura.row + rowMod * 2, figura.col + j * 2, deska));
								}
							}
							return mozniPremiki;
						}

						for (var i = 20; i < deska.val.length - 20; ++i)
						{
							// console.log("NEkaj");
							if(mojeFig.indexOf(deska.val[i]) > -1)
							{
								napadamo = napadamo.concat(dobiNapadanje(new Figura(parseInt(i / 14, 10), i % 14, deska), deska));
							}
						}
								

						for (var i = 0; i < napadamo.length; i++) 
						{
							var napad = napadamo[i];

							if(JSON.stringify(napad.figura) == JSON.stringify(figura))
							{
								mozniPremiki.push(napad.skokNa);
							}
						}

						// console.log(mozniPremiki);
						
						
						if(mozniPremiki.length > 0 && (prevMove.val == "LEAP" || prevMove.val == null || prevMove.val == "CANTER"))
						{
							if(figura.znak.charCodeAt(0) >= 67 && prevMove.val == "CANTER")
							{
								return null;
							}
							return mozniPremiki;
						}
						else if(mozniPremiki.length == 0 && napadamo.length > 0)
						{
							return null;
						}
						else
						{
							if( prevMove.val != "LEAP");
							{
								if(prevMove.val == null && (figura.row == 1 || figura.row == 16))
								{

									if(castleMoveCount.val > 1)
									{
										return null;
									}

									poljeIndex = figura.row * SIRINA + figura.col;

									if(deska.val[poljeIndex + 1] == "+" || deska.val[poljeIndex + 1] == "-")
									{
										return new Polje(figura.row ,figura.col + 1, deska);
									}
									else if(deska.val[poljeIndex - 1] == "+" || deska.val[poljeIndex - 1] == "-")
									{
										return new Polje(figura.row, figura.col-1, deska);
									}
								}
								var zaFiguro = null;
								var sosed = null;
								var enemyCastle = null;
								if(player == "+")
								{
									enemyCastle = "-";
								}
								else
								{
									enemyCastle = "+";
								}

								for (var i = -1; i <= 1; ++i)
								{
									for (var j = -1; j <= 1; ++j)
									{
										if(i != 0 || j != 0)
										{
											sosed = deska.val[(figura.row + i) * SIRINA + figura.col + j];
											if((sosed == "O" || sosed == enemyCastle) && prevMove.val == null)
											{
												mozniPremiki.push(new Polje(figura.row + i, figura.col + j, deska));
											}
											else
											{
												zaFiguro = deska.val[(figura.row + i*2) * SIRINA + figura.col + j*2];
												if(mojeFig.indexOf(sosed) > -1 && (zaFiguro == "O" || zaFiguro == enemyCastle))
												{
													mozniPremiki.push(new Polje(figura.row + i * 2, figura.col + j * 2, deska));
												}
											}
										}
									}
								}
								return mozniPremiki;
							}
						}
						return null;
					}

					// console.log("<MHM></MHM>");
				}
				return null;
			}
	},

	validiraj: function(premik, deska, prevMove,prevFig,player,details,castleMoves) 
	{
		var pozicija = premik.split('>'); 
		var zacetnaPozicija =  pozicija[0].split(',');
		var koncnaPozicija = pozicija[1].split(','); 

		
		if(pozicija[0] != prevFig.val && prevFig.val != null)
		{
			details.val = "Premikas razlicne figure";
			return false;
		}
		
		if(parseInt(zacetnaPozicija[0],10)>16 || parseInt(zacetnaPozicija[1],10)>12 || parseInt(koncnaPozicija[0],10)>16 || parseInt(koncnaPozicija[1],10)>12)
		{
			details.val = "Prevelike vrednosti za row ali col.";
			return false;
		}
		
		var zacetniZnak = deska.val[parseInt(zacetnaPozicija[0],10)*SIRINA + parseInt(zacetnaPozicija[1],10)];
		if(zacetniZnak =="O" || zacetniZnak == "X" || zacetniZnak == "+" || zacetniZnak =="-")
		{
			
			details.val = "Zacetni znak ni figura";
			return false;
		}
		
		var figura = new Figura(parseInt(zacetnaPozicija[0],10),parseInt(zacetnaPozicija[1],10),deska);
		var poljeNew = new Polje(parseInt(koncnaPozicija[0],10),parseInt(koncnaPozicija[1],10),deska);
		
		if(figura.castle != player)
		{
			details.val = "Premikas nasprotnikovo figuro.";
			return false;
		}
		var mojeFig = null;
		var castleRow = null;
		var enemyCastleRow = null;
		var dummy = new Premik(figura, poljeNew); 
		var napadamo = new Array();
		if(player=="+")
			{
				mojeFig = ["a","A"];
				castleRow = 1;
				enemyCastleRow = 16;
			}
		else
			{
				mojeFig = ["b", "B"];
				castleRow = 16;
				enemyCastleRow = 1;
			}
		
		if(mojeFig.indexOf(deska.val[SIRINA*castleRow+6]) > -1 || mojeFig.indexOf(deska.val[SIRINA*castleRow+7]) > -1)
		{
			var napadCastle = dobiNapadanje(figura,deska);
			if(figura.row != castleRow ||  figura.row==castleRow && poljeNew.row==castleRow)
			{
				details.val = "Premakni figuro iz svojega castla";
				return false;
			}
			else if(napadCastle.length > 0) 
			{
				if(napadCastle.indexOf(dummy) == -1) 
				{
					details.val = "Nekoga napadas in ga mores pobrat";
					return false;
				}
			}
		} 
		else
		{
			
			for (var i=20; i < deska.val.length-20; ++i) 
			{
				if(mojeFig.indexOf(deska.val[i]) > -1 && i < SIRINA*enemyCastleRow && i > SIRINA*(enemyCastleRow+1))  
				{                                                                                                   
					napadamo = napadamo.concat(dobiNapadanje(new Figura(parseInt(i/14 ,10), i%14, deska),deska));

				}
			}
			if(napadamo.length > 0)
			{
				
				
				var match = false;
				for(var j=0; j < napadamo.length; ++j)
				{
					if(JSON.stringify(napadamo[j]) === JSON.stringify(dummy))
					{
						match=true;
						break;
					} 
				}
				if(match == false)
				{
					details.val="Nekoga napadam in ga morem pobrat";
					return false;
				}
			}
		}
		
		if(poljeNew.znak!="O" && poljeNew.znak!="+" && poljeNew.znak!="-")
		{
			details.val = "Out of bounds / skok na drugo figuro";
			return false; 
		}
		
		if(figura.row == enemyCastleRow)
		{
			if(poljeNew.row == enemyCastleRow)
			{
				if(castleMoves.val>1) 
				{
					details.val = "Porabli ste vse castle move.";
					return false;
				}
				++castleMoves.val;
				
			}
			else
			{
				details.val = "Iz enemy castle ne mores ven";
				return false;
			}
		}
		
		var verPremik=poljeNew.row - figura.row;
		var horPremik=poljeNew.col - figura.col;
		var dolzina = Math.max(Math.abs(horPremik),Math.abs(verPremik));
		if(dolzina == 1) 
		{
			if(prevMove.val != null)
			{
				details.val = "MOVE za LEAP / CANTER / MOVE";
				return false;
			}
			else if(poljeNew.znak==figura.castle)
			{
				details.val = "MOVE v svoj castle";
				return false; 
			}
			details.val = "PRAVILNO: MOVE v enemy castle ali 'O'";
			izvediPremik(figura,poljeNew,deska,dolzina,"MOVE"); 
			prevMove.val = "MOVE";
			prevFig.val = pozicija[1];
			return true; 
		}
		else if(dolzina == 2)
		{
			var valid = Math.abs(Math.abs(horPremik) - Math.abs(verPremik)); 
			if(valid==0 || valid==2 && prevMove.val!="MOVE") 
			{
				
				var preskocen = deska.val[(figura.row + parseInt(verPremik/2 ,10))* SIRINA + figura.col+parseInt(horPremik/2 ,10)];
				if(preskocen == "O")
				{
					details.val = "Preskok praznega mesta";
					return false;
				}
				var jumpType = getJumpType(figura,preskocen);
				

				if(jumpType!="LEAP" && poljeNew.znak==figura.castle)
				{
					details.val = "Ne smes v svoj castle razn tak da nekoga poberes.";
					return false;
				}

				else if(prevMove.val == null)
				{
					details.val = "PRAVILNO: \"\" v CANTER ali LEAP";
					izvediPremik(figura,poljeNew,deska,dolzina,jumpType);
					prevMove.val = jumpType;
					prevFig.val = pozicija[1];
					return true;
				}
				else if(prevMove.val == jumpType)
				{ 
					details.val = "PRAVILNO: Nadaljuje s tam kaj dela";
					izvediPremik(figura,poljeNew,deska,dolzina,jumpType);
					prevFig.val = pozicija[1];
					return true;
				}
				else if((prevMove.val == "CANTER"|| prevMove.val == "KCHARGE") && jumpType == "LEAP" && figura.znak.charCodeAt(0)<67) 
				{ 
					izvediPremik(figura,poljeNew,deska,dolzina,jumpType);
					details.val = "PRAVILNO: Knight's Charge";
					prevMove.val = "KCHARGE";
					prevFig.val = pozicija[1];
					return true;
				}
			}
		}
		details.val = "MOVE cudnih dolzin / CANTER za LEAPOM / MOVE za LEAP ali CANTER";
		return false;
		
	}
}