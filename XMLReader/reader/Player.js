/**
 * Player
 * @constructor
 */
 function Player(scene, id) {
 	CGFobject.call(this, scene);

 	console.log(id);

 	var x = 6.66;
 	var z = 5.77;
	
	this.playerTex = new CGFappearance(scene);

	this.id = id;
	this.won = false;
 

	this.pieces = [
		new MyPiece(scene, "small", this.id),
		new MyPiece(scene, "small", this.id),
		new MyPiece(scene, "small", this.id),
		new MyPiece(scene, "medium", this.id),
		new MyPiece(scene, "medium", this.id),
		new MyPiece(scene, "medium", this.id),
		new MyPiece(scene, "large", this.id),
		new MyPiece(scene, "large", this.id),
		new MyPiece(scene, "large", this.id)
	];

	switch(id) {
		case 0: 
			    this.playerTex.loadTexture("textures/yellow.png");
				z = -4.33;
				break;
		case 1: 
			    this.playerTex.loadTexture("textures/red.png");
				x = -3.33;
				break;
		case 2: 
				this.playerTex.loadTexture("textures/green.png");
				z = -4.33;
				x = -1*x;
				break;
		case 3:	
			    this.playerTex.loadTexture("textures/blue.png");
				x = -3.33;
				z = -7.66;
				break;
	}

	for(var i = 0; i < 3; i++) {
		
		this.pieces[i].x = x;
		this.pieces[i].z = z;
		this.pieces[3 + i].x = x;
		this.pieces[3 + i].z = z;
		this.pieces[6 + i].x = x;
		this.pieces[6 + i].z = z;

		if(((id + 1) % 2) == 0)
		{
			x += 3.33;
		}
		else
		{
			z += 3.33;
		}

	}
 }

 Player.prototype = Object.create(CGFobject.prototype);
 Player.prototype.constructor = Player;

 Player.prototype.display = function() {
	
	for(var i = 0; i < 9; i++){

 	this.scene.pushMatrix();
 	this.scene.translate(this.pieces[i].x, this.pieces[i].y, this.pieces[i].z);
 	this.playerTex.apply();
 	this.scene.registerForPick(i+1 + this.id*9, this.pieces[i]);
 	this.pieces[i].display();
 	this.scene.popMatrix();

	}


 }

 Player.prototype.update = function(dt)
 {
 	for(var i = 0; i < this.pieces.length; i++)
	{
		this.pieces[i].update(dt);
	}
 }

 Player.prototype.reset = function()
 {
 	this.won = false;

 	for(var i = 0; i < this.pieces.length; i++)
 	{
 		this.pieces[i].reset();
 	}
 }