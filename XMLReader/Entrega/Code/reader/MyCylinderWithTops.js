function MyCylinderWithTops(scene, slices, stacks, base, top, height) {
	CGFobject.call(this,scene);

	this.height = height;
	this.base = base;
	this.top = top;

	this.cylinder = new MyCylinder(scene, slices, height*stacks, base, top);

	this.circle1 = new MyCircle(scene, slices);
	this.circle2 = new MyCircle(scene, slices);

	this.initBuffers();
};

MyCylinderWithTops.prototype = Object.create(CGFobject.prototype);
MyCylinderWithTops.prototype.constructor = MyCylinderWithTops;

MyCylinderWithTops.prototype.display = function ()
{
	this.scene.pushMatrix()
		this.scene.pushMatrix();
		this.scene.scale(1, 1, this.height);
		this.cylinder.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.scale(this.top*2, this.top*2, 1);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.scene.translate(0, 0, this.height);
		this.circle2.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.scale(this.base*2, this.base*2, 1);
		this.circle1.display();
		this.scene.popMatrix();
	this.scene.popMatrix();
 }