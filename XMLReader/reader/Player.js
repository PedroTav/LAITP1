/**
 * Player
 * @constructor
 */
 function Player(scene, id) {
 	CGFobject.call(this, scene);

 	var x = 6.66;
 	var z = 5.77;
	
	this.playerTex = new CGFappearance(scene);
 

	this.pieces = [
		new MyPiece(scene, "small"),
		new MyPiece(scene, "small"),
		new MyPiece(scene, "small"),
		new MyPiece(scene, "medium"),
		new MyPiece(scene, "medium"),
		new MyPiece(scene, "medium"),
		new MyPiece(scene, "large"),
		new MyPiece(scene, "large"),
		new MyPiece(scene, "large")
	];

	switch(id) {
		case 1: 
			    this.playerTex.loadTexture("textures/window.png");
				z = -4.33;
				break;
		case 2: 
			    this.playerTex.loadTexture("textures/window.png");
				x = -3.33;
				break;
		case 3: 
				this.playerTex.loadTexture("textures/window.png");
				z = -4.33;
				x = -1*x;
				break;
		case 4:	
			    this.playerTex.loadTexture("textures/window.png");
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

		if((id % 2) == 0)
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
 	this.scene.registerForPick(i+1, this.pieces[i]);
 	this.pieces[i].display();
 	this.scene.popMatrix();

	}


 }
