
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

	var d = new Date();

	this.previousTime = d.getTime();

	this.lightsID = [];


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


//test


	/*this.pushMatrix();
	this.translate(0,0,2);
	this.test.display();
	this.popMatrix();*/


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

	for(var i = 0; i < this.players.length; i++)
	{
		this.players[i].update(this.dt);
	}
}