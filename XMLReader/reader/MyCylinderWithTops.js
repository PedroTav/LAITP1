function MyCylinderWithTops(scene, slices, stacks) {
	CGFobject.call(this,scene);

	this.cylinder = new MyCylinder(scene, slices, stacks);

	this.circle1 = new MyCircle(scene, slices);
	this.circle2 = new MyCircle(scene, slices);

	this.materialDefault = new CGFappearance(this.scene);

	this.clockAppearance = new CGFappearance(this.scene);
	this.clockAppearance.loadTexture("../resources/images/clock.png");

	this.initBuffers();
};

MyCylinderWithTops.prototype = Object.create(CGFobject.prototype);
MyCylinderWithTops.prototype.constructor = MyCylinderWithTops;

MyCylinderWithTops.prototype.display = function ()
{
    this.scene.pushMatrix();
    this.cylinder.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.scene.translate(0, 0, 1*this.cylinder.stacks);
    this.circle2.display();
    this.scene.popMatrix();
    
    this.scene.pushMatrix();
    this.clockAppearance.apply();
    this.circle1.display();
    this.materialDefault.apply();
    this.scene.popMatrix();
 }