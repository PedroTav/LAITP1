

function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

	this.transf;

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.component = new MyComponent(this);

	//test
	this.test = new MyPieceModel(this, 10, 2, 1, 1, 1);

	this.Player1 = "Human";
	this.Player2 = "Human";
	this.Player3 = "Human";
	this.Player4 = "Human";
	
	this.dt = 0;

	this.state = 0;
	this.gameOver = false;
	
	this.lastPieceSize = "small";

	this.alertDone = false;

	this.board = "[[[b0,m0,s0],[b0,m0,s0],[b0,m0,s0]],[[b0,m0,s0],[b0,m0,s0],[b0,m0,s0]],[[b0,m0,s0],[b0,m0,s0],[b0,m0,s0]]]";

	var d = new Date();

	this.previousTime = d.getTime();
	this.previousCheckTime = d.getTime();
	this.previousPlayTime = d.getTime();

	this.lightsID = [];

	this.boardLine = 1;
	this.boardColumn = 1;

	this.playerWin = 0;

	this.tie = false;

	this.lightsBool = {};

	this.players = [
		new Player(this, 0),
		new Player(this, 1),
		new Player(this, 2),
		new Player(this, 3)
	];

	this.hitboxes = [
		
		new Plane(this, 3.33, 3.33, 1, 1, -3.33, -3.33),
		new Plane(this, 3.33, 3.33, 1, 1, -3.33, 0),
		new Plane(this, 3.33, 3.33, 1, 1, -3.33, 3.33),
		new Plane(this, 3.33, 3.33, 1, 1, 0, -3.33),
		new Plane(this, 3.33, 3.33, 1, 1, 0, 0),
		new Plane(this, 3.33, 3.33, 1, 1, 0, 3.33),
		new Plane(this, 3.33, 3.33, 1, 1, 3.33, -3.33),
		new Plane(this, 3.33, 3.33, 1, 1, 3.33, 0),
		new Plane(this, 3.33, 3.33, 1, 1, 3.33, 3.33)
	
	];

	this.playerType = [
		"Human",
		"Human",
		"Human",
		"Human"
	];

	this.ambient = "Board";
	this.currambient = "Board";
	

	this.currentPlayer = 0;

    this.cameras = [];
    this.defaultCameras = [
    	new CGFcamera(0.4, 0.1, 500, vec3.fromValues(35, 35, 35), vec3.fromValues(0, 0, 0)),
    	new CGFcamera(0.4, 0.1, 500, vec3.fromValues(-35, 35, 35), vec3.fromValues(0, 0, 0)),
    	new CGFcamera(0.4, 0.1, 500, vec3.fromValues(-35, 35, -35), vec3.fromValues(0, 0, 0)),
    	new CGFcamera(0.4, 0.1, 500, vec3.fromValues(35, 35, -35), vec3.fromValues(0, 0, 0))
    ];
    this.currCamera = 0;
    this.lastCamera = 0;

    this.enableTextures(true);
	
	this.axis=new CGFaxis(this);

	this.setUpdatePeriod(20);

	this.setPickEnabled(true);
};

XMLscene.prototype.initLights = function () {

	/*this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();*/
};

XMLscene.prototype.logPicking = function ()
{
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj)
				{
					if(this.state == 0 && obj instanceof MyPiece && !obj.played && obj.playerId == this.currentPlayer)
					{
						obj.picked = true;

						this.state++;
					}
					else if(this.state == 1 && obj instanceof Plane)
					{
						if(this.currentPlayer >= 0 && this.currentPlayer < 4)
						{
							for(var i = 0; i < this.players[this.currentPlayer].pieces.length; i++)
							{
								if(this.players[this.currentPlayer].pieces[i].picked)
								{
									var x = obj.x;
									var z = obj.z;

									this.boardCoords(x,z);		

									if(this.notpossible(obj, this.players[this.currentPlayer].pieces[i].size)) break;

									this.lastPieceSize = this.players[this.currentPlayer].pieces[i].size;

									this.checkMove(this.players[this.currentPlayer].pieces[i].size);

								

									var x2 = this.players[this.currentPlayer].pieces[i].x;
									var z2 = this.players[this.currentPlayer].pieces[i].z + 1;

									var xF = x - x2;
									var zF = z - z2;


									var anim = new ArcAnimation([new Coords(0, 0, 0), new Coords(xF, 0, zF)],2,1000);

									this.players[this.currentPlayer].pieces[i].addAnimation(anim);

									this.state = 2;

									this.players[this.currentPlayer].pieces[i].picked = false;


									this.currentPlayer++;
									

									if(this.currentPlayer == 4)
										{
											this.currentPlayer = 0;
											break;
										}

									console.log("asd");
						
									
								}
							}
						}			
					}
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}		
	}
}

XMLscene.prototype.notpossible = function(plane, size) {

	switch(size){

		case "big": if(!plane.stateBig) {
					plane.stateBig = true;
					return false;
					} else return true;

		case "medium": if(!plane.stateMedium) {
					plane.stateMedium = true;
					return false;
					} else return true;

		case "small": if(!plane.stateSmall) {
					plane.stateSmall = true;
					return false;
					} else return true;

	}

}

XMLscene.prototype.boardCoords = function(x, y){
		
	switch(x){
		
		case 3.33: this.boardLine = 1;
		break;
		case 0: this.boardLine = 2;
		break;
		case -3.33: this.boardLine = 3;
		break;
	}	

	switch(y){
		
		case 3.33: this.boardColumn = 1;
		break;
		case 0: this.boardColumn = 2;
		break;
		case -3.33: this.boardColumn = 3;
		break;
	}


};

XMLscene.prototype.trackPieces = function(){

	var count = 0;
		
	for(var i = 0; i < this.players.length; i++){
		
		for(var j = 0; j < this.players[i].pieces.length; j++){

			if(!this.players[i].pieces[j].played) count++;

		}

	}

	if(count == 9){

		this.gameOver = true;
		this.tie = true;
	}

};

XMLscene.prototype.planeOccupied = function(x, y, size){
		
	switch(x){
		
		case 1: this.planeLine = 3.33;
		break;
		case 2: this.planeLine = 0;
		break;
		case 3: this.planeLine = -3.33;
		break;
	}	

	switch(y){
		
		case 1: this.planeColumn = 3.33;
		break;
		case 2: this.planeColumn = 0;
		break;
		case 3: this.planeColumn = -3.33;
		break;
	}

	for(var i = 0; i < this.hitboxes.length; i++){

		if(this.hitboxes[i].x == this.planeLine && this.hitboxes[i].z == this.planeColumn) {
				
			switch(size){

					case "big": if(!this.hitboxes[i].stateBig) {
						this.hitboxes[i].stateBig = true;
						return false;
						} else return true;

					case "medium": if(!this.hitboxes[i].stateMedium) {
						this.hitboxes[i].stateMedium = true;
						return false;
						} else return true;

					case "small": if(!this.hitboxes[i].stateSmall) {
						this.hitboxes[i].stateSmall = true;
						return false;
						} else return true;
			}

		}

	}

};




XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	/*this.lights[0].setVisible(true);
    this.lights[0].enable();*/
    this.setAmbient(this.graph.illumination.ambient.r,this.graph.illumination.ambient.g,this.graph.illumination.ambient.b,this.graph.illumination.ambient.a);

    //Load Axis
    this.axis = new CGFaxis(this, this.graph.axisLength);

    //Load Camera

	for(var i = 0; i < this.graph.cameras.length; i++)
	{
		this.cameras.push(this.graph.cameras[i]);
	}

	this.camera = this.cameras[this.currCamera];

    this.interface.setActiveCamera(this.camera);

    //Load lights

    for(var i = 0; i < this.graph.lights.length; i++)
    {
    	this.lights.push(this.graph.lights[i]);
    	this.lightsID.push(this.graph.lightsID[i]);
    	this.lightsBool[this.lightsID[i]] = this.graph.lightsBool[this.lightsID[i]];
    }

    //Load components

    this.component = this.graph.rootElement;
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
	this.logPicking();

	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();


	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		for(var i = 0; i < this.lights.length; i++)
		{
			this.lights[i].update();
		}
	};	

	this.updateLights();

	// Displays


	for (i =0; i<this.players.length; i++) {
		this.pushMatrix();
		this.players[i].display();
		this.popMatrix();
	}

	this.clearPickRegistration();

	this.appearance1 = new CGFappearance(this);
	this.appearance2 = new CGFappearance(this);
	this.appearance1.setAmbient(1,1,1,1);
	this.appearance1.setAmbient(0,0,0,1);

	for (i = 0; i<this.hitboxes.length; i++) {
		this.pushMatrix();
		this.translate(this.hitboxes[i].x,0,this.hitboxes[i].z);
		this.rotate(-1*Math.PI/2, 1,0,0);
		if (this.state == 1)
			this.registerForPick(i+1+this.players.length*9, this.hitboxes[i]);
		if(i % 2 == 0) this.appearance1.apply();
		else this.appearance2.apply();
		this.hitboxes[i].display();
		this.popMatrix();
	}

	this.clearPickRegistration();
	
	this.pushMatrix();
	this.component.display();
	this.popMatrix();



};

XMLscene.prototype.setInterface = function(interface)
{
	this.interface = interface;
}

XMLscene.prototype.updateCameras = function()
{
	if(this.currCamera == this.cameras.length - 1)
	{
		this.currCamera = 0;
	}
	else
	{
		this.currCamera++;
	}

	this.camera = this.cameras[this.currCamera];

	this.interface.setActiveCamera(this.camera);
}

XMLscene.prototype.updateLights = function()
{
	for(var i = 0; i < this.lightsID.length; i++)
	{
		if(this.lightsBool[this.lightsID[i]] == true)
		{
			this.lights[i].enable();
		}
		else
		{
			this.lights[i].disable();
		}

		this.lights[i].update();
	}
}

XMLscene.prototype.update = function(currTime)
{
	this.dt = currTime - this.previousTime;

	this.previousTime = currTime;

	this.component.update(this.dt);

	this.updateDefaultCamera(this.dt);

	this.updateAmbient();

	if(this.playerType[this.currentPlayer] == "None")
	{
		this.currentPlayer++;

		if(this.currentPlayer == 4)
		{
			this.currentPlayer = 0;
		}
	}

	if(this.gameOver && !this.alertDone && this.state == 0)
	{
		if(this.tie)
		{
			alert("It's a TIE!!");
		}
		else
		{
			for(var i = 0; i < this.players.length; i++)
			{
				if(this.players[i].won)
				{
					if(i == 0)
					{
						alert("Player " + 4 + " wins!");
					}
					else
					{
						alert("Player " + (i) + " wins!");
					}
				}
			}
		}

		this.alertDone = true;
	}

	if(!this.gameOver && currTime > this.previousCheckTime + 200)
	{
		this.checkWin(this.lastPieceSize); 
		this.previousCheckTime = currTime;
	}


	if(!this.gameOver && this.state < 2 && currTime > this.previousPlayTime + 1500){ 

		if(this.playerType[this.currentPlayer] == "AI" && this.state == 0){
		
			var line = Math.floor(Math.random() * (4 - 1) + 1);
			var column = Math.floor(Math.random() * (4 - 1) + 1);

			var random = Math.floor(Math.random() * (9 - 0) + 0);

			var i = 0;

			while(this.players[this.currentPlayer].pieces[random].played || this.planeOccupied(line, column, this.players[this.currentPlayer].pieces[random].size) ){

				line = Math.floor(Math.random() * (4 - 1) + 1);
				column = Math.floor(Math.random() * (4 - 1) + 1);

				random = Math.floor(Math.random() * (9 - 0) + 0);

				if(this.gameOver)
				{
					return;
				}

				this.trackPieces();

				if(i == 1000)
				{
					this.gameOver = true;
					this.tie = true;
				}

				i++;
			}

			this.boardLine = line;
			this.boardColumn = column;

			this.lastPieceSize = this.players[this.currentPlayer].pieces[random].size;

			this.checkMove(this.players[this.currentPlayer].pieces[random].size);

			var x2 = this.players[this.currentPlayer].pieces[random].x;
			var z2 = this.players[this.currentPlayer].pieces[random].z + 1;

			var xF = this.planeLine - x2;
			var zF = this.planeColumn - z2;

			var anim = new LinearAnimation([new Coords(0, 0, 0), new Coords(xF, 0, zF)], 1000);

			this.players[this.currentPlayer].pieces[random].addAnimation(anim);

			this.state = 2;

			this.players[this.currentPlayer].pieces[random].picked = false;


			this.currentPlayer++;


			if(this.currentPlayer == 4)
				{
					this.currentPlayer = 0;
				}

		}

		this.previousPlayTime = currTime;

	}

	if(!this.gameOver) this.trackPieces();

	
	for(var i = 0; i < this.players.length; i++)
	{
		this.players[i].update(this.dt);
	}
}

function getPrologRequest(requestString, onSuccess, scene, onError, port)
	{
		var requestPort = port || 8081
		var request = new XMLHttpRequest();
		request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);
		request.scene = scene;

		request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
		request.onerror = onError || function(){console.log("Error waiting for response");};

		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.send();
	}
	
function makeRequest()
	{
		// Get Parameter Values
		var requestString = "helloworld"; 		
		
		// Make Request
		getPrologRequest(requestString, handleReply);
	}

XMLscene.prototype.startBoard = function()
 {
	var requestString = "makeBoard";
	
	getPrologRequest(requestString, handleReplyStartBoard, this);
	console.log(this.board);
		
	
 }

	//Handle the Reply
function handleReply(data){
		console.log(data.target.response);
	}
	
function handleReplyStartBoard(data){
			
		this.scene.board = data.target.response;
		console.log(this.scene);
			
	}
	
XMLscene.prototype.setBoard = function(board){

	this.board = board;
	
}

XMLscene.prototype.checkMove = function(size)
 {
	var requestString = "makePlayJAVA(" + (this.currentPlayer+1) + "," + size + "," + this.boardLine + "," + this.boardColumn + "," + this.board + ")";
	
	console.log(requestString);
	
	getPrologRequest(requestString, handleReplyCheckMove, this);

	return this.moveOK;
	
 }

function handleReplyCheckMove(data){
			
		var board = data.target.response;

		if(board != "[]"){
		
			this.scene.board = board;
		}
}

XMLscene.prototype.checkWin = function(size)
 {
	var player = this.currentPlayer;

	this.playerWin = this.currentPlayer;

	if(player == 0) player = 4;

	var requestString = "checkJAVAWin(" + player + "," + size + "," + this.board + "," + this.boardLine + "," + this.boardColumn + ")";
	
	console.log(requestString);
	
	getPrologRequest(requestString, handleReplyCheckWin, this);

	
 }

 function handleReplyCheckWin(data){
			
		var response = data.target.response;

		if(response == "winner"){
		
			this.scene.gameOver = true;
			this.scene.players[this.scene.playerWin].won = true;
		}
}

XMLscene.prototype.resetGame = function()
{
	this.playerType[0] = this.Player1;
	this.playerType[1] = this.Player2;
	this.playerType[2] = this.Player3;
	this.playerType[3] = this.Player4;

	this.dt = 0;

	this.state = 0;
	this.gameOver = false;
	
	this.lastPieceSize = "small";

	this.alertDone = false;

	this.board = "[[[b0,m0,s0],[b0,m0,s0],[b0,m0,s0]],[[b0,m0,s0],[b0,m0,s0],[b0,m0,s0]],[[b0,m0,s0],[b0,m0,s0],[b0,m0,s0]]]";

	var d = new Date();

	this.previousTime = d.getTime();
	this.previousCheckTime = d.getTime();
	this.previousPlayTime = d.getTime();

	this.boardLine = 1;
	this.boardColumn = 1;

	this.playerWin = 0;

	this.tie = false;

	this.currentPlayer = 0;

	for(var i = 0; i < this.players.length; i++)
	{
		this.players[i].reset();
	}

	for(var i = 0; i < this.hitboxes.length; i++)
	{
		this.hitboxes[i].reset();
	}
}

XMLscene.prototype.updateDefaultCamera = function(dt)
{
	if(this.currCamera != this.lastCamera)
	{
		this.changingCamera = true;

		var x = this.defaultCameras[this.lastCamera].position[0];
		var z = this.defaultCameras[this.lastCamera].position[2];

		var x2 = this.defaultCameras[this.currCamera].position[0];
		var z2 = this.defaultCameras[this.currCamera].position[2];

		this.cameraAnimation = new LinearAnimation([new Coords(x, 35, z), new Coords(x2, 35, z2)], 1000);
	}

	if(this.changingCamera)
	{
		var currentAnimation = this.cameraAnimation.getPosition(dt);
		var x = currentAnimation.transformations[1].x;
		var z = currentAnimation.transformations[1].z;

		if(this.cameraAnimation.over)
		{
			this.changingCamera = false;
		}

		var fov = this.defaultCameras[this.currCamera].fov;
		var near = this.defaultCameras[this.currCamera].near;
		var far = this.defaultCameras[this.currCamera].far;
		var target = this.defaultCameras[this.currCamera].target;

		this.camera = new CGFcamera(fov, near, far, vec3.fromValues(x, 35, z), target);
	}
	else
	{
		this.camera = this.defaultCameras[this.currCamera];
	}

    this.interface.setActiveCamera(this.camera);

    this.lastCamera = this.currCamera;
}

XMLscene.prototype.updateAmbient = function() {

	this.currambient = this.ambient;

}