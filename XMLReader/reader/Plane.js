/**
 * Plane
 * @constructor
 */
 function Plane(scene, dX, dY, divX, divY) {
 	

 	this.dX = dX;
 	this.dY = dY;
 	this.divX = divX;
 	this.divY = divY;
    
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