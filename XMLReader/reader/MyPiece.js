/**
 * MyPiece
 * @constructor
 */
 function MyPiece(scene, size, playerId) {
 	CGFobject.call(this, scene);
	
	console.log(playerId);
	this.playerId = playerId;	
	this.picked = false;
	this.played = false;
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
	
	this.animations = [];
	this.currentAnimation = [];

 }

 MyPiece.prototype = Object.create(CGFobject.prototype);
 MyPiece.prototype.constructor = MyPiece;

 MyPiece.prototype.display = function() {

	var degToRad = Math.PI / 180.0;

	this.scene.pushMatrix();
	this.scene.translate(0,0,1);
	this.applyAnimations();
	this.scene.rotate(90*degToRad,1,0,0);
	this.scene.scale(1,1,0.5);
 	this.piece.display();
 	this.scene.popMatrix();

 }

 MyPiece.prototype.picking = function() {

	return "Piece";

 }

MyPiece.prototype.addAnimation = function(anim)
{
	this.animations.push(anim);
}

MyPiece.prototype.update = function(dt)
{
    for(var i = 0; i < this.animations.length; i++)
    {
        this.currentAnimation[i] = this.animations[i].getPosition(dt);
        
        if(!this.animations[i].over)
        {
            break;
        }

        if(!this.played)
        {
        	this.scene.state = 0;
        	this.played = true;
        }
    }
}

MyPiece.prototype.applyAnimations = function()
{
    for(var i = 0; i < this.currentAnimation.length; i++)
    {
        this.currentAnimation[i].apply(this.scene);
    }
}