
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

    this.rectangle = [];
    this.triangle = [];
    this.cylinder = [];
    this.sphere = [];
    this.torus = [];

    this.component = [];

	this.axis=new CGFaxis(this);
};

XMLscene.prototype.initLights = function () {

	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
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
	this.lights[0].setVisible(true);
    this.lights[0].enable();
    this.setAmbient(this.graph.illumination.ambient.r,this.graph.illumination.ambient.g,this.graph.illumination.ambient.b,this.graph.illumination.ambient.a);

    //Load Axis
    this.axis.length = this.graph.axisLength;

    //Load Camera
	var posFrom = [this.graph.camera.from.x, this.graph.camera.from.y, this.graph.camera.from.z];
	var posTo = [this.graph.camera.to.x, this.graph.camera.to.y, this.graph.camera.to.z]

    this.camera = new CGFcamera(this.graph.camera.angle, this.camera.near, this.camera.far, posFrom, posTo);

    this.interface.setActiveCamera(this.camera);

    //Load Primites
    //this.rectangle = new MyQuad(this, -0.5, -0.5, 0.5, 0.5);

	//Load rectangles
    
    for(var i = 0; i < this.graph.rectangleID; i++)
    {
    	this.rectangle[i] = this.graph.rectangle[i];
    }

	//Load Triangles

    for(var i = 0; i < this.graph.triangleID; i++)
    {
    	this.triangle[i] = this.graph.triangle[i];
    }

	//Load Cylinders
    
    for(var i = 0; i < this.graph.cylinderID; i++)
    {
    	this.cylinder[i] = this.graph.cylinder[i];
    }

	//Load Spheres

    for(var i = 0; i < this.graph.sphereID; i++)
    {
    	this.sphere[i] = this.graph.sphere[i];
    }

	//Load Torus
    
    for(var i = 0; i < this.graph.torusID; i++)
    {
    	this.torus[i] = this.graph.torus[i];
    }

    //Load components

	for(var i = 0; i < this.graph.object.length; i++)
    {
    	this.component.push(this.graph.object[i]);
    }
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
		this.lights[0].update();
	};	

	// Displays

	//Display rectangles
	/*for(var i = 0; i < this.rectangle.length; i++)
	{
		this.pushMatrix();
		this.rectangle[i].display();
		this.popMatrix();
	}*/

	for(var i = 0; i < this.component.length; i++)
	{
		this.pushMatrix();
		this.component[i].display();
		this.popMatrix();
	}

};

XMLscene.prototype.setInterface = function(interface)
{
	this.interface = interface;
}