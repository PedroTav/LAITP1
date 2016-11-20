/**
 * Vehicle
 * @constructor
 */
 function Vehicle(scene, slices, stacks) {
 	CGFobject.call(this, scene);

 	
	this.veh = new MyVehicle(this.scene, slices, stacks);

 }

 Vehicle.prototype = Object.create(CGFobject.prototype);
 Vehicle.prototype.constructor = Vehicle;

 Vehicle.prototype.display = function() {

	var degToRad = Math.PI / 180.0;

 	this.scene.pushMatrix();
 	this.scene.scale(0.2,0.2,0.2);
 	this.scene.rotate(90*degToRad,0,0,1);
 	this.scene.rotate(90*degToRad,0,1,0);
 	this.veh.display();
 	this.scene.popMatrix();



 }
