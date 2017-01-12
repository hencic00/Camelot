import React from "react";
import ReactDOM from "react-dom";
import Cookie from 'js-cookie';


var THREE = require("three");

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
	}

	componentDidMount()
	{
		this.isReady = false;
		this.enemyIsReady = false;

		this.listenOnSocket();
		window.addEventListener("resize", this.resize.bind(this));

		var toti = this;
		
		this.rayCaster = new THREE.Raycaster();
		this.renderer = new THREE.WebGLRenderer();
		this.scene = new THREE.Scene();

		this.renderer.setSize(this.refs.GameWindow.offsetWidth, this.refs.GameWindow.offsetHeight);
		this.renderer.setPixelRatio( window.devicePixelRatio );

		this.camera = new THREE.PerspectiveCamera
		(
			45, //View angle
			this.refs.GameWindow.offsetWidth / this.refs.GameWindow.offsetHeight, //Aspect ratio
			0.1, //Near
			10000 //Far
		);
		this.scene.add(this.camera);

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

			mesh.rotation.y = -0.29;
			mesh.rotation.x = 0.49;
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


		skybox.rotation.y = -0.29;
		skybox.rotation.x = 0.49;

		this.scene.add( skybox );
		

		const pointLight = new THREE.PointLight(0xFFFFFF, 1.0);
		pointLight.position.x = 10;
		pointLight.position.y = 50;
		pointLight.position.z = 130;

		this.scene.add(pointLight);
	}

	resize()
	{
		this.camera.aspect = this.refs.GameWindow.offsetWidth / this.refs.GameWindow.offsetHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( this.refs.GameWindow.offsetWidth, this.refs.GameWindow.offsetHeights );
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

		var tmp = this.gameState1[prevPos.y][prevPos.x];
		this.gameState1[prevPos.y][prevPos.x] = "O";

		this.gameInfo.piece.position.z = this.gameInfo.zMin + y;
		this.gameInfo.piece.position.x = this.gameInfo.xMin + x;

		this.gameState1[y][x] = tmp;
	}

	movePieceAtIndex(srcX, srcY, destX, destY)
	{	
		var pos = this.boardToWorldCoords(srcX, srcY);
		var fig = null;
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
		fig.position.z = this.gameInfo.zMin + destY;
		fig.position.x = this.gameInfo.xMin + destX;


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
			['X', 10,11,12,13,14,15,16,17,18,19, 'X'],
			[20,21,22,23,24,25,26,27,28,29,30,31],
			[32,33,34,35,36,37,38,39,40,41,42,43],
			[44,45,46,47,48,49,50,51,52,53,54,55],
			[56,57,58,59,60,61,62,63,64,65,66,67],
			[68,69,70,71,72,73,74,75,76,77,78,79],
			[80,81,82,83,84,85,86,87,88,89,90,91],
			[92,93,94,95,96,97,98,99,100,101,102,103],
			[104,105,106,107,108,109,110,111,112,113,114,115],
			[116,117,118,119,120,121,122,123,124,125,126,127],
			[128,129,130,131,132,133,134,135,136,137,138,139],
			['X',140,141,142,143,144,145,146,147,148,149,'X'],
			['X','X',150,151,152,153,154,155,156,157,'X','X'],
			['X','X','X','X','X',158,159,'X','X','X','X','X',],
		];

		var hjn = this.gameStateToHJN(this.gameState1);

		var data = {pos: y + "," + x, castle: this.gameInfo.player, hjn: hjn};
		data = encodeURIComponent(JSON.stringify(data));
		data = "json=" + data;
		// console.log(data);

		var tiles = [];

		ajax.GET('/possibleMoves/', function(response)
		{
			var mozniPremiki = JSON.parse(response);
			console.log(mozniPremiki);

			// console.log(toti.scene.children[4].children[0]);
			for (var i = 0; i < mozniPremiki.length; i++) 
			{
				// toti.scene.children[4].children[0].children[pot[mozniPremiki[i].row - 1][mozniPremiki[i].col - 1]].isSelectable = true;
				// toti.scene.children[4].children[0].children[pot[mozniPremiki[i].row - 1][mozniPremiki[i].col - 1]].isHoverable = true;

				// toti.hardSelect(toti.scene.children[4].children[0].children[pot[mozniPremiki[i].row - 1][mozniPremiki[i].col - 1]]);
				
				tiles.push(toti.scene.children[4].children[0].children[pot[mozniPremiki[i].row - 1][mozniPremiki[i].col - 1]]);	

			}
			callback(tiles);

			
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

			newBoardGroup.rotation.y = -0.29;
			newBoardGroup.rotation.x = 0.49;
			newBoardGroup.position.z = -16.5;

			if (this.gameInfo.player == "+")
			{
				newBoardGroup.rotation.y += 3.14159;
				// this.scene.children[1].position.x -= 10.14159;
			}

			this.scene.add(newBoardGroup);

			
			
			
			this.refs.GameWindow.appendChild(this.renderer.domElement);
			// this.listenOnSocket();
			// this.startGame();
			// console.log(this.props.socket);

			// console.log(this.scene);
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
				toti.allObjectsAreLoaded();
			}
			else if (data.action == 'moviePiece')
			{

				console.log("Enemy je premakno figuro");
				toti.movePieceAtIndex(data.src.x, data.src.y, data.dest.x, data.dest.y);
			}
		});
	}
	

	startGame()
	{
		this.refs.GameWindow.children[0].style.display = "none";
		this.refs.GameWindow.classList.remove("isPaused");

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
		this.mouse.y = -( (e.pageY - this.refs.GameWindow.offsetTop) / this.refs.GameWindow.offsetHeight ) * 2 + 1;

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
				console.log(object.materialBuffer.length);
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

				for (var i = 0; i < material.materials.length; i++)
				{
					material.materials[i].color.setRGB(material.materials[i].color.r + offset.r, material.materials[i].color.g + offset.g, material.materials[i].color.b + offset.b);
				}
				object.material = material;
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
			for (var i = 0; i < this.scene.children[4].children[2].children.length; i++)
			{
				for (var j = 0; j < this.scene.children[4].children[2].children[i].children.length; j++)
				{
					this.scene.children[4].children[2].children[i].children[j].isHoverable = false;
					this.scene.children[4].children[2].children[i].children[j].isSelectable = false;	
				}
			}
		}
	}

	makeHoverableAndClickable(team)
	{
		if (team == "teamA")
		{

				// console.log(this.scene.children[4].children[1].children.length);	
			for (var i = 0; i < this.scene.children[4].children[2].children.length; i++)
			{
				for (var j = 0; j < this.scene.children[4].children[2].children[i].children.length; j++)
				{
					this.scene.children[4].children[2].children[i].children[j].isHoverable = true;
					this.scene.children[4].children[2].children[i].children[j].isSelectable = true;	
				}
			}
		}
	}


	update()
	{

		if (this.gameInfo.needsUpdate == true) 
		{
			this.scene.children[1].rotation.y -= (this.mouse1.prevX - this.mouse1.X) * .05;
			this.scene.children[1].rotation.x -= (this.mouse1.prevY - this.mouse1.Y) * .05;
			// this.scene.children[2].rotation.y -= (this.mouse1.prevX - this.mouse1.X) * .05;
			// this.scene.children[2].rotation.x -= (this.mouse1.prevY - this.mouse1.Y) * .05;
			this.scene.children[3].rotation.y -= (this.mouse1.prevX - this.mouse1.X) * .05;
			this.scene.children[3].rotation.x -= (this.mouse1.prevY - this.mouse1.Y) * .05;
			this.scene.children[4].rotation.y -= (this.mouse1.prevX - this.mouse1.X) * .05;
			this.scene.children[4].rotation.x -= (this.mouse1.prevY - this.mouse1.Y) * .05;
			// this.scene.children[4].rotation.y -= (this.mouse1.prevX - this.mouse1.X) * .05;
			// this.scene.children[4].rotation.x -= (this.mouse1.prevY - this.mouse1.Y) * .05;
			// this.scene.children[5].rotation.y -= (this.mouse1.prevX - this.mouse1.X) * .05;
			// this.scene.children[5].rotation.x -= (this.mouse1.prevY - this.mouse1.Y) * .05;
			// this.scene.children[6].rotation.y -= (this.mouse1.prevX - this.mouse1.X) * .05;
			// this.scene.children[6].rotation.x -= (this.mouse1.prevY - this.mouse1.Y) * .05;
			// this.scene.children[7].rotation.y -= (this.mouse1.prevX - this.mouse1.X) * .05;
			// this.scene.children[7].rotation.x -= (this.mouse1.prevY - this.mouse1.Y) * .05;

			this.gameInfo.needsUpdate = false;

			document.body.style.cursor = "auto";

		}
		else if(this.gameInfo.canSelect == true)
		{
			this.rayCaster.setFromCamera( this.mouse, this.camera );
			var intersects = this.rayCaster.intersectObjects( this.scene.children[4].children, true);

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
						if (this.gameInfo.piece == null)
						{
							this.hardSelect(intersects[0].object);
							this.gameInfo.piece = intersects[0].object;

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
							this.moveSelectedPiece(pos.x, pos.y);


							var data = {myName: Cookie.get('eMail'), src: {x: pos1.x, y: pos1.y}, dest: {x: pos.x, y: pos.y}};
							data = "data=" + encodeURIComponent(JSON.stringify(data));

							var ajax = new Ajax();
							ajax.POST("/iMoovedMyPiece", data, function(response)
							{
								console.log(response);
							});

							
							this.gameInfo.piece = null;
						}
					}
				}
				

				
			}


			/*-------------------Temprary je to, ignoraj---------------------*/
			if (this.mouse1.leftDown == true) 
			{
				intersects = this.rayCaster.intersectObjects( this.scene.children[4].children, true );

				if (intersects.length > 0) 
				{
					// console.log(intersects[0].object.position.x);
					this.gameInfo.travelToX = intersects[0].object.position.x - this.gameInfo.xMin;
					this.gameInfo.travelToY = intersects[0].object.position.z - this.gameInfo.zMin;
				}
			}


			
		}


		requestAnimationFrame(this.update.bind(this));//Contonue
		this.renderer.render( this.scene, this.camera );//da loop
   			
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