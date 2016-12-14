/**
 * MyPiece
 * @constructor
 */
 function MyPiece(scene, size) {
 	CGFobject.call(this, scene);
	
		
 	this.x = 0;
 	this.y = 0;
 	this.z = 0;

 	switch(size){

		case 'large': this.piece = new MyCylinder(scene, 50, 1, 0.45, 0.45);
					  break;

		case 'medium': this.piece = new MyCylinder(scene, 50, 1, 0.20, 0.20);
					   break; 

		case 'small': this.piece = new MyCylinder(scene, 50, 1, 0.05, 0.05);
					  break; 

 	}
	

 }

 MyPiece.prototype = Object.create(CGFobject.prototype);
 MyPiece.prototype.constructor = MyPiece;

 MyPiece.prototype.display = function() {

	var degToRad = Math.PI / 180.0;

	this.scene.pushMatrix();
	this.scene.translate(0,0,1);
	this.scene.rotate(90*degToRad,1,0,0);
	this.scene.scale(1,1,0.5);
 	this.piece.display();
 	this.scene.popMatrix();

 }

 MyPiece.prototype.picking = function() {

	return "Piece";

 }
