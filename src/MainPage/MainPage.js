import React from "react";
import NavBar from "./NavBar/NavBar.js";
import BoxList from "./BoxList/BoxList.js";
import Content from "./Content/Content.js";
import Cookie from 'js-cookie';

require("./MainPage.scss");
var socket = require('socket.io-client')('http://139.59.146.155:4000', {query: "ime=" + Cookie.get('eMail')});

export default class MainPage extends React.Component
{

	constructor()
	{
		super();
	}

	componentDidMount()
	{
		// var io = require('socket.io')('http://localhost:4000');
		// socket.on('tweet', function(data)
		// {
		// 	console.log(data);
		// });

		this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

		var toti = this;

		var xhr = new XMLHttpRequest();
		xhr.open("GET", "./sounds/PianoL.mdct", true); // binarno slika locljivost 512*512, velikost dat. je 512*512/8 (1 bit = 1 piksel!)
		xhr.responseType = "arraybuffer";

		xhr.onload = function(e) {
			var final = toti.recieveSoundCMP(xhr.response);

				var source = toti.audioCtx.createBufferSource();
				source.buffer = final;
				source.connect(toti.audioCtx.destination);
				source.start();
		}

		xhr.send();
	}


	ustvariOkenskoFunkcijoDecomp(undoneMDCT, N)//DANGER on rounda na 4 decimalna mesta
	{
		var w = this.create2Darray(undoneMDCT.length, 2 * N)   //double[,]
		for (var j = 0; j < 2 * N; ++j)
		{
			w[0][j] = Math.sin((Math.PI / (2 * N)) * (j + 0.5));
		}
		for (var i = 1; i < undoneMDCT.length; ++i)
		{
			for (var j = 0; j < 2 * N; ++j)
			{
				w[i][j] = w[i - 1][j];
			}
		}
		return w;
	}
	create2Darray(a, b)
	{
		// console.log(a);
		var array2D = new Array(a);
		for (var i = 0; i < a; ++i) 
		{
			array2D[i] = new Array(b);
		}
		return array2D;
	}
	IMDCT(koeficienti, N, M)
	{//double[,]
		var undoneMDCT = this.create2Darray(Math.floor(koeficienti.length / (N - M)), 2 * N);
		var undoneMDCTlen = undoneMDCT.length-1;
		for(var dodano = 0; dodano < undoneMDCT[undoneMDCTlen].length; ++dodano)
		{
			undoneMDCT[undoneMDCTlen][dodano] = 0;
			undoneMDCT[undoneMDCTlen-1][dodano] = 0;
		}
		var koef = new Array();
		for (var i = 0; i < koeficienti.length; ++i)
		{
			koef.push(koeficienti[i]);
			if (i % (N - M) == 0 && i != 0)
			{
				for (var d = 0; d < M; ++d)
				{
					koef.push(0);
				}
			}
		}

		var piDividedByN = Math.PI / N;			
		var preCalculatedCos = this.create2Darray(2 * N, N); 	//double[,] 
		for (var n = 0; n < N * 2; ++n) //polovične bloke dobimo na koncu ven
		{
			for (var k = 0; k < N; ++k) //suma n od vseh
			{
				preCalculatedCos[n][k] = Math.cos(piDividedByN * (n + 0.5 + (N / 2.0)) * (k + 0.5));
			}
		}

		for (var i = 0; i < Math.floor(koef.length / N); ++i) // gremo skozi vse stolpce
		{
			var sum = 0;
			for (var n = 0; n < 2 * N; ++n) //dvakratne bloke dobimo na koncu ven
			{
				sum = 0;
				for (var k = 0; k < N; ++k) //suma n od vseh
				{
					sum = sum+ koef[k + i * N] * preCalculatedCos[n][k];

				}
				undoneMDCT[i][n] = (2.0 / N) * sum;
			}
		}
		return undoneMDCT;
	}
	poglejNtiBit(bajta, index) // zero based
	{
		return (bajta & (1 << index)) != 0;
	}
	preberiNaslednjegaStisnjenega(kazalo, prebrano)
	{
		if (kazalo.beremIndex < 0)
		{
			kazalo.beremIndex = 14;
			++kazalo.prebranoIndex;
		}
		else
		{
			--kazalo.beremIndex;
		}
		return this.poglejNtiBit(prebrano[kazalo.prebranoIndex], kazalo.beremIndex + 1);
	}
	dekompresiraj(prebrano, stVzorcev, N, M)
	{
		var konec = new Array();
		var kazalo = {
		    beremIndex: 15,
		    prebranoIndex: 0,
		};
		//izracunamo stKompresiranihVzorcev
		var stKompresiranihStolpcev = 1 + Math.ceil(stVzorcev / N);
		for (var i = 0; i < stKompresiranihStolpcev * (N - M); ++i)
		{
			//preberemo 6 bitov dolzine
			var dolzina = 0;
			for (var j = 0; j < 6; ++j)
			{
				dolzina = dolzina << 1;
				dolzina |= this.preberiNaslednjegaStisnjenega(kazalo, prebrano);
			}
			//preberemo dolzina bitov za koeficient
	        //preberemo prvi bit da vidimo ce je koeficient negativen
	        var negCheck = this.preberiNaslednjegaStisnjenega(kazalo, prebrano);
	        var koeficient = 0;
	        if (negCheck == true)
	        {
	            //twos complement je paddan z 1kami
	            for (var j = 0; j < 32 - dolzina; ++j)
	            {
	                koeficient <<= 1;
	                koeficient |= 1;
	            }
	        }
			koeficient <<= 1;
			koeficient |= negCheck;
			for (var j = 0; j < dolzina - 1; ++j)
			{
			    koeficient <<= 1;
			    koeficient |= this.preberiNaslednjegaStisnjenega(kazalo, prebrano);
			}
			konec.push(koeficient);
		}
		//sedaj še naredimo inverzni MDCT in dobim 2D array
		var undoneMDCT = this.IMDCT(konec, N, M);

		//okenska funkcija
		var w = this.ustvariOkenskoFunkcijoDecomp(undoneMDCT, N); //double[,]

		//uporabimo okensko f
		for (var i = 0; i < w.length; ++i)
		{
			for (var j = 0; j < 2 * N; ++j)
			{
				w[i][j] *= undoneMDCT[i][j];
			}
		}

		//zaj pa še seštejemo na funky nacin
		var decompCount = stVzorcev;
		//var resitev = new Array(decompCount); //DANGER
		var resitev = new Int16Array(decompCount);

		var prviPos = N;
		var drugiPos = 0;
		var currentStolpec = 0;
		var x = 0;
		for (var i = 0; i < decompCount; ++i) // tu notri neki je verjeto ERROR?
		{

			x = w[currentStolpec + 1][drugiPos];

			resitev[i] = Math.round(w[currentStolpec][prviPos] + x);

			++prviPos;
			++drugiPos;
			if (prviPos == 2 * N)
			{
				prviPos = N;
				drugiPos = 0;
				++currentStolpec;
			}
		}
		return resitev;
	}

	recieveSoundCMP(recievedFile) 
	{
		
		var recArray = new Uint16Array(recievedFile); // binarno polje slike

		var reader = {
		    currentIndex: 0,
		    fileSize_shorts: 0,
		    readFile: recArray,
		    readInt32: function()
		    {
				var retVal = this.readFile[this.currentIndex];
				++this.currentIndex;
				retVal |= this.readFile[this.currentIndex] << 16;
				++this.currentIndex;
				return retVal;
			},
			readInt16: function()
		    {
				var retVal = this.readFile[this.currentIndex];
				++this.currentIndex;
				return retVal;
			}
		};

	
		reader.fileSize_shorts = recArray.length;

		var stVzorcev=reader.readInt32();
		//console.log(stVzorcev);
	    var N = reader.readInt16();
	    //console.log(N);
		var frekvencaVzorcenja=reader.readInt32();
		//console.log(frekvencaVzorcenja);
	    var M = reader.readInt16();
	    //console.log(M);
	    var sampleRate = reader.readInt32();
	    //console.log(sampleRate);

	    var prebrano = new Array(reader.fileSize_shorts);
	    //console.log((prebrano.length)-8);
	    //console.log("~~~~ DECOMPRESS BEGIN ~~~~");
		
		//Preberemo preostanek
		for (var i = 0; i < prebrano.length; ++i) //vedno je sodo število bitov ker short
		{
		    prebrano[i] = reader.readInt16(); //preberemo obdelano datoteko
		}

		var dekompresirano = this.dekompresiraj(prebrano, stVzorcev, N, M);
		//console.log(dekompresirano);

		//sedaj najprej preberemo posamezna kanala v 2 arraya
		var subArraySize = dekompresirano.length/2;
		var RaBig = new Array(subArraySize);
		var RbBig = new Array(subArraySize);

		for(var i = 0; i < subArraySize; ++i)
		{
			RaBig[i] = dekompresirano[i];
		}
		for (var i = 0; i < subArraySize; ++i)
		{
			RbBig[i] = dekompresirano[i+subArraySize];
		}

		//rekunstruiramo   RRB=RA-RB  =>    RB = -RRB + RA
		for (var i = 0; i < subArraySize; ++i)
		{
			RbBig[i] =  RaBig[i] - RbBig[i];
		}
		//console.log(RbBig);

		//rekunstruiramo A B :  Ra = A2 - A1 => A1 =  A2 - Ra
		for (var i = 0; i < subArraySize-1; ++i)
		{
			RaBig[subArraySize-2-i] = RaBig[subArraySize-1-i] - RaBig[subArraySize-2-i];    
		}
		for (var i = 0; i < subArraySize - 1; ++i)
		{
			RbBig[subArraySize - 2 - i] = RbBig[subArraySize - 1 - i] - RbBig[subArraySize - 2 - i];
		}

		var Raf =  new Float32Array(RaBig.length);
		var Rbf =  new Float32Array(RbBig.length);

		for (var i = 0; i < Raf.length; i++)
		{
			var f = RaBig[i] / 32768;
			Raf[i] = f;

			f = RbBig[i] / 32768;
			Rbf[i] = f;
		}          

		// var audioCtx = this.audioCtx;

		var myArrayBuffer = this.audioCtx.createBuffer(2, stVzorcev, sampleRate);
		myArrayBuffer.copyToChannel(Raf, 0, 0);
		myArrayBuffer.copyToChannel(Rbf, 1, 0);
		return myArrayBuffer;

	}


	render()
	{

		return (
			<div className='MainPage'>
				<Content socket = {socket}/>
				<NavBar/>
				<BoxList/>
			</div>
		);
	}
}