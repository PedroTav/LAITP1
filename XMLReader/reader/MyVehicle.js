/**
 * MyVehicle
 * @constructor
 */
 function MyVehicle(scene) {
 	CGFobject.call(this, scene);

 	var controlpoints1 = [
 							[
 								[ -1.0, -1.0, 0.0, 1 ],
 								[ -1.5, -1.5, 0.0, 1 ],
 								[ -1.5, 1.5, 0.0, 1 ],
							 	[ -1.0, 1.0, 0.0, 1 ]
 							],
 							[ 
							 	[ 0, -1.0, 0.0, 1 ],
							 	[ 0, -1.5, 3, 1 ],
							 	[ 0, 1.5, 3, 1 ],
							 	[ 0, 1.0, 0.0, 1 ]						 
							],
							[						 
							 	[ 2.5, -1.5, 0.0, 1 ],
							 	[ 2.5, -2.0, 3, 1 ],
							 	[ 2.5, 2.0, 3, 1 ],
							 	[ 2.5, 1.5, 0.0, 1 ]
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
							 	[ 0, -1.0, 0.0, 1 ],
							 	[ 0, -1.5, 2, 1 ],
							 	[ 0, 1.5, 2, 1 ],
							 	[ 0, 1.0, 0.0, 1 ]						 
							],
							[						 
							 	[ 2.5, -1.5, 0.0, 1 ],
							 	[ 2.5, -2.0, 2, 1 ],
							 	[ 2.5, 2.0, 2, 1 ],
							 	[ 2.5, 1.5, 0.0, 1 ]
							]
 						 ];
 	
 	var controlpoints3 = [
 							[
 								[ -4.0, -0.0, -3.0, 1 ],
 								[ -4.5, -0.0, -3.0, 1 ],
 								[ -4.5, 0.0, -3.0, 1 ],
							 	[ -4.0, 0.0, -3.0, 1 ]
 							],
 							[ 
							 	[ 0, -1.0, 0.0, 1 ],
							 	[ 0, -1.5, 2, 1 ],
							 	[ 0, 1.5, 2, 1 ],
							 	[ 0, 1.0, 0.0, 1 ]						 
							],
							[						 
							 	[ 2.5, -1.5, 0.0, 1 ],
							 	[ 2.5, -2.0, 2, 1 ],
							 	[ 2.5, 2.0, 2, 1 ],
							 	[ 2.5, 1.5, 0.0, 1 ]
							]
 						 ];

 	var controlpoints4 = [
 							[
 								[ -4.0, -0.0, 3.0, 1 ],
 								[ -4.0, -0.0, 3.0, 1 ],
 								[ -4.0, 0.0, 3.0, 1 ],
							 	[ -4.0, 0.0, 3.0, 1 ]
 							],
 							[ 
							 	[ 0, -1.0, 0.0, 1 ],
							 	[ 0, -1.5, 3, 1 ],
							 	[ 0, 1.5, 3, 1 ],
							 	[ 0, 1.0, 0.0, 1 ]						 
							],
							[						 
							 	[ 2.5, -1.5, 0.0, 1 ],
							 	[ 2.5, -2.0, 3, 1 ],
							 	[ 2.5, 2.0, 3, 1 ],
							 	[ 2.5, 1.5, 0.0, 1 ]
							]
 						 ];


	console.log("control: " + this.controlpoints);
	//this.window1 = new Patch(this.scene, 2, 1, 10, 10, controlpoints1);
 	this.chassy1 = new Patch(this.scene, 2, 3, 10, 10, controlpoints1);
 	this.chassy2 = new Patch(this.scene, 2, 3, 10, 10, controlpoints2);
 	this.chassy3 = new Patch(this.scene, 2, 3, 10, 10, controlpoints3);
 	this.chassy4 = new Patch(this.scene, 2, 3, 10, 10, controlpoints4);
	
	this.chassy5 = new MyTorus(this.scene, 0.1, 2, 50, 50);
	
	this.turbine = new MyCylinderWithTops(this.scene, 50, 50, 0.25, 0.4, 1.7);

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

//----------START_BASE_BODY----------//

 	this.scene.pushMatrix();
 	this.scene.scale(0.85,0.85,0.85);
 	this.chassy1.display();
 	this.testAppearance.apply();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 	this.scene.rotate(180*degToRad,1,0,0);
 	this.scene.scale(0.85,0.85,0.85);
 	this.chassy2.display();
 	this.testAppearance.apply();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 	this.scene.translate(4.25,0,0);
 	this.scene.rotate(180*degToRad,0,0,1);
 	this.scene.rotate(180*degToRad,1,0,0);
 	this.scene.scale(0.85,0.85,0.85);
 	this.chassy3.display();
 	this.testAppearance.apply();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 	this.scene.translate(4.25,0,0);
 	this.scene.rotate(180*degToRad,0,0,1);
 	this.scene.scale(0.85,0.85,0.85);
 	this.chassy4.display();
 	this.testAppearance.apply();
 	this.scene.popMatrix();

//----------END_BASE_BODY----------//


//----------START_MAIN_TURBINES----------//

 	this.scene.pushMatrix();
 	this.scene.scale(1,1.5,2);
 	this.scene.translate(3.0,0,-0.25);
 	this.chassy5.display();
 	this.scene.popMatrix();
	
 	this.scene.pushMatrix();
 	this.scene.translate(2.0,-3.0,1.0);
 	this.scene.rotate(-45*degToRad,0,1,0);
 	this.turbine.display();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 	this.scene.translate(4.4,-3.0,-1.4);
 	this.scene.rotate(135*degToRad,0,1,0);
 	this.turbine.display();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 	this.scene.translate(2.0,3.0,1.0);
 	this.scene.rotate(-45*degToRad,0,1,0);
 	this.turbine.display();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 	this.scene.translate(4.4,3.0,-1.4);
 	this.scene.rotate(135*degToRad,0,1,0);
 	this.turbine.display();
 	this.scene.popMatrix();

//----------END_MAIN_TURBINES----------//


//----------START_THRUSTER_TURBINES----------//

 	this.scene.pushMatrix();
 	this.scene.scale(1,0.75,0.5);
 	this.scene.translate(7.0,0,6);
 	this.scene.rotate(90*degToRad,0,1,0);
 	this.chassy5.display();
 	this.scene.popMatrix();
	
 	this.scene.pushMatrix();
 	this.scene.scale(0.75,0.75,0.75);
 	this.scene.translate(8.0,-2.0,4.5);
 	this.scene.rotate(-70*degToRad,0,1,0);
 	this.turbine.display();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 	this.scene.scale(0.75,0.75,0.75);
 	this.scene.translate(11.2,-2.0,3.33);
 	this.scene.rotate(110*degToRad,0,1,0);
 	this.turbine.display();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 	this.scene.scale(0.75,0.75,0.75);
 	this.scene.translate(8.0,2.0,4.5);
 	this.scene.rotate(-70*degToRad,0,1,0);
 	this.turbine.display();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 	this.scene.scale(0.75,0.75,0.75);
 	this.scene.translate(11.2,2.0,3.33);
 	this.scene.rotate(110*degToRad,0,1,0);
 	this.turbine.display();
 	this.scene.popMatrix();

//----------END_THRUSTER_TURBINES----------//

 	
 }
