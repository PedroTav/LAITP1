
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

    /*this.appearance = new CGFappearance(this);
    this.appearance.loadTexture("textures/floor.png");*/

    //this.quad = new MyQuad(this, 1, 2, 1, 2);

	var controlpoints = [	// U = 0
						[ // V = 0..3;
							 [ -2.0, -2.0, 0, 1 ],
							 [ -2.0, -1.0, 0, 1 ],
							 [ -2.0, 1.0, 0, 1 ],
							 [ -2.0, 2.0, 0, 1 ]
						],
						// U = 1
						[ // V = 0..3
							 [ 0, -2.0, 0, 1 ],
							 [ 0, 0, 4, 1 ],
							 [ 0, 0, 4, 1 ],
							 [ 0, 2.0, 0, 1 ]
						],
						// U = 2
						[ // V = 0..3
							 [ 2.0, -2.0, 0, 1 ],
							 [ 2.0, -1.0, 0, 1 ],
							 [ 2.0, 1.0, 0, 1 ],
							 [ 2.0, 2.0, 0, 1 ]
						]
					];

					console.log(controlpoints);


	this.plane = new Plane(this, 7, 4, 6, 6);
	this.patch = new Patch(this, 2, 3, 10, 10, controlpoints);

	var controlvector = [];

	controlvector.push(new Coords(0, 0, -2));
	controlvector.push(new Coords(0, 0, 1));
	controlvector.push(new Coords(1, 0, 1));
	//controlvector.push(new Coords(4, 4, 3));
	//controlvector.push(new Coords(3, 3, 3));


	this.linearAnimation = new LinearAnimation(controlvector, 10000);
	this.circularAnimation = new CircularAnimation(new Coords(3, 0, 0), 5, Math.PI/4, Math.PI/2, 10000);

	this.dt = 0;

	var d = new Date();

	this.previousTime = d.getTime();

    this.bool = true;

    this.booleans = [];

	this.booleans.push(true);
	this.booleans.push(true);
	this.booleans.push(true);

	this.lightsID = [];

//     this.lightsBool = [];

//     for(var i = 0; i < this.lights.length; i++)
//     {
//     	this.lightsBool.push(false);
//     }
	this.lightsBool = {};

//     for(var i = 0; i < this.lights.length; i++)
//     {
//     	this.lightsBool['light' + i] = false;
//     }

    this.cameras = [];
    this.currCamera = 0;

    this.enableTextures(true);
	
	this.axis=new CGFaxis(this);

	this.setUpdatePeriod(100);
};

XMLscene.prototype.initLights = function () {

	/*this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();*/
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

	this.pushMatrix();
	/*this.translate(0, 0, 2);
	this.appearance.apply();
	this.quad.display();*/
	this.component.display();
	//this.graph.textures[0].applyTexture();

	//console.log(this.linearAnimation.getPosition(this.dt));

	//this.linearAnimation.getPosition(this.dt).apply(this);
	//this.circularAnimation.getPosition(this.dt).apply(this);
	//this.patch.display();
	//this.graph.textures[0].applyTexture();
	//this.plane.display();
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
}