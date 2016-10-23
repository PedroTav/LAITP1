 function MySphere(scene, slices, stacks, radius) {
 	CGFobject.call(this,scene);

 	this.semisphere1 = new MySemiSphere(scene, slices, stacks);
 	//this.semisphere2 = new MySemiSphere(scene, slices, stacks);
	
	this.radius = radius;
 };

 MySphere.prototype.display = function()
 {
    this.scene.pushMatrix();
    this.scene.scale(this.radius, this.radius, this.radius);
    this.semisphere1.display();
    this.scene.popMatrix();
/*
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.scene.scale(this.radius, this.radius, this.radius);
    this.semisphere2.display();
    this.scene.popMatrix();
  */
 }