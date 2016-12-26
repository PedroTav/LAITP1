

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
	
	this.dt = 0;

	this.state = 0;
	
	this.lastPieceSize = "small";

	console.log("STARTING: ");
	//this.startBoard();

	this.board = "[[[b0,m0,s0],[b0,m0,s0],[b0,m0,s0]],[[b0,m0,s0],[b0,m0,s0],[b0,m0,s0]],[[b0,m0,s0],[b0,m0,s0],[b0,m0,s0]]]";

	
	var d = new Date();

	this.previousTime = d.getTime();
	this.previousCheckTime = d.getTime();

	this.lightsID = [];

	this.boardLine = 1;
	this.boardColumn = 1;


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
		"AI",
		"AI",
		"AI",
		"AI"
	];
	

	this.currentPlayer = 0;

    this.cameras = [];
    this.currCamera = 0;

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


									var anim = new LinearAnimation([new Coords(0, 0, 0), new Coords(xF, 0, zF)], 1000);

									this.players[this.currentPlayer].pieces[i].addAnimation(anim);

									this.state = 2;

									this.players[this.currentPlayer].pieces[i].picked = false;


									this.currentPlayer++;
									

									if(this.currentPlayer == 4)
										{
											this.currentPlayer = 0;
											break;
										}
						
									
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

		this.state = 3;
		alert("It's a TIE!!");
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

	for (i = 0; i<this.hitboxes.length; i++) {
		this.pushMatrix();
		this.translate(this.hitboxes[i].x,0.1,this.hitboxes[i].z);
		this.rotate(-1*Math.PI/2, 1,0,0);
		if (this.state == 1)
			this.registerForPick(i+1+this.players.length*9, this.hitboxes[i]);
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


	if(this.state < 2 && currTime > this.previousCheckTime + 200){ 
		this.checkWin(this.lastPieceSize); 
		this.previousCheckTime = currTime;

		if(this.playerType[this.currentPlayer] == "AI" && this.state == 0){
		
			var line = Math.floor(Math.random() * (4 - 1) + 1);
			var column = Math.floor(Math.random() * (4 - 1) + 1);

			var random = Math.floor(Math.random() * (9 - 0) + 0);

			console.log("RANDOM: " + random);

			while(this.players[this.currentPlayer].pieces[random].played || this.planeOccupied(line, column, this.players[this.currentPlayer].pieces[random].size) ){

				 line = Math.random() * (4 - 1) + 1;
				 column = Math.random() * (4 - 1) + 1;

				 random = Math.random() * (9 - 0) + 0;
			}

			console.log("planeLine: " + this.planeLine);
			console.log("planeColumn: " + this.planeColumn);

			this.boardLine = line;
			this.boardColumn = column;

			this.lastPieceSize = this.players[this.currentPlayer].pieces[random].size;

			this.checkMove(this.players[this.currentPlayer].pieces[random].size);

			var x2 = this.players[this.currentPlayer].pieces[random].x;
			var z2 = this.players[this.currentPlayer].pieces[random].z + 1;

			var xF = this.planeLine - x2;
			var zF = this.planeColumn - z2;

			console.log("xF: " + xF);
			console.log("zF: " + zF);

			console.log("x2: " + x2);
			console.log("z2: " + z2);

			var anim = new LinearAnimation([new Coords(0, 0, 0), new Coords(xF, 0, zF)], 1000);

			console.log("ANIMATION: " + anim);

			this.players[this.currentPlayer].pieces[random].addAnimation(anim);

			this.state = 2;

			this.players[this.currentPlayer].pieces[random].picked = false;


			this.currentPlayer++;


			if(this.currentPlayer == 4)
				{
					this.currentPlayer = 0;
				}

	}

	}

	if(this.state != 3) this.trackPieces();

	
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

	if(player == 0) player = 4;

	var requestString = "checkJAVAWin(" + player + "," + size + "," + this.board + "," + this.boardLine + "," + this.boardColumn + ")";
	
	console.log(requestString);
	
	getPrologRequest(requestString, handleReplyCheckWin, this);

	
 }

 function handleReplyCheckWin(data){
			
		var response = data.target.response;

		if(response == "winner"){
		
			this.scene.state = 3;	
			alert("Player " + (this.scene.currentPlayer+1) + " wins!");
		}


}