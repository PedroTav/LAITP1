
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

    this.enableTextures(true);

	this.axis=new CGFaxis(this);
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
	var posFrom = [this.graph.camera.from.x, this.graph.camera.from.y, this.graph.camera.from.z];
	var posTo = [this.graph.camera.to.x, this.graph.camera.to.y, this.graph.camera.to.z]

    this.camera = new CGFcamera(this.graph.camera.angle, this.camera.near, this.camera.far, posFrom, posTo);

    this.interface.setActiveCamera(this.camera);

    //Load lights

    for(var i = 0; i < this.graph.lights.length; i++)
    {
    	this.lights.push(this.graph.lights[i]);
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

	// Displays

	this.pushMatrix();
	/*this.translate(0, 0, -2);
	this.appearance.apply();
	this.quad.display();*/
	this.component.display();
	this.popMatrix();

};

XMLscene.prototype.setInterface = function(interface)
{
	this.interface = interface;
}