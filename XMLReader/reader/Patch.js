/**
 * Patch
 * @constructor
 */
 function Patch(scene, degreeU, degreeV, divX, divY, controlvertexes) {
 	

 	this.degreeU = degreeU;
 	this.degreeV = degreeV;
 	this.divX = divX;
 	this.divY = divY;
    
    var knots1 = this.getKnotsVector(degreeU);
    var knots2 = this.getKnotsVector(degreeV);

	var nurbsSurface = new CGFnurbsSurface(degreeU, degreeV, knots1, knots2, controlvertexes);
    getSurfacePoint = function(u, v) {
       return nurbsSurface.getPoint(u, v);
    };
    
    CGFnurbsObject.call(this, scene, getSurfacePoint, divX, divY);

 	this.texCoords = [
    0,1,
    1,1,
    0,0,
    1,0
    ];
   
 };

 Patch.prototype = Object.create(CGFnurbsObject.prototype);
 Patch.prototype.constructor = Patch;

 Patch.prototype.getKnotsVector = function(degree) { 
	
	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
 };
