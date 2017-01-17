import React from "react";
import ReactDOM from "react-dom";
import Cookie from 'js-cookie';


var THREE = require("three");
var OrbitControls = require('three-orbit-controls')(THREE);

require("./GameWindow.scss");
import Loader from "./Loader/Loader.js";

import Ajax from '../../../utils/Ajax';

export default class GameWindow extends React.Component
{

	constructor()
	{
		super();

		this.state = 
		{
			//future html info
		};

		this.mouse1 = 
		{
			X: 0,
			Y: 0,
			prevX: 0,
			prevY: 0,
			leftDown: false,
		};
		this.gameInfo = 
		{
			needsUpdate: true,
			pieceSelected: false,
			piece: null,
			pieceOriginalColor: null,
			canSelect: true,
			zMin: -8,
			xMin: -5,
			travelToX: 0,
			travelToY: 0,
			pieceUUID: "",
			player: ""

		}

		this.renderer = null;
		this.rayCaster = null;
		this.scene = null;
		this.camera = null;
		this.mouse = new THREE.Vector2();

		this.pieceHovered = false;

		this.loadedStuff = 0;

		this.prevMove = {val: null}; 
		this.prevFig = {val: null};
		this.details = {val: ""};
		this.castleMoves = {val: 0};
		this.kje = {val: null};

		// this.prevMove = {val: 'MOVE'}; 
		// this.prevFig = {val: '5,7'};
		// this.details = {val: "wkokdwkpddkopwdkop"};
		// this.castleMoves = {val: 0};
	}

	componentDidMount()
	{
		this.isReady = false;
		this.enemyIsReady = false;

		this.ples = 0;
		this.ples1 = 0;
		this.ples2 = 0;

		this.listenOnSocket();
		window.addEventListener("resize", this.resize.bind(this));

		document.querySelector('.switch').addEventListener('mouseup', this.endTurn.bind(this));


		this.vse = new THREE.Group();

		var toti = this;
		
		this.rayCaster = new THREE.Raycaster();
		this.renderer = new THREE.WebGLRenderer();
		this.scene = new THREE.Scene();

		this.renderer.setSize(this.refs.GameWindow.offsetWidth, this.refs.GameWindow.offsetHeight);
		this.renderer.setPixelRatio( window.devicePixelRatio );

		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		// this.renderer.shadowMapEnabled = true;

		this.camera = new THREE.PerspectiveCamera
		(
			45, //View angle
			this.refs.GameWindow.offsetWidth / (this.refs.GameWindow.offsetHeight), //Aspect ratio
			0.1, //Near
			10000 //Far
		);
		this.scene.add(this.camera);

		this.camera.position.z = 19;
		this.camera.position.y = 3;
		this.camera.lookAt(new THREE.Vector3(0,0,0));

		this.hjnToGameState("++/8/10/12/12/2AaaaaaaA2/3AaaaaA3/12/12/3BbbbbB3/2BbbbbbbB2/12/12/10/8/--");


		var jsonLoader = new THREE.JSONLoader();

		jsonLoader.load('./objFiles/tileRED.json', function ( geometry, materials ) 
		{
			toti.loadedStuff++; toti.allObjectsAreLoaded();
			var material = new THREE.MultiMaterial( materials );

			toti.tileRedGeometry = geometry;
			toti.tileRedMaterial = material;
				
		});

		jsonLoader.load('./objFiles/tileBLACK.json', function ( geometry, materials ) 
		{
			toti.loadedStuff++; toti.allObjectsAreLoaded();
			var material = new THREE.MultiMaterial( materials );

			toti.tileBlackGeometry = geometry;
			toti.tileBlackMaterial = material;
	
		});

		jsonLoader.load('./objFiles/horseA.json', function ( geometry, materials ) 
		{
			toti.loadedStuff++; toti.allObjectsAreLoaded();
			var material = new THREE.MultiMaterial( materials );

			toti.horseA_geometry = geometry;
			toti.horseA_material = material;
			
		});

		jsonLoader.load('./objFiles/pawnA.json', function ( geometry, materials ) 
		{
			toti.loadedStuff++; toti.allObjectsAreLoaded();
			var material = new THREE.MultiMaterial( materials );

			toti.pawnA_geometry = geometry;
			toti.pawnA_material = material;
			
		});

		jsonLoader.load('./objFiles/horseB.json', function ( geometry, materials ) 
		{
			toti.loadedStuff++; toti.allObjectsAreLoaded();
			var material = new THREE.MultiMaterial( materials );

			toti.horseB_geometry = geometry;
			toti.horseB_material = material;
		});

		jsonLoader.load('./objFiles/pawnB.json', function ( geometry, materials ) 
		{
			toti.loadedStuff++; toti.allObjectsAreLoaded();
			var material = new THREE.MultiMaterial( materials );

			toti.pawnB_geometry = geometry;
			toti.pawnB_material = material;
			
		});

		jsonLoader.load('./objFiles/miza.json', function ( geometry, materials ) 
		{
			toti.loadedStuff++; toti.allObjectsAreLoaded();


			var material = new THREE.MultiMaterial( materials );

			var mesh = new THREE.Mesh( geometry, material );
			toti.scene.add(mesh);

			// mesh.rotation.y = -0.29;
			// mesh.rotation.x = 0.49;
			mesh.position.z = -16.5;

			mesh.visible = false;


			// toti.pawnB_geometry = geometry;
			// toti.pawnB_material = material;
			
		});


		this.hoveredPiece = null;
		this.gameInfo.piece = null;

		var texloader = new THREE.TextureLoader();

		/*Les za mizo*/
		// var woodTex = texloader.load( 'textures/wood.jpg', function()
		// {
		// 	toti.loadedStuff++;
		// 	toti.allObjectsAreLoaded();
		// });

		// /*Make "table"*/
		// var materialArray = [];
		

		// for (var i = 0; i < 6; i++)
		// {
		// 	materialArray.push(new THREE.MeshBasicMaterial({ map: woodTex}));
		//    materialArray[i].side = THREE.BackSide;
		// }
		// var tableMaterial = new THREE.MeshFaceMaterial( materialArray );
		// var tableGeom = new THREE.CubeGeometry( 5, 5, 5, 1, 1, 1 );
		// tableGeom.position.y = -10;


		// var table = new THREE.Mesh( tableGeom, tableMaterial );
		// this.scene.add(table);
		

		////////////
		// skybox //
		////////////

		var materialArray = [];
		materialArray.push(new THREE.MeshBasicMaterial( { map: texloader.load( 'images/skyBox/left.jpg', function(){toti.loadedStuff++; toti.allObjectsAreLoaded()}) }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: texloader.load( 'images/skyBox/right.jpg', function(){toti.loadedStuff++; toti.allObjectsAreLoaded()} ) }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: texloader.load( 'images/skyBox/top.jpg', function(){toti.loadedStuff++; toti.allObjectsAreLoaded()} ) }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: texloader.load( 'images/skyBox/bottom.jpg', function(){toti.loadedStuff++; toti.allObjectsAreLoaded()} ) }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: texloader.load( 'images/skyBox/back.jpg', function(){toti.loadedStuff++; toti.allObjectsAreLoaded()} ) }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: texloader.load( 'images/skyBox/front.jpg', function(){toti.loadedStuff++; toti.allObjectsAreLoaded()} ) }));

		for (var i = 0; i < 6; i++)
		{
		   materialArray[i].side = THREE.BackSide;
		}
		var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
		var skyboxGeom = new THREE.CubeGeometry( 100, 100, 100, 1, 1, 1 );
		var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );


		// skybox.rotation.y = -0.29;
		// skybox.rotation.x = 0.49;

		this.scene.add( skybox );

		this.vse.add(skybox);
		

		const pointLight = new THREE.PointLight(0xFFFFFF, 1.0);
		pointLight.position.x = -20;
		pointLight.position.y = 20;
		pointLight.position.z = -7;

		pointLight.castShadow = true;

		pointLight.shadowMapWidth = 1024; // default is 512. Povečaj če hočeš lepši shadow!
		pointLight.shadowMapHeight = 1024; // default is 512. Beware! Laggy stuff

		this.vse.add(pointLight); 

		

	}

	resize()
	{
		this.camera.aspect = this.refs.GameWindow.offsetWidth / (this.refs.GameWindow.offsetHeight);
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( this.refs.GameWindow.offsetWidth, this.refs.GameWindow.offsetHeight);
	}

	endTurn()
	{
		// console.log(this.myTurn);
		if (this.myTurn == true)
		{

			console.log('END TURN');

			var ajax = new Ajax();

			var data = {myName: Cookie.get('eMail')};
			data = "data=" + encodeURIComponent(JSON.stringify(data));

			
			ajax.POST("/endTurn", data, function(response)
			{
				// console.log(response);

			});


			// if (document.querySelector('.switch > input').checked == true)
			// {
				
			// 	document.querySelector('.switch > input').checked = false;
			// }
			// else if (document.querySelector('.switch > input').checked == false)
			// {
			// 	document.querySelector('.switch > input').checked = true;
			// }

			this.myTurn = false;
			document.querySelector('.switch').style.pointerEvents = "none";


			this.prevMove = {val: null}; 
			this.prevFig = {val: null};
			this.details = {val: ""};
			this.castleMoves = {val: 0};

			// console.log(document.querySelector('.switch > input').checked);

		}

	}

	getSelectedPiecePosition()
	{
		return{
			y: this.gameInfo.piece.position.z - this.gameInfo.zMin, 
			x: this.gameInfo.piece.position.x - this.gameInfo.xMin
		};
		
	}

	getPiecePosition(object)
	{
		return{
			y: object.position.z - this.gameInfo.zMin, 
			x: object.position.x - this.gameInfo.xMin
		};
		
	}

	boardToWorldCoords(boardX, boardY)
	{
		return{
			x: this.gameInfo.xMin + boardX,
			z: this.gameInfo.zMin + boardY
		};
	}	

	moveSelectedPiece(x, y)
	{
		var prevPos = this.getSelectedPiecePosition();

		// console.log(this.gameState1[prevPos.y]);
		console.log(this.gameInfo.piece.position.x + "," + this.gameInfo.piece.position.z);

		var tmp = this.gameState1[prevPos.y][prevPos.x];
		this.gameState1[prevPos.y][prevPos.x] = "O";
		this.gameState1[y][x] = tmp;

		// this.gameInfo.piece.position.z = this.gameInfo.zMin + y;
		// this.gameInfo.piece.position.x = this.gameInfo.xMin + x;

		var toZ = this.gameInfo.zMin + y;
		var toX = this.gameInfo.xMin + x;

		var kamZ = "";
		var kamX = "";


		if (this.gameInfo.piece.position.z < toZ)
		{
			kamZ = "gor";
		}
		else if (this.gameInfo.piece.position.z > toZ)
		{
			kamZ = "dol";
		}
		if (this.gameInfo.piece.position.x < toX)
		{
			kamX = "gor";
		}
		else if (this.gameInfo.piece.position.x > toX)
		{
			kamX = "dol";
		}	


		var toti = this;

		var overTime = setInterval(function()
		{
			if (kamX != "" || kamZ != "")
			{
				if (toti.gameInfo.piece.position.z < toZ && kamZ == "gor")
				{
					toti.gameInfo.piece.position.z += 0.05;
				}
				else if (toti.gameInfo.piece.position.z > toZ && kamZ == "gor")
				{
					// console.log("PLEEES");
					kamZ = "";
				}
				else if (toti.gameInfo.piece.position.z > toZ && kamZ == "dol")
				{
					toti.gameInfo.piece.position.z -= 0.05;
				}
				else if (toti.gameInfo.piece.position.z < toZ && kamZ == "dol")
				{
					kamZ = "";
				}


				if (toti.gameInfo.piece.position.x < toX && kamX == "gor")
				{
					toti.gameInfo.piece.position.x += 0.05;
				}
				else if (toti.gameInfo.piece.position.x > toX && kamX == "gor")
				{
					kamX = "";
				}
				else if (toti.gameInfo.piece.position.x > toX && kamX == "dol")
				{
					toti.gameInfo.piece.position.x -= 0.05;
				}
				else if (toti.gameInfo.piece.position.x < toX && kamX == "dol")
				{
					kamX = "";
				}

			}
			else
			{	
				toti.gameInfo.piece.position.z = toti.gameInfo.zMin + y;
				toti.gameInfo.piece.position.x = toti.gameInfo.xMin + x;
				console.log(toti.gameInfo.piece.position.z);
				console.log(toti.gameInfo.piece.position.x);

				toti.gameInfo.piece = null;
				clearInterval(overTime)

			}
			// console.log(toti.gameInfo.piece.position.z);
			// console.log(toZ);

		}, 10);

		
	}

	movePieceAtIndex(srcX, srcY, destX, destY)
	{	
		var pos = this.boardToWorldCoords(srcX, srcY);
		var fig = null;
		// console.log(pos);



		// console.log(pos);
		for (var i = 0; i < this.allFigs.length; i++)
		{
			// console.log(this.allFigs[i].position.x + "-" + this.allFigs[i].position.z);
			if (pos.x == this.allFigs[i].position.x && pos.z == this.allFigs[i].position.z)
			{
				fig = this.allFigs[i];
				break;
			}
		}

		// fig.position.z = this.gameInfo.zMin + destY;
		// fig.position.x = this.gameInfo.xMin + destX;

		var toZ = this.gameInfo.zMin + destY;
		var toX = this.gameInfo.xMin + destX;

		var kamZ = "";
		var kamX = "";


		if (fig.position.z < toZ)
		{
			kamZ = "gor";
		}
		else if (fig.position.z > toZ)
		{
			kamZ = "dol";
		}
		if (fig.position.x < toX)
		{
			kamX = "gor";
		}
		else if (fig.position.x > toX)
		{
			kamX = "dol";
		}	


		var toti = this;

		var overTime = setInterval(function()
		{
			if (kamX != "" || kamZ != "")
			{
				if (fig.position.z < toZ && kamZ == "gor")
				{
					fig.position.z += 0.05;
				}
				else if (fig.position.z > toZ && kamZ == "gor")
				{
					// console.log("PLEEES");
					kamZ = "";
				}
				else if (fig.position.z > toZ && kamZ == "dol")
				{
					fig.position.z -= 0.05;
				}
				else if (fig.position.z < toZ && kamZ == "dol")
				{
					kamZ = "";
				}


				if (fig.position.x < toX && kamX == "gor")
				{
					fig.position.x += 0.05;
				}
				else if (fig.position.x > toX && kamX == "gor")
				{
					kamX = "";
				}
				else if (fig.position.x > toX && kamX == "dol")
				{
					fig.position.x -= 0.05;
				}
				else if (fig.position.x < toX && kamX == "dol")
				{
					kamX = "";
				}

			}
			else
			{
				fig.position.z = toti.gameInfo.zMin + destY;
				fig.position.x = toti.gameInfo.xMin + destX;

				console.log(fig.position.z);
				console.log(fig.position.x);

				console.log("HALELUJAH");

				clearInterval(overTime);
				// toti.gameInfo.piece = null;
			}
			// console.log(toti.gameInfo.piece.position.z);
			// console.log(toZ);

		}, 10);


		// console.log(this.gameState1[srcX][srcY]);
		this.gameState1[destY][destX] = this.gameState1[srcY][srcX];
		this.gameState1[srcY][srcX] = 'O';
		// console.log(this.gameState1);
		// console.log(srcX, srcY);

		// console.log(fig);
	}

	gameWindowMouseDown(e)
	{
		if (e.buttons == 1)
		{
			this.mouse1.leftDown = true;
			this.mouse1.X = e.pageX - this.refs.GameWindow.offsetLeft;
			this.mouse1.Y = e.pageY - this.refs.GameWindow.offsetTop;
			this.mouse1.prevX = this.mouse1.X;
			this.mouse1.prevY = this.mouse1.Y;
		}
		else if (e.buttons == 4)
		{
			this.moveSelectedPiece(this.gameInfo.travelToX, this.gameInfo.travelToY);
		}

		// console.log(e.buttons);
	}

	getPossibelMoves(x, y, callback)
	{
		x++;
		y++;


		var ajax = new Ajax();
		var toti = this;

		var pot = 
		[
			['X','X','X','X','X', 0,1, 'X','X','X','X','X'],
			['X','X', 2,3,4,5,6,7,8,9, 'X','X'],
			['X', 10, 11,12,13,14,15,16,17,18,19, 'X'],
			[20, 21,22,23,24,25,26,27,28,29,30,31],
			[32, 33,34,35,36,37,38,39,40,41,42,43],
			[44, 45,46,47,48,49,50,51,52,53,54,55],
			[56, 57,58,59,60,61,62,63,64,65,66,67],
			[68, 69,70,71,72,73,74,75,76,77,78,79],
			[80, 81,82,83,84,85,86,87,88,89,90,91],
			[92, 93,94,95,96,97,98,99,100,101,102,103],
			[104,105,106,107,108,109,110,111,112,113,114,115],
			[116,117,118,119,120,121,122,123,124,125,126,127],
			[128,129,130,131,132,133,134,135,136,137,138,139],
			['X',140,141,142,143,144,145,146,147,148,149,'X'],
			['X','X',150,151,152,153,154,155,156,157,'X','X'],
			['X','X','X','X','X',158,159,'X','X','X','X','X',],
		];

		var hjn = this.gameStateToHJN(this.gameState1);

		var data = {pos: y + "," + x, castle: this.gameInfo.player, hjn: hjn, prevMove: this.prevMove, prevFig: this.prevFig, details: this.details, castleMoves: this.castleMoves};
		data = encodeURIComponent(JSON.stringify(data));
		data = "json=" + data;
		// console.log(data);

		var tiles = [];

		ajax.GET('/possibleMoves/', function(response)
		{
			var mozniPremiki = JSON.parse(response);
			// console.log(mozniPremiki);

			// console.log(toti.scene.children[4].children[0]);
			if (mozniPremiki != null)
			{
				for (var i = 0; i < mozniPremiki.length; i++) 
				{
					// toti.scene.children[4].children[0].children[pot[mozniPremiki[i].row - 1][mozniPremiki[i].col - 1]].isSelectable = true;
					// toti.scene.children[4].children[0].children[pot[mozniPremiki[i].row - 1][mozniPremiki[i].col - 1]].isHoverable = true;

					// toti.hardSelect(toti.scene.children[4].children[0].children[pot[mozniPremiki[i].row - 1][mozniPremiki[i].col - 1]]);
					
					tiles.push(toti.scene.children[2].children[2].children[0].children[pot[mozniPremiki[i].row - 1][mozniPremiki[i].col - 1]]);	

				}
				callback(tiles);
			}

			
		},data);
	}


	gameWindowMouseUp(e)
	{
		if (e.buttons == 0)
		{
			this.mouse1.leftDown = false;
			this.gameInfo.canSelect = true;
		}
	}


	allObjectsAreLoaded()
	{	
		// console.log(this.scene);
		if (this.loadedStuff == 14)
		{
			var toti = this;
			

			var tileRed_SoftSelectColotOffset = {r: -4.3, g: -4.3, b: -4.3};
			var tileRed_HardSelectColotOffset = {r: 4.3, g: 4.3, b: 4.3};
			var tileRed_HardAndSoftSelectColotOffset = {r: -10, g: -10, b: -10};

			var tileBlack_SoftSelectColotOffset = {r: -4.3, g: -4.3, b: -4.3};
			var tileBlack_HardSelectColotOffset = {r: 4.3, g: 4.3, b: 4.3};
			var tileBlack_HardAndSoftSelectColotOffset = {r: -10, g: -10, b: -10};

			var fig_SoftSelectColotOffset = {r: .3, g: .3, b: .3};
			var fig_HardSelectColotOffset = {r: .5, g: .5, b: .5};
			var fig_HardAndSoftSelectColotOffset = {r: -0.5, g: -0.5, b: -0.5};


			var stVrstic = this.gameState1.length;
			var stStolpcev = this.gameState1[0].length;

			var mesh = null;

			var rowCount = 0;
			var colCount = 0;

			var tiles = 
			[
				{geometry: this.tileRedGeometry, material: this.tileRedMaterial, softSelectColorOffset: tileRed_SoftSelectColotOffset, hardSelectColorOffset: tileRed_HardSelectColotOffset, hardAndSoftSelectColorOffset: tileRed_HardAndSoftSelectColotOffset},
				{geometry: this.tileBlackGeometry, material: this.tileBlackMaterial, softSelectColorOffset: tileBlack_SoftSelectColotOffset, hardSelectColorOffset: tileBlack_HardSelectColotOffset, hardAndSoftSelectColorOffset: tileBlack_HardAndSoftSelectColotOffset}
			];
			var check = 0;

			var newBoardGroup = new THREE.Group();

			var tilesGroup = new THREE.Group();
			newBoardGroup.add(tilesGroup);

			var teamA = new THREE.Group();
			var teamB = new THREE.Group();

			newBoardGroup.add(teamA);
			newBoardGroup.add(teamB);

			var teamA_Horses = new THREE.Group();
			var teamA_Pawns = new THREE.Group();
			var teamB_Horses = new THREE.Group();
			var teamB_Pawns = new THREE.Group();

			teamA.add(teamA_Horses);
			teamA.add(teamA_Pawns);

			teamB.add(teamB_Horses);
			teamB.add(teamB_Pawns);


			var figs = 
			{
				A: 
				{
					geometry: this.horseA_geometry,
					material: this.horseA_material,
					player: "+",
					group: teamA_Horses
				},
				a:
				{
					geometry: this.pawnA_geometry,
					material: this.pawnA_material,
					player: "+",
					group: teamA_Pawns

				},
				B: 
				{
					geometry: this.horseB_geometry,
					material: this.horseB_material,
					player: "-",
					group: teamB_Horses
				},
				b:
				{
					geometry: this.pawnB_geometry,
					material: this.pawnB_material,
					player: "-",
					group: teamB_Pawns
				}
			};

			var paddingLeftRight = [5, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 5];
			this.allFigs = [];


			for (var i = 0; i < stVrstic * stStolpcev; ++i) 
			{
				if (colCount == stStolpcev)
				{
					if (paddingLeftRight[rowCount] == 0 && rowCount != 12)
					{
						if (check == 0)
						{
							check = 1;
						}
						else
						{
							check = 0;
						}
					}

					++rowCount;
					colCount = 0;
				}

				if (this.gameState1[rowCount][colCount] != "X") 
				{
					mesh = new THREE.Mesh( tiles[check].geometry, tiles[check].material );
					mesh.position.x = colCount - 5;
					mesh.position.z = rowCount - 8;
					mesh.isSelectable = false;
					mesh.isHoverable = false;
					mesh.isSoftSelected = false;
					mesh.isHardSelected = false;

					mesh.originalMaterial = tiles[check].material;
					mesh.softSelectColorOffset = tiles[check].softSelectColorOffset;
					mesh.hardSelectColorOffset = tiles[check].hardSelectColorOffset;
					mesh.hardAndSoftColorOffset = tiles[check].hardAndSoftSelectColorOffset;
					mesh.materialBuffer = [];
					mesh.descriptor = "tile";

					

					mesh.receiveShadow = true;

					tilesGroup.add(mesh);

					if (this.gameState1[rowCount][colCount] != "O" && this.gameState1[rowCount][colCount] != "+" && this.gameState1[rowCount][colCount] != "-") 
					{
						var whichOne = this.gameState1[rowCount][colCount];

						mesh = new THREE.Mesh( figs[whichOne].geometry, figs[whichOne].material );
						mesh.player = figs[whichOne].player;
						mesh.originalMaterial = figs[whichOne].material;
						mesh.bufferMaterial = mesh.originalMaterial;


						mesh.position.x = colCount - 5;
						mesh.position.z = rowCount - 8;

						if (mesh.player == this.gameInfo.player)
						{
							mesh.isSelectable = true;
							mesh.isHoverable = true;
						}
						else
						{
							mesh.isSelectable = false;
							mesh.isHoverable = false;
						}

						mesh.isSoftSelected = false;
						mesh.isHardSelected = false;
						mesh.softSelectColorOffset = fig_SoftSelectColotOffset;
						mesh.hardSelectColorOffset = fig_HardSelectColotOffset;
						mesh.hardAndSoftColorOffset = fig_HardAndSoftSelectColotOffset;
						mesh.materialBuffer = [];
						mesh.descriptor = "fig";
						mesh.castShadow = true;
						mesh.receiveShadow = true;

						figs[whichOne].group.add(mesh);


						this.allFigs.push(mesh);
					}	


					if (check == 0)
					{
						check = 1;
					}
					else
					{
						check = 0;
					}
				}

				++colCount;
			}

			// newBoardGroup.rotation.y = -0.29;
			// newBoardGroup.rotation.x = 0.49;
			// newBoardGroup.position.z = -16.5;

			if (this.gameInfo.player == "+")
			{
				newBoardGroup.rotation.y += 3.14159;
				// this.scene.children[1].position.x -= 10.14159;
			}
			var particleSystem = this.createParticleSystem();
  			// this.scene.add(particleSystem);
			newBoardGroup.add(particleSystem);
			this.vse.add(newBoardGroup);
			this.vse.rotation.y = -.5;
			this.vse.rotation.x = .5;

			// this.scene.add(newBoardGroup);
			
			this.refs.GameWindow.appendChild(this.renderer.domElement);
			// this.listenOnSocket();
			// this.startGame();
			// console.log(this.props.socket);

			// this.controls = new OrbitControls( this.camera, this.renderer.domElement );
			// this.controls.addEventListener( 'change', this.renderer );
			// this.controls.autoRotate = true;
			// this.controls.enableDamping = true;
			// this.controls.dampingFactor = 0.25;
			// this.controls.enableZoom = false;

			// console.log(this.controls);

			this.scene.add(this.vse);

			var light = new THREE.AmbientLight( 0x404040 ); // soft white light
		this.vse.add( light );

			console.log(this.scene);
			// this.isReady = true;
			if (this.enemyIsReady == true)
			{
				toti.startGame();
			}
		}

	}

	listenOnSocket()
	{
		var toti = this;
		this.props.socket.on(Cookie.get('eMail'), function(data)
		{
			if (data.action == 'startGame')
			{
				toti.enemyIsReady = true;
				toti.gameInfo.player = data.team;
				toti.loadedStuff++;
				
				if (data.yourTurn == true)
				{
					document.querySelector('.switch > input').checked = true;
					toti.myTurn = true;
					// console.log(data.yourTurn);
				}
				else
				{
					document.querySelector('.switch').checked = false;
					toti.myTurn = false;
					document.querySelector('.switch').style.pointerEvents = "none";
					// console.log(data.yourTurn);
				}

				toti.allObjectsAreLoaded();
			}
			else if (data.action == 'moviePiece')
			{

				// console.log("Enemy je premakno figuro");
				toti.movePieceAtIndex(data.src.x, data.src.y, data.dest.x, data.dest.y);
			}
			else if (data.action == 'startTurn')
			{
				if (toti.myTurn == false)
				{
					document.querySelector('.switch > input').checked = true;
					document.querySelector('.switch').style.pointerEvents = "auto";
					toti.myTurn = true;
					
				}
			}
			else if (data.action == 'deletePiece')
			{
				toti.gameState1[data.info.y][data.info.x] = 'O';

				if (data.info.team == 'A')
				{
					 toti.scene.children[2].children[2].children[1].children[parseInt(data.info.children)].children.splice(parseInt(data.info.children1), 1);
				}
				else if (data.info.team == 'B')
				{
					 toti.scene.children[2].children[2].children[2].children[parseInt(data.info.children)].children.splice(parseInt(data.info.children1), 1);;
				}
				// console.log(data.info);
			}
		});
	}
	

	startGame()
	{
		this.refs.GameWindow.children[0].style.display = "none";
		this.refs.GameWindow.classList.remove("isPaused");
		document.querySelector('.switch label').style.display = 'block';

		requestAnimationFrame(this.update.bind(this));
	}

	/*------------------HJN functions---------------------*/
	hjnToGameState(hjn)
	{
		var emptyBoard = 
		[
			["X","X","X","X","X","+","+","X","X","X","X","X"],
			["X","X","O","O","O","O","O","O","O","O","X","X"],
			["X","O","O","O","O","O","O","O","O","O","O","X"],
			["O","O","O","O","O","O","O","O","O","O","O","O"],
			["O","O","O","O","O","O","O","O","O","O","O","O"],
			["O","O","O","O","O","O","O","O","O","O","O","O"],
			["O","O","O","O","O","O","O","O","O","O","O","O"],
			["O","O","O","O","O","O","O","O","O","O","O","O"],
			["O","O","O","O","O","O","O","O","O","O","O","O"],
			["O","O","O","O","O","O","O","O","O","O","O","O"],
			["O","O","O","O","O","O","O","O","O","O","O","O"],
			["O","O","O","O","O","O","O","O","O","O","O","O"],
			["O","O","O","O","O","O","O","O","O","O","O","O"],
			["X","O","O","O","O","O","O","O","O","O","O","X"],
			["X","X","O","O","O","O","O","O","O","O","X","X"],
			["X","X","X","X","X","-","-","X","X","X","X","X"]
		];

		var paddingLeftRight = [5, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 5];

		var vrstice = hjn.split("/");

		for (var i = 0; i < vrstice.length; i++)
		{
			var xPos = paddingLeftRight[i];
			var numHolder = "";

			for (var j = 0; j < vrstice[i].length; j++) 
			{
				if (/^\d+$/.test(vrstice[i][j]))
				{
					numHolder += vrstice[i][j];
				}
				else
				{
					if (numHolder != "")
					{
						xPos += parseInt(numHolder);
						numHolder = "";
					}

					emptyBoard[i][xPos] = vrstice[i][j];
					xPos++;

				}
			}
		}
		this.gameState1 = emptyBoard;

		// this.ples1(emptyBoard);
	}

	gameStateToHJN(gameState)
	{
		var paddingLeftRight = [5, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 5];
		var HJN = "";
		var emptySpaceCounter = 0;

		for (var i = 0; i < gameState.length; i++)
		{
			emptySpaceCounter = 0;
			for (var j = paddingLeftRight[i]; j < (12 - paddingLeftRight[i]); j++)
			{
				if (gameState[i][j] == "O")
				{
					emptySpaceCounter++;
				}
				else
				{
					if (emptySpaceCounter != 0)
					{
						HJN += emptySpaceCounter;
						emptySpaceCounter = 0;
					}

					HJN += gameState[i][j];
				}
			}
			if (emptySpaceCounter != 0)
			{
				HJN += emptySpaceCounter;
				emptySpaceCounter = 0;
			}

			if (i < gameState.length - 1)
			{
				HJN += "/";
			}
		}

		return HJN;
	}
	/*-----------------------------------------------------*/

	trackMouseMovements(e)
	{


		if (this.mouse1.leftDown == true) 
		{
			this.gameInfo.needsUpdate = true;
			this.gameInfo.canSelect = false;

			this.mouse1.prevX = this.mouse1.X;
			this.mouse1.prevY = this.mouse1.Y;
			this.mouse1.X = e.pageX - this.refs.GameWindow.offsetLeft;
			this.mouse1.Y = e.pageY - this.refs.GameWindow.offsetTop;
		}

		this.mouse.x = ( (e.pageX - this.refs.GameWindow.offsetLeft)/ this.refs.GameWindow.offsetWidth ) * 2 - 1;
		this.mouse.y = -( (e.pageY - this.refs.GameWindow.offsetTop) / (this.refs.GameWindow.offsetHeight) ) * 2 + 1;

		// console.log(this.mouse.x);
		// console.log(this.mouse.y);
		
	}

	/*---------------Select functions--------------------*/
	unSoftSelect(object)
	{
		if (this.isSoftSelected(object))
		{
			// console.log(object.materialBuffer.length);
			object.material = object.materialBuffer.pop();
			object.isSoftSelected = false;
		}
	}

	softSelect(object)
	{
		if (!this.isSoftSelected(object))
		{
		
			object.isSoftSelected = true;

			var material = object.material.clone();

			var offset;
			if (object.isHardSelected) 
			{
				offset = object.hardAndSoftColorOffset;
			}
			else
			{
				offset = object.softSelectColorOffset;
			}

			object.materialBuffer.push(material);

			var material = object.material.clone();
			for (var i = 0; i < material.materials.length; i++)
			{

				material.materials[i].color.setRGB(material.materials[i].color.r + offset.r, material.materials[i].color.g + offset.g, material.materials[i].color.b + offset.b);
			}
			object.material = material;
		}
	}

	isSoftSelected(object)
	{
		return object.isSoftSelected;
	}

	unHardSelect(object)
	{
		if (this.isHardSelected(object))
		{
			if (this.isSoftSelected(object)) 
			{
				object.materialBuffer = [];
				object.materialBuffer.push(object.originalMaterial);
				object.material = object.originalMaterial;
				object.isHardSelected = false;
				this.softSelect(object);
			}
			else
			{
				// console.log(object.materialBuffer.length);
				object.material = object.materialBuffer.pop();
				object.isHardSelected = false;
			}
		}
	}

	hardSelect(object)
	{
		if (!this.isHardSelected(object))
		{
			var offset = object.hardSelectColorOffset;

			if (!this.isSoftSelected(object))
			{	
				object.isHardSelected = true;

				var material = object.material.clone();
				object.materialBuffer.push(material);
				material = object.material.clone();

				var offsetTMP = 
				{
					r: 0,
					g: 0,
					b: 0
				};

				// for (var i = 0; i < material.materials.length; i++)
				// {
				// 	material.materials[i].color.setRGB(material.materials[i].color.r + offset.r, material.materials[i].color.g + offset.g, material.materials[i].color.b + offset.b);
				// }
				// object.material = material;

				var myVar = setInterval(function()
				{
					offsetTMP.r += 0.01;
					offsetTMP.g += 0.01;
					offsetTMP.b += 0.01;


					for (var i = 0; i < material.materials.length; i++)
					{
						material.materials[i].color.setRGB(material.materials[i].color.r + offsetTMP.r, material.materials[i].color.g + offsetTMP.g, material.materials[i].color.b + offsetTMP.b);
					}


					object.material = material;

					if (offsetTMP.r > 0.1)
					{

						clearInterval(myVar);

						for (var i = 0; i < material.materials.length; i++)
						{
							material.materials[i].color.setRGB(material.materials[i].color.r + offset.r, material.materials[i].color.g + offset.g, material.materials[i].color.b + offset.b);
						}
						object.material = material;
					}
				}, 20);
			}
			else
			{
				
				object.materialBuffer = [];
				object.isSoftSelected = false;

				var material = object.originalMaterial.clone();
				object.materialBuffer.push(material);

				material = object.material.clone();
				for (var i = 0; i < material.materials.length; i++)
				{
					material.materials[i].color.setRGB(material.materials[i].color.r + offset.r, material.materials[i].color.g + offset.g, material.materials[i].color.b + offset.b);
				}
				object.material = material;

				object.isHardSelected = true;
				this.softSelect(object);
			}
		}
	}

	isHardSelected(object)
	{
		return object.isHardSelected;
	}

	/*--------------------------------------------------*/

	makeUnHoverableAndClickable(team)
	{
		if (team == "teamA")
		{

				// console.log(this.scene.children[4].children[1].children.length);	
			for (var i = 0; i < this.scene.children[2].children[2].children[2].children.length; i++)
			{
				for (var j = 0; j < this.scene.children[2].children[2].children[2].children[i].children.length; j++)
				{
					this.scene.children[2].children[2].children[2].children[i].children[j].isHoverable = false;
					this.scene.children[2].children[2].children[2].children[i].children[j].isSelectable = false;	
				}
			}
		}
	}

	makeHoverableAndClickable(team)
	{
		if (team == "teamA")
		{

				// console.log(this.scene.children[4].children[1].children.length);	
			for (var i = 0; i < this.scene.children[2].children[2].children[2].children.length; i++)
			{
				for (var j = 0; j < this.scene.children[2].children[2].children[2].children[i].children.length; j++)
				{
					this.scene.children[2].children[2].children[2].children[i].children[j].isHoverable = true;
					this.scene.children[2].children[2].children[2].children[i].children[j].isSelectable = true;	
				}
			}
		}
	}

	removeElementAtIndex(x, y)
	{
		--x;
		--y;
		var coords = this.boardToWorldCoords(x,y);

		this.gameState1[y][x] = 'O';

		var teamA = this.scene.children[2].children[2].children[1];
		var teamB = this.scene.children[2].children[2].children[2];

		var ajax = new Ajax();

		for (var i = 0; i < teamA.children[0].children.length; i++)
		{
			if (teamA.children[0].children[i].position.x == coords.x && teamA.children[0].children[i].position.z == coords.z)
			{
				teamA.children[0].children.splice(i, 1);

				var data = {myName: Cookie.get('eMail'), info:{ team: 'A', children: 0, children1: i, x: x, y: y}};
				data = "data=" + encodeURIComponent(JSON.stringify(data));

				
				ajax.POST("/deletePiece", data, function(response)
				{
					// console.log(response);

				});
			}
		}
		for (var i = 0; i < teamA.children[1].children.length; i++)
		{
			if (teamA.children[1].children[i].position.x == coords.x && teamA.children[1].children[i].position.z == coords.z)
			{
				teamA.children[1].children.splice(i, 1);

				var data = {myName: Cookie.get('eMail'), info:{ team: 'A', children: 1, children1: i, x: x, y: y}};
				data = "data=" + encodeURIComponent(JSON.stringify(data));

				
				ajax.POST("/deletePiece", data, function(response)
				{
					// console.log(response);

				});

			}
		}

		for (var i = 0; i < teamB.children[0].children.length; i++)
		{
			if (teamB.children[0].children[i].position.x == coords.x && teamB.children[0].children[i].position.z == coords.z)
			{
				teamB.children[0].children.splice(i, 1);

				var data = {myName: Cookie.get('eMail'), info:{ team: 'B', children: 0, children1: i, x: x, y: y}};
				data = "data=" + encodeURIComponent(JSON.stringify(data));

				
				ajax.POST("/deletePiece", data, function(response)
				{
					// console.log(response);

				});

			}
		}
		for (var i = 0; i < teamB.children[1].children.length; i++)
		{
			if (teamB.children[1].children[i].position.x == coords.x && teamB.children[1].children[i].position.z == coords.z)
			{
				teamB.children[1].children.splice(i, 1);

				var data = {myName: Cookie.get('eMail'), info:{ team: 'B', children: 1, children1: i, x: x, y: y}};
				data = "data=" + encodeURIComponent(JSON.stringify(data));

				
				ajax.POST("/deletePiece", data, function(response)
				{
					// console.log(response);

				});

			}
		}


		// console.log(teamA);
		// console.log(teamB);


		// console.log(coords);
	}

	createParticleSystem()
	{
     
		// The number of particles in a particle system is not easily changed.
		var particleCount = 1000;

		// Particles are just individual vertices in a geometry
		// Create the geometry that will hold all of the vertices
		var particles = new THREE.Geometry();

		// Create the vertices and add them to the particles geometry
		for (var p = 0; p < particleCount; p++) {

		// This will create all the vertices in a range of -200 to 200 in all directions
		var x = Math.random()- 0.5;
		var y = Math.random();
		var z = Math.random()+ 0.5;
		   
		// Create the vertex
		var particle = new THREE.Vector3(x, y, z);
		particle.tempX = x;
		particle.tempZ = z;
		particle.cosSin = Math.random() * 6.18;

		// Add the vertex to the geometry
		particles.vertices.push(particle);
		}

		// Create the material that will be used to render each vertex of the geometry
		var particleMaterial = new THREE.PointsMaterial(
		{color: 0xffffff, 
		 size: 0.1,
		 map: THREE.ImageUtils.loadTexture("images/snowflake.png"),
		 // blending: THREE.AdditiveBlending,
		 transparent: true
		});

		// particleMaterial.visible = false;

		// Create the particle system
		var particleSystem = new THREE.Points(particles, particleMaterial);
		particleSystem.visible = false;


		// particleSystem.rotation.y = -0.29;
		// particleSystem.rotation.x = 0.49;
		// particleSystem.position.z = -16.5;

		// if (this.gameInfo.player == "+")
		// {
		// 	particleSystem.rotation.y += 3.14159;
		// }

		this.particleSystem = particleSystem;
		// particleSystem.position.z -= 1; 

		return particleSystem;  
	}

	animateParticles()
	{
		this.particleSystem.visible = true;
		var verts = this.particleSystem.geometry.vertices;
		var toti = this;

		var counter = Array.apply(null, Array(verts.length)).map(Number.prototype.valueOf,0);

		// var coords = this.boardToWorldCoords(x, y):
		// console.log(coords);
		this.particleSystem.position.z = this.gameInfo.piece.position.z;
		this.particleSystem.position.x = this.gameInfo.piece.position.x;

		setInterval(function(){ 


		for(var i = 0; i < verts.length; i++)
		{
			var vert = verts[i];
			
			// vert.y += Math.random()*0.05 - 0.025;
			// vert.x += Math.random()*0.05 - 0.025;
			// vert.z += Math.random()*0.05 - 0.025;

			vert.x = Math.cos(vert.cosSin)*0.5;
			vert.z = Math.sin(vert.cosSin)*0.5;

			vert.cosSin += 0.01;
			
		}
			
		toti.particleSystem.geometry.verticesNeedUpdate = true;

		}, 20);
     
	}

	unAnimatePartciles()
	{
		this.particleSystem.visible = false;
	}


	update()
	{

		if (this.gameInfo.needsUpdate == true) 
		{
			// this.scene.children[0].rotation.y -= (this.mouse1.prevX - this.mouse1.X) * .05;
			// this.scene.children[0].rotation.x -= (this.mouse1.prevY - this.mouse1.Y) * .05;

			// this.scene.children[1].rotation.y -= (this.mouse1.prevX - this.mouse1.X) * .05;
			// this.scene.children[1].rotation.x -= (this.mouse1.prevY - this.mouse1.Y) * .05;
			this.scene.children[2].rotation.y -= (this.mouse1.prevX - this.mouse1.X) * .05;
			this.scene.children[2].rotation.x -= (this.mouse1.prevY - this.mouse1.Y) * .05;

			// console.log(this.scene);
			// this.scene.children[3].rotation.y -= (this.mouse1.prevX - this.mouse1.X) * .05;
			// this.scene.children[3].rotation.x -= (this.mouse1.prevY - this.mouse1.Y) * .05;
			// this.scene.children[4].rotation.y -= (this.mouse1.prevX - this.mouse1.X) * .05;
			// this.scene.children[4].rotation.x -= (this.mouse1.prevY - this.mouse1.Y) * .05;
			// this.scene.children[5].rotation.y -= (this.mouse1.prevX - this.mouse1.X) * .05;
			// this.scene.children[5].rotation.x -= (this.mouse1.prevY - this.mouse1.Y) * .05;
			// this.scene.children[4].rotation.y -= (this.mouse1.prevX - this.mouse1.X) * .05;
			// this.scene.children[4].rotation.x -= (this.mouse1.prevY - this.mouse1.Y) * .05;
			// this.scene.children[5].rotation.y -= (this.mouse1.prevX - this.mouse1.X) * .05;
			// this.scene.children[5].rotation.x -= (this.mouse1.prevY - this.mouse1.Y) * .05;
			// this.scene.children[6].rotation.y -= (this.mouse1.prevX - this.mouse1.X) * .05;
			// this.scene.children[6].rotation.x -= (this.mouse1.prevY - this.mouse1.Y) * .05;
			// this.scene.children[7].rotation.y -= (this.mouse1.prevX - this.mouse1.X) * .05;
			// this.scene.children[7].rotation.x -= (this.mouse1.prevY - this.mouse1.Y) * .05;

			// this.ples +=  (this.mouse1.prevX - this.mouse1.X)*-0.05;
			// this.ples1 += (this.mouse1.prevY - this.mouse1.Y)*-0.05;
			// this.ples2 += ((this.mouse1.prevX - this.mouse1.X)*-0.05 + (this.mouse1.prevY - this.mouse1.Y)*-0.05);

			// this.camera.position.x =  Math.sin( this.ples )*20;
			// // this.camera.position.y =  Math.sin( this.ples1 )*20;
			// this.camera.position.z =  Math.cos( this.ples)*20 - 16.5;

			// // this.camera.up.set( 0, 0, 1 + Math.sin( this.ples1 )*20 - 1 );
			// this.camera.lookAt( new THREE.Vector3( 0, 0, -16.5 ));

			this.gameInfo.needsUpdate = false;

			document.body.style.cursor = "auto";

			

		}
		else if(this.gameInfo.canSelect == true && this.myTurn == true)
		{
			this.rayCaster.setFromCamera( this.mouse, this.camera );
			// var test = this.scene.children[4].clone();
			var intersects = this.rayCaster.intersectObjects( this.scene.children[2].children, true);

			if (intersects.length > 0)
			{
				if (intersects[0].object.isHoverable)
				{
					if (this.hoveredPiece == null) 
					{
						this.softSelect(intersects[ 0 ].object);
						this.hoveredPiece = intersects[ 0 ].object;
					}
					else if(this.hoveredPiece.uuid != intersects[ 0 ].object.uuid)
					{
						this.unSoftSelect(this.hoveredPiece);
						this.softSelect(intersects[ 0 ].object);
						this.hoveredPiece = intersects[ 0 ].object;
					}

					document.body.style.cursor = "pointer";
				}
				else
				{
					document.body.style.cursor = "auto";
					if (this.hoveredPiece != null)
					{

						this.unSoftSelect(this.hoveredPiece);
						this.hoveredPiece = null;
					}
				}

				if (this.mouse1.leftDown == true && intersects[0].object.isSelectable)
				{	
					if (intersects[0].object.descriptor == "fig")
					{
						// console.log(this.gameInfo.piece);
						if (this.gameInfo.piece == null)
						{


							this.hardSelect(intersects[0].object);
							this.gameInfo.piece = intersects[0].object;
							this.animateParticles();

							this.makeUnHoverableAndClickable("teamA");

							this.gameInfo.piece.isHoverable = true;
							this.gameInfo.piece.isSelectable = true;

							var pos = this.getSelectedPiecePosition();
							var toti = this;
							this.getPossibelMoves(pos.x, pos.y, function(tiles)
							{
								toti.possbbleMoveTiles = tiles;
								for (var i = 0; i < tiles.length; i++) 
								{
									tiles[i].isHoverable = true;
									tiles[i].isSelectable = true;
									toti.hardSelect(tiles[i]);
								}
							});


							this.gameInfo.canSelect = false;
						}
						else
						{
							this.unAnimatePartciles();
							this.unHardSelect(this.gameInfo.piece);
							for (var i = 0; i < this.possbbleMoveTiles.length; i++)
							{
								this.unHardSelect(this.possbbleMoveTiles[i]);
								this.possbbleMoveTiles[i].isHoverable = false;
								this.possbbleMoveTiles[i].isSelectable = false;
							}
							this.makeHoverableAndClickable("teamA");

							this.gameInfo.canSelect = false;
							this.gameInfo.piece = null;

						}
						
					}
					else if (intersects[0].object.descriptor == "tile")
					{

						if (this.gameInfo.piece != null)
						{
							this.gameInfo.canSelect = false;
							
							this.unHardSelect(this.gameInfo.piece);

							
							for (var i = 0; i < this.possbbleMoveTiles.length; i++)
							{
								this.unHardSelect(this.possbbleMoveTiles[i]);
								this.possbbleMoveTiles[i].isHoverable = false;
								this.possbbleMoveTiles[i].isSelectable = false;
							}
							this.makeHoverableAndClickable("teamA");
							var pos = this.getPiecePosition(intersects[0].object);
							var pos1 = this.getSelectedPiecePosition();
							var ajax = new Ajax();


							var hjn = this.gameStateToHJN(this.gameState1);


							// var prevMove = {val: null}; 
							// var prevFig = {val: null};
							// var details = {val: ""};
							// var castleMoves = {val: 0};


							var data = {myName: Cookie.get('eMail'), src: {x: pos1.x, y: pos1.y}, dest: {x: pos.x, y: pos.y}, hjn: hjn, castle: this.gameInfo.player, prevMove: this.prevMove, prevFig: this.prevFig, details: this.details, castleMoves: this.castleMoves};
							data = "data=" + encodeURIComponent(JSON.stringify(data));

							var toti = this;
							ajax.GET("/validate", function(response)
							{
								// console.log(response);
								var returnedData = JSON.parse(response);

								toti.prevMove.val = returnedData.prevMove.val,
								toti.prevFig.val = returnedData.prevFig.val,
								toti.details.val = returnedData.details.val,
								toti.castleMoves.val = returnedData.castleMoves.val
								toti.kje.val = returnedData.kje.val;

								if (toti.kje.val != null)
								{
									toti.removeElementAtIndex(toti.kje.val.drugi, toti.kje.val.en);
								}

								// console.log(toti.kje.val);
							}, data);


							this.moveSelectedPiece(pos.x, pos.y);
							this.unAnimatePartciles();


							var data = {myName: Cookie.get('eMail'), src: {x: pos1.x, y: pos1.y}, dest: {x: pos.x, y: pos.y}};
							data = "data=" + encodeURIComponent(JSON.stringify(data));

							
							ajax.POST("/iMoovedMyPiece", data, function(response)
							{
								// console.log(response);

							});

							
							// this.gameInfo.piece = null;
						}
					}
				}
				

				
			}


			// /*-------------------Temprary je to, ignoraj---------------------*/
			// if (this.mouse1.leftDown == true) 
			// {
			// 	intersects = this.rayCaster.intersectObjects( this.scene.children[4].children, true );

			// 	if (intersects.length > 0) 
			// 	{
			// 		// console.log(intersects[0].object.position.x);
			// 		this.gameInfo.travelToX = intersects[0].object.position.x - this.gameInfo.xMin;
			// 		this.gameInfo.travelToY = intersects[0].object.position.z - this.gameInfo.zMin;
			// 	}
			// }


			
		}

		requestAnimationFrame(this.update.bind(this));//Contonue
		this.renderer.render( this.scene, this.camera );//da loop
		// this.controls.update();
   			
	}

	render()
	{

		return(
				<div className='GameWindow isPaused' ref='GameWindow' onMouseUp={this.gameWindowMouseUp.bind(this)} onMouseDown={this.gameWindowMouseDown.bind(this)} onMouseMove={this.trackMouseMovements.bind(this)}>
					<Loader ref='Loader'/>
				</div>
		);
	}
}