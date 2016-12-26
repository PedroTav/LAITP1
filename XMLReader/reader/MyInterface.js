/**
 * MyInterface
 * @constructor
 */
 
 
function MyInterface() {
	//call CGFinterface constructor 
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	
	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui

	this.gui = new dat.GUI();

	// add a button:
	// the first parameter is the object that is being controlled (in this case the scene)
	// the identifier 'doSomething' must be a function declared as part of that object (i.e. a member of the scene class)
	// e.g. LightingScene.prototype.doSomething = function () { console.log("Doing something..."); }; 	

	// add a group of controls (and open/expand by defult)

	this.luzes = this.gui.addFolder("Luzes");
	this.luzes.open();

	//luzes.add(this.scene, 'light1');
	
	var lightNames = Object.keys(this.scene.lightsBool);

	this.bool = true;

	for (var i = 0; i < lightNames.length; i++) {
		luzes.add(this.scene.lightsBool, lightNames[i]);
	}
// 	for (var i = 0; i < this.scene.lightsBool.length; i++) {
// 		luzes.add(this.scene.lightsBool, i);
// 	}
// 	for (var i = 0; i < this.scene.lightsBool.length; i++) {
// 		luzes.add(this.scene.lightsBool, i);
// 	}
// 	var i = 0;

	this.gui.add(this.scene, 'Player1', [ 'Human', 'AI', 'None'] );

	this.gui.add(this.scene, 'Player2', [ 'Human', 'AI', 'None'] );

	this.gui.add(this.scene, 'Player3', [ 'Human', 'AI', 'None'] );

	this.gui.add(this.scene, 'Player4', [ 'Human', 'AI', 'None'] );

	this.gui.add(this.scene, 'resetGame');

	this.gui.add(this.scene, 'currCamera', { Camera1: 0, Camera2: 1, Camera3: 2, Camera4: 3 })

	this.gui.add(this.scene, 'ambient', { Board: 'Board', Board2: 'Board2' } );

// 	this.scene.lightsBool.forEach(function(light){
// 		luzes.add(this.scene, this.i);
// 		this.i++;
// 	})

	//luzes.add(this.scene, 'bool');

	/*for(var i = 0; i < this.scene.booleans.length; i++)
	{
		var string = 'booleans[' + i + ']';
		luzes.add(this.scene, string);
	}*/

	/*for(var i = 0; i < this.scene.lights.length; i++)
	{
		var string = 'lightsBool[' + i + ']';
		luzes.add(this.scene, string);
	}*/

	// add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
	// e.g. this.option1=true; this.option2=false;
	
	// add a slider
	// must be a numeric variable of the scene, initialized in scene.init e.g.
	// this.speed=3;
	// min and max values can be specified as parameters

	return true;
};

/**
 * processKeyboard
 * @param event {Event}
 */
MyInterface.prototype.processKeyboard = function(event) {
	// call CGFinterface default code (omit if you want to override)
	CGFinterface.prototype.processKeyboard.call(this,event);
	
	// Check key codes e.g. here: http://www.asciitable.com/
	// or use String.fromCharCode(event.keyCode) to compare chars
	
	// for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp
	switch (event.keyCode)
	{
		case (65):	//A
			this.scene.component.changePoint("left");
			break;
		case (97):
			this.scene.component.changePoint("left");		
			break;
		case (68):	//D
			this.scene.component.changePoint("right");	
			break;
		case (100):
			this.scene.component.changePoint("right");	
			break;
		case (87):	//W	
			this.scene.component.changePoint("up");
			break;
		case (119):
			this.scene.component.changePoint("up");		
			break;
		case (83):	//C	
			this.scene.component.changePoint("down");
			break;
		case (115):
			this.scene.component.changePoint("down");	 	
			break;
		case(86):
			this.scene.updateCameras();
			break;
		case(118):
			this.scene.updateCameras();
			break;
		case(77):
			this.scene.component.updateMaterials();
			break;
		case(109):
			this.scene.component.updateMaterials();
			break;
	};
};

MyInterface.prototype.update = function()
{
	if(this.bool)
	{
		var lightNames = Object.keys(this.scene.lightsBool);
		
		for (var i = 0; i < lightNames.length; i++) {
			this.luzes.add(this.scene.lightsBool, lightNames[i]);
		}

		if(lightNames.length > 0)
		{
			this.bool = false;
		}
	}
}