/**
 * Chessboard
 * @constructor
 */
function Chessboard(scene, du, dv, su, sv, texture, c1, c2, cs) {
	CGFobject.call(this, scene);

	this.texture = texture;

	this.du = du;
	this.dv = dv;
	this.su = su;
	this.sv = sv;
	this.c1 = c1;
	this.c2 = c2;
	this.cs = cs;

	this.shader = new CGFshader(this.scene.gl, "shaders/board.vert", "shaders/board.frag");

	this.shader.setUniformsValues({div1: this.du, div2: this.dv, c1: this.c1, c2: this.c2, cs: this.cs, su: this.su, sv: this.sv, su2: this.su, sv2: this.sv});

	this.plane = new Plane(scene, 1, 1, du, dv);
}

Chessboard.prototype = Object.create(CGFobject.prototype);
Chessboard.prototype.constructor = Chessboard;

Chessboard.prototype.display = function() {
	this.scene.setActiveShader(this.shader);
	this.scene.pushMatrix();
	this.texture.applyTexture();
	this.plane.display();
	this.scene.popMatrix();
	this.scene.setActiveShader(this.scene.defaultShader);
}

Chessboard.prototype.changePoint = function(direction) {
	
	switch(direction){
        case "left":
       		this.su--;
       		this.su2--;
        	this.shader.setUniformsValues({su: this.su, su2: this.su2});
            break;
        case "right":
        	this.su++;
        	this.su2++;
        	this.shader.setUniformsValues({su: this.su, su2: this.su2});
            break;
        case "up":
        	this.sv--;
        	this.sv2--;
        	this.shader.setUniformsValues({sv: this.sv, sv2: this.sv2});
            break;
        case "down":
        	this.sv++;
        	this.sv2++
        	this.shader.setUniformsValues({sv: this.sv, sv2: this.sv2});
            break;      

    }


}