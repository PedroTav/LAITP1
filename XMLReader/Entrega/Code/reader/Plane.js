/**
 * Plane
 * @constructor
 */
 function Plane(scene, dX, dY, divX, divY, x, z) {
 	
	this.x = x || 0;
	this.z = z || 0;

 	this.dX = dX;
 	this.dY = dY;
 	this.divX = divX;
 	this.divY = divY;

 	this.stateSmall = false;
 	this.stateMedium = false;
 	this.stateBig = false;
    
    var knots = this.getKnotsVector(1);

    var controlvertexes = 
        [	// U = 0
		  [ // V = 0..1;
			[-1*(dX/2.0), -1*(dY/2.0), 0.0, 1 ],
			[-1*(dX/2.0),  dY/2.0, 0.0, 1 ]
							
		  ],
			// U = 1
		  [ // V = 0..1
			[ dX/2.0, -1*(dY/2.0), 0.0, 1 ],
			[ dX/2.0,  dY/2.0, 0.0, 1 ]							 
		  ]
		];

	var nurbsSurface = new CGFnurbsSurface(1, 1, knots, knots, controlvertexes);
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

 Plane.prototype = Object.create(CGFnurbsObject.prototype);
 Plane.prototype.constructor = Plane;

 Plane.prototype.getKnotsVector = function(degree) { 
	
	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
 };

 Plane.prototype.picking = function() {

	return "Plane";
 	
 }

 Plane.prototype.setCoords = function(x, z)
 {
 	this.x = x;
 	this.z = z;
 }

Plane.prototype.reset = function()
{
	this.stateSmall = false;
 	this.stateMedium = false;
 	this.stateBig = false;
}