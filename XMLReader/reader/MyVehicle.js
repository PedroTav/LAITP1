/**
 * MyVehicle
 * @constructor
 */
 function MyVehicle(scene) {
 	CGFobject.call(this, scene);

 	var controlpoints1 = [
 							[
 								[ -1.0, -1.0, 0.0, 1 ],
							 	[ -1.0, 1.0, 0.0, 1 ]
 							],
 							[ 
							 	[ 0, -1.0, 1.0, 1 ],
							 	[ 0, 1.0, 1.0, 1 ]						 
							],
							[						 
							 	[ 2.0, -1.5, 1.5, 1 ],
							 	[ 2.0, 1.5, 1.5, 1 ]
							]
 						 ];

 	var controlpoints2 = [
 							[
 								[ -1.0, -1.0, 0.0, 1 ],
 								[ -1.5, -1.5, 0.0, 1 ],
 								[ -1.5, 1.5, 0.0, 1 ],
							 	[ -1.0, 1.0, 0.0, 1 ]
 							],
 							[ 
							 	[ 0, -1.0, 1.0, 1 ],
							 	[ 0, -1.5, 3, 1 ],
							 	[ 0, 1.5, 3, 1 ],
							 	[ 0, 1.0, 1.0, 1 ]						 
							],
							[						 
							 	[ 2.0, -1.5, 1.0, 1 ],
							 	[ 2.5, -2.0, 3, 1 ],
							 	[ 2.5, 2.0, 3, 1 ],
							 	[ 2.0, 1.5, 1.0, 1 ]
							]
 						 ];


	console.log("control: " + this.controlpoints);
	this.window1 = new Patch(this.scene, 2, 1, 10, 10, controlpoints1);
 	this.chassy1 = new Patch(this.scene, 2, 3, 10, 10, controlpoints2);
	
	this.wheel = new MyCylinderWithTops(this.scene, 50, 5, 1, 1, 1);


	this.testAppearance = new CGFappearance(scene);
	this.testAppearance.setAmbient(0.3,0.3,0.3,1);
	this.testAppearance.setDiffuse(0.9,0.9,0.9,1);
	this.testAppearance.setSpecular(0.0,0.8,0.0,1);	
	this.testAppearance.setShininess(120);

 }

 MyVehicle.prototype = Object.create(CGFobject.prototype);
 MyVehicle.prototype.constructor = MyVehicle;

 MyVehicle.prototype.display = function() {

	var degToRad = Math.PI / 180.0;

 	this.scene.pushMatrix();
 	this.scene.translate(0,2,0);
 	this.scene.scale(0.85,0.85,0.85);
 	this.chassy1.display();
 	this.testAppearance.apply();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 	//this.chassy2.display();
 	this.testAppearance.apply();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 	this.scene.scale(1,1.5,1);
 	this.scene.translate(0,-0.5,0);
 	this.scene.rotate(90*degToRad,1,0,0);
 	//this.wheel.display();
 	this.scene.popMatrix();
 	
 }
