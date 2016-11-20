
var degToRad = Math.PI / 180.0;

function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();

	this.rectangle = [];
	this.triangle = [];
	this.cylinder = [];
	this.sphere = [];
	this.torus = [];
	this.vehicle = [];
	this.plane = [];
	this.patch = [];
	this.chessboard = [];

	this.rectangleID = 0;
	this.triangleID = 0;
	this.cylinderID = 0;
	this.sphereID = 0;
	this.torusID = 0;
	this.vehicleID = 0;
	this.planeID = 0;
	this.patchID = 0;
	this.chessboardID = 0;

	this.cameras = [];

	this.rectangleStrings = [];
	this.triangleStrings = [];
	this.cylinderStrings = [];
	this.sphereStrings = [];
	this.torusStrings = [];
	this.vehicleStrings = [];
	this.planeStrings = [];
	this.patchStrings = [];
	this.chessboardStrings = [];

	this.object = [];
	this.objectStrings = [];

	this.transformations = [];
	this.transformationsID = [];

	this.animations = [];
	this.animationsID = [];

	this.lights = [];
	this.lightsBool = {};
	this.lightsID = [];

	this.textures = [];

	this.materials = [];

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	/*var error = this.parseGlobalsExample(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}*/	

	var error = this.parseScene(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseViews(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseIlumination(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseLights(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseTextures(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseMaterials(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}
	
	error = this.parseTransformations(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseAnimations(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parsePrimitives(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseComponents(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

MySceneGraph.prototype.parseScene = function(rootElement) {

	var elems = rootElement.getElementsByTagName('scene');
	if(elems == null)
	{
		return "scene element is missing.";
	}

	if(elems.length != 1)
	{
		return "either zero or more than one 'scene' element found.";
	}

	var scene = elems[0];
	this.axisLength = scene.attributes.getNamedItem("axis_length").value;
	this.rootID = scene.attributes.getNamedItem("root").value;

	console.log("Scene element read");
}

MySceneGraph.prototype.parseViews = function(rootElement)
{
	var elems =  rootElement.getElementsByTagName('views');
	if (elems == null) {
		return "views element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'views' element found.";
	}

	var views = elems[0];

	var perspective = views.children;

	if(perspective == null || perspective.length == 0)
	{
		return "perspective is missing";
	}

	for(var i = 0; i < perspective.length; i++)
	{
		this.processCamera(perspective[i]);
	}

	console.log("Cameras read");
}

MySceneGraph.prototype.processCamera = function(perspective)
{
	var near = this.reader.getFloat(perspective, "near", true);
	var far = this.reader.getFloat(perspective, "far", true);
	var angle = perspective.attributes.getNamedItem("angle").value*degToRad;

	var from = perspective.children[0];

	var position = [];

	position.push(from.attributes.getNamedItem("x").value);
	position.push(from.attributes.getNamedItem("y").value);
	position.push(from.attributes.getNamedItem("z").value);

	var to = perspective.children[1];

	var target = [];

	target.push(to.attributes.getNamedItem("x").value);
	target.push(to.attributes.getNamedItem("y").value);
	target.push(to.attributes.getNamedItem("z").value);

	var camera = new CGFcamera(angle, near, far, position, target);

	this.cameras.push(camera);
}

MySceneGraph.prototype.parseIlumination = function(rootElement)
{
	var elems =  rootElement.getElementsByTagName('illumination');
	if (elems == null) {
		return "illumination element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'illumination' element found.";
	}

	var illumination = elems[0];

	var ambient = illumination.children[0];
	var background = illumination.children[1];

	this.illumination = new Illumination();

	this.illumination.ambient.r = ambient.attributes.getNamedItem("r").value;
	this.illumination.ambient.g = ambient.attributes.getNamedItem("g").value;
	this.illumination.ambient.b = ambient.attributes.getNamedItem("b").value;
	this.illumination.ambient.a = ambient.attributes.getNamedItem("a").value;

	this.background = [];

	this.background[0] = background.attributes.getNamedItem("r").value;
	this.background[1] = background.attributes.getNamedItem("g").value;
	this.background[2] = background.attributes.getNamedItem("b").value;
	this.background[3] = background.attributes.getNamedItem("a").value;

	console.log("illumination read");
}

MySceneGraph.prototype.parsePrimitives= function(rootElement)
{
	var elems =  rootElement.getElementsByTagName('primitives');
	if (elems == null) {
		return "primitives element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'primitives' element found.";
	}

	var primitives = elems[0].getElementsByTagName('primitive');

	var type;
	var pLength = primitives.length;


	for(var i = 0; i < pLength; i++)
	{
		type = primitives[i].getElementsByTagName('rectangle');
		var name = primitives[i].attributes.getNamedItem("id").value;

		if(type != null && type.length > 0)
		{
			this.processRectangle(type[0], name);
			continue;
		}

		type = primitives[i].getElementsByTagName('triangle');

		if(type != null && type.length > 0)
		{
			this.processTriangle(type[0], name);
			continue;
		}

		type = primitives[i].getElementsByTagName('cylinder');

		if(type != null && type.length > 0)
		{
			this.processCylinder(type[0], name);
			continue;
		}

		type = primitives[i].getElementsByTagName('sphere');

		if(type != null && type.length > 0)
		{
			this.processSphere(type[0], name);
			continue;
		}

		type = primitives[i].getElementsByTagName('torus');

		if(type != null && type.length > 0)
		{
			this.processTorus(type[0], name);
			continue;
		}

		type = primitives[i].getElementsByTagName('plane');

		if(type != null && type.length > 0)
		{
			this.processPlane(type[0], name);
			continue;
		}

		type = primitives[i].getElementsByTagName('patch');

		if(type != null && type.length > 0)
		{
			this.processPatch(type[0], name);
			continue;
		}

		type = primitives[i].getElementsByTagName('vehicle');

		if(type != null && type.length > 0)
		{
			this.processVehicle(type[0], name);
			continue;
		}

		type = primitives[i].getElementsByTagName('chessboard');

		if(type != null && type.length > 0)
		{
			this.processChessboard(type[0], name);
			continue;
		}
	}

	console.log("primitives read");
}

MySceneGraph.prototype.processRectangle= function(type, name)
{
	var x1 = type.attributes.getNamedItem("x1").value;
	var x2 = type.attributes.getNamedItem("x2").value;
	var y1 = type.attributes.getNamedItem("y1").value;
	var y2 = type.attributes.getNamedItem("y2").value;

	this.rectangle[this.rectangleID] = new MyQuad(this.scene, x1, x2, y1, y2);
	this.rectangleStrings[this.rectangleID] = name;
	this.rectangleID++;
}

MySceneGraph.prototype.processTriangle= function(type, name)
{
	var x1 = type.attributes.getNamedItem("x1").value;
	var x2 = type.attributes.getNamedItem("x2").value;
	var x3 = type.attributes.getNamedItem("x3").value;
	var y1 = type.attributes.getNamedItem("y1").value;
	var y2 = type.attributes.getNamedItem("y2").value;
	var y3 = type.attributes.getNamedItem("y3").value;
	var z1 = type.attributes.getNamedItem("z1").value;
	var z2 = type.attributes.getNamedItem("z2").value;
	var z3 = type.attributes.getNamedItem("z3").value;

	this.triangle[this.triangleID] = new MyTriangle(this.scene, x1, x2, x3, y1, y2, y3, z1, z2, z3);
	this.triangleStrings[this.triangleID] = name;
	this.triangleID++;
}

MySceneGraph.prototype.processCylinder= function(type, name)
{
	var slices = type.attributes.getNamedItem("slices").value;
	var stacks = type.attributes.getNamedItem("stacks").value;
	var base = type.attributes.getNamedItem("base").value;
	var top = type.attributes.getNamedItem("top").value;
	var height = type.attributes.getNamedItem("height").value;

	this.cylinder[this.cylinderID] = new MyCylinderWithTops(this.scene, slices, stacks, base, top, height);
	this.cylinderStrings[this.cylinderID] = name;
	this.cylinderID++;
}

MySceneGraph.prototype.processSphere= function(type, name)
{
	var slices = type.attributes.getNamedItem("slices").value;
	var stacks = type.attributes.getNamedItem("stacks").value;
	var radius = type.attributes.getNamedItem("radius").value;

	this.sphere[this.sphereID] = new MySphere(this.scene, slices, stacks, radius);
	this.sphereStrings[this.sphereID] = name;
	this.sphereID++;
}

MySceneGraph.prototype.processTorus= function(type, name)
{
	var inner = this.reader.getFloat(type, "inner", true);
	var outer = this.reader.getFloat(type, "outer", true);
	var slices = this.reader.getFloat(type, "slices", true);
	var loops = this.reader.getFloat(type, "loops", true);

	this.torus[this.torusID] = new MyTorus(this.scene, inner, outer, slices, loops);
	this.torusStrings[this.torusID] = name;
	this.torusID++;
}

MySceneGraph.prototype.processVehicle= function(type, name)
{
	var slices = type.attributes.getNamedItem("slices").value;
	var stacks = type.attributes.getNamedItem("stacks").value;
		
	this.vehicle[this.vehicleID] = new Vehicle(this.scene, slices, stacks);
	this.vehicleStrings[this.vehicleID] = name;
	this.vehicleID++;
}

MySceneGraph.prototype.processPlane= function(type, name)
{
	var dimX = this.reader.getFloat(type, "dimX", true);
	var dimY = this.reader.getFloat(type, "dimY", true);
	var partsX = this.reader.getFloat(type, "partsX", true);
	var partsY = this.reader.getFloat(type, "partsY", true);

	this.plane[this.planeID] = new Plane(this.scene, dimX, dimY, partsX, partsY);
	this.planeStrings[this.planeID] = name;
	this.planeID++;
}

MySceneGraph.prototype.processPatch= function(type, name)
{
	var orderU = this.reader.getFloat(type, "orderU", true);
	var orderV = this.reader.getFloat(type, "orderV", true);
	var partsU = this.reader.getFloat(type, "partsU", true);
	var partsV = this.reader.getFloat(type, "partsV", true);

	var controlvertexes = [];

	var controlpoint = type.children;

	var i = 0;

	for(var j = 0; j <= orderU; j++)
	{
		controlvertexes.push([]);
		for(var k = 0; k <= orderV; k++)
		{
			controlvertexes[j].push([]);

			var x = this.reader.getFloat(controlpoint[i], "x", true);
			var y = this.reader.getFloat(controlpoint[i], "y", true);
			var z = this.reader.getFloat(controlpoint[i], "z", true);

			controlvertexes[j][k].push(x);
			controlvertexes[j][k].push(y);
			controlvertexes[j][k].push(z);
			controlvertexes[j][k].push(1);

			i++;
		}
	}

	console.log(controlvertexes);

	this.patch[this.patchID] = new Patch(this.scene, orderU, orderV, partsU, partsV, controlvertexes);
	this.patchStrings[this.patchID] = name;
	this.patchID++;
}

MySceneGraph.prototype.processChessboard= function(type, name)
{
	var du = this.reader.getFloat(type, "du", true);
	var dv = this.reader.getFloat(type, "dv", true);
	var su = this.reader.getFloat(type, "su", true);
	var sv = this.reader.getFloat(type, "sv", true);

	var id = type.attributes.getNamedItem("textureref").value;

	var colors = type.children;

	var r1 = this.reader.getFloat(colors[0], "r", true);
	var g1 = this.reader.getFloat(colors[0], "g", true);
	var b1 = this.reader.getFloat(colors[0], "b", true);
	var a1 = this.reader.getFloat(colors[0], "a", true);

	var r2 = this.reader.getFloat(colors[1], "r", true);
	var g2 = this.reader.getFloat(colors[1], "g", true);
	var b2 = this.reader.getFloat(colors[1], "b", true);
	var a2 = this.reader.getFloat(colors[1], "a", true);

	var rs = this.reader.getFloat(colors[2], "r", true);
	var gs = this.reader.getFloat(colors[2], "g", true);
	var bs = this.reader.getFloat(colors[2], "b", true);
	var as = this.reader.getFloat(colors[2], "a", true);

	var c1 = vec4.fromValues(r1, g1, b1, a1);
	var c2 = vec4.fromValues(r2, g2, b2, a2);
	var cs = vec4.fromValues(rs, gs, bs, as);

	this.chessboard[this.chessboardID] = new Chessboard(this.scene, du, dv, su, sv, this.getTexture(id), c1, c2, cs);
	this.chessboardStrings[this.chessboardID] = name;
	this.chessboardID++;
}

MySceneGraph.prototype.parseComponents = function(rootElement)
{
	var elems =  rootElement.getElementsByTagName('components');
	if (elems == null) {
		return "components element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'components' element found.";
	}

	var components = elems[0].getElementsByTagName('component');

	var cLength = components.length;

	var flag = 0;

	for(var i = 0; i < cLength; i++)
	{
		var name = components[i].attributes.getNamedItem("id").value;

		if(name == this.rootID)
		{
			flag = 1;
			this.rootElement = this.processComponent(components[i], name, components);
		}
	}

	if(!flag)
	{
		console.log("root element not defined");
	}

	console.log("components read");
}

MySceneGraph.prototype.processComponent = function(component, name, components)
{
	var c = new MyComponent(this.scene);

	this.processTransforms(component, c);

	this.associateAnimations(component, c);

	var children = component.getElementsByTagName('children');

	var ref = children[0].getElementsByTagName('primitiveref');

	if(ref != null && ref.length > 0)
	{
		var namePrimitive = ref[0].attributes.getNamedItem("id").value;

		this.createNewPrimitive(namePrimitive, c);
	}
	else
	{
		ref = children[0].getElementsByTagName('componentref');

		if(ref != null && ref.length > 0)
		{
			var cLength = ref.length;

			for(var i = 0; i < cLength; i++)
			{
				var nameComponent = ref[i].attributes.getNamedItem("id").value;

				for(var j = 0; j < components.length; j++)
				{
					var nameNewComponent = components[j].attributes.getNamedItem("id").value;

					if(nameNewComponent == nameComponent)
					{
						c.components.push(this.processComponent(components[j], nameComponent, components));
						break;
					}
				}
			}
		}
	}

	var texture = component.getElementsByTagName('texture');

	var tID = texture[0].attributes.getNamedItem("id").value;

	if(tID != "none")
	{	
		c.tID = tID;

		if(tID != "inherit")
		{
			c.texture = this.getTexture(tID);
		}

		c.checkInheritance();
	}

	var material = component.getElementsByTagName("materials")[0].children;

	for(var i = 0; i < material.length; i++)
	{
		var mID = material[i].attributes.getNamedItem("id").value;

		if(mID != "none")
		{
			c.mID.push(mID);

			if(mID != "inherit")
			{
				c.appearances.push(this.getMaterial(mID));
				c.currAppearance++;
			}
		}
	}

	c.checkInheritanceMaterial();

	return c;
}

MySceneGraph.prototype.getMaterial = function(id)
{
	for(var i = 0; i < this.materials.length; i++)
	{
		if(this.materials[i].id == id)
		{
			return this.materials[i];
		}
	}
}

MySceneGraph.prototype.processTransforms = function(component, c)
{
	var t = component.getElementsByTagName('transformation');

	var tRef = t[0].getElementsByTagName('transformationref');

	if(tRef != null && tRef.length > 0)
	{
		var name = tRef[0].attributes.getNamedItem("id").value;

		for(var i = 0; i < this.transformationsID.length; i++)
		{
			if(this.transformationsID[i] == name)
			{
				c.transformations.push(this.transformations[i]);
			}
		}
	}
	else
	{
		var transf = t[0].children;

		var currT = new MyFullTransform();

		for(var i = 0; i < transf.length; i++)
		{
			var name = transf[i].nodeName;

			var p = new MyTransformation();

			if(name == "translate")
			{
				var x = transf[i].attributes.getNamedItem("x").value;
				var y = transf[i].attributes.getNamedItem("y").value;
				var z = transf[i].attributes.getNamedItem("z").value;

				p.setTranslate(x, y, z);
			}

			if(name == "scale")
			{
				var x = transf[i].attributes.getNamedItem("x").value;
				var y = transf[i].attributes.getNamedItem("y").value;
				var z = transf[i].attributes.getNamedItem("z").value;

				p.setScale(x, y, z);
			}

			if(name == "rotate")
			{
				var axis = transf[i].attributes.getNamedItem("axis").value;
				var angle = transf[i].attributes.getNamedItem("angle").value*degToRad;

				var x, y, z;

				if(axis == "x")
				{
					x = 1;
					y = 0;
					z = 0;
				}

				if(axis == "y")
				{
					x = 0;
					y = 1;
					z = 0;
				}

				if(axis == "z")
				{
					x = 0;
					y = 0;
					z = 1;
				}

				p.setRotate(x, y, z, angle);
			}

			currT.transformations.push(p)
		}

		c.transformations.push(currT);
	}
}

MySceneGraph.prototype.createNewPrimitive = function(name, c)
{
	for(var i = 0; i < this.rectangleStrings.length; i++)
	{
		if(this.rectangleStrings[i] == name)
		{
			c.components.push(this.rectangle[i]);
			//this.object.push(c);
		}
	}

	for(var i = 0; i < this.triangleStrings.length; i++)
	{
		if(this.triangleStrings[i] == name)
		{
			c.components.push(this.triangle[i]);
			//this.object.push(c);
		}
	}

	for(var i = 0; i < this.cylinderStrings.length; i++)
	{
		if(this.cylinderStrings[i] == name)
		{
			c.components.push(this.cylinder[i]);
			//this.object.push(c);
		}
	}

	for(var i = 0; i < this.sphereStrings.length; i++)
	{
		if(this.sphereStrings[i] == name)
		{
			c.components.push(this.sphere[i]);
			//this.object.push(c);
		}
	}

	for(var i = 0; i < this.torusStrings.length; i++)
	{
		if(this.torusStrings[i] == name)
		{
			c.components.push(this.torus[i]);
			//this.object.push(c);
		}
	}

	for(var i = 0; i < this.vehicleStrings.length; i++)
	{
		if(this.vehicleStrings[i] == name)
		{
			c.components.push(this.vehicle[i]);
			//this.object.push(c);
		}
	}

	for(var i = 0; i < this.planeStrings.length; i++)
	{
		if(this.planeStrings[i] == name)
		{
			c.components.push(this.plane[i]);
			//this.object.push(c);
		}
	}

	for(var i = 0; i < this.patchStrings.length; i++)
	{
		if(this.patchStrings[i] == name)
		{
			c.components.push(this.patch[i]);
			//this.object.push(c);
		}
	}

	for(var i = 0; i < this.chessboardStrings.length; i++)
	{
		if(this.chessboardStrings[i] == name)
		{
			c.components.push(this.chessboard[i]);
			//this.object.push(c);
		}
	}
}

MySceneGraph.prototype.getComponentFromName = function(name)
{
	for(var i = 0; i < this.objectStrings.length; i++)
	{
		if(this.objectStrings[i] == name)
		{
			return this.object[i];
		}
	}

	return null;
}

MySceneGraph.prototype.parseTransformations = function(rootElement)
{
	var elems =  rootElement.getElementsByTagName('transformations');
	if (elems == null) {
		return "transformations element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'transformations' element found.";
	}

	var t = elems[0].getElementsByTagName('transformation');

	for(var i = 0; i < t.length; i++)
	{
		this.createTransform(t[i]);
	}

	console.log("transformations read");
}

MySceneGraph.prototype.createTransform = function(t)
{
	var transf = t.children;

	var currT = new MyFullTransform();

	for(var i = 0; i < transf.length; i++)
	{
		var name = transf[i].nodeName;

		var p = new MyTransformation();

		if(name == "translate")
		{
			var x = transf[i].attributes.getNamedItem("x").value;
			var y = transf[i].attributes.getNamedItem("y").value;
			var z = transf[i].attributes.getNamedItem("z").value;

			p.setTranslate(x, y, z);
		}

		if(name == "scale")
		{
			var x = transf[i].attributes.getNamedItem("x").value;
			var y = transf[i].attributes.getNamedItem("y").value;
			var z = transf[i].attributes.getNamedItem("z").value;

			p.setScale(x, y, z);
		}

		if(name == "rotate")
		{
			var axis = transf[i].attributes.getNamedItem("axis").value;
			var angle = transf[i].attributes.getNamedItem("angle").value*degToRad;

			var x, y, z;

			if(axis == "x")
			{
				x = 1;
				y = 0;
				z = 0;
			}

			if(axis == "y")
			{
				x = 0;
				y = 1;
				z = 0;
			}

			if(axis == "z")
			{
				x = 0;
				y = 0;
				z = 1;
			}

			p.setRotate(x, y, z, angle);
		}

		currT.transformations.push(p)
	}

	this.transformations.push(currT);
	this.transformationsID.push(t.attributes.getNamedItem("id").value);
}

MySceneGraph.prototype.parseLights = function(rootElement)
{
	var elems =  rootElement.getElementsByTagName('lights');
	if (elems == null) {
		return "lights element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'lights' element found.";
	}

	var lights = elems[0].children;

	for(var i = 0; i < lights.length; i++)
	{
		this.processLight(lights[i]);
	}

	console.log("lights read");
}

MySceneGraph.prototype.processLight = function(light)
{
	var id = light.attributes.getNamedItem("id").value;
	var enabled = light.attributes.getNamedItem("enabled").value;

	var location = light.getElementsByTagName("location");
	var ambient = light.getElementsByTagName("ambient");
	var diffuse = light.getElementsByTagName("diffuse");
	var specular = light.getElementsByTagName("specular");

	var ar = ambient[0].attributes.getNamedItem("r").value;
	var ag = ambient[0].attributes.getNamedItem("g").value;
	var ab = ambient[0].attributes.getNamedItem("b").value;
	var aa = ambient[0].attributes.getNamedItem("a").value;

	var dr = diffuse[0].attributes.getNamedItem("r").value;
	var dg = diffuse[0].attributes.getNamedItem("g").value;
	var db = diffuse[0].attributes.getNamedItem("b").value;
	var da = diffuse[0].attributes.getNamedItem("a").value;

	var sr = specular[0].attributes.getNamedItem("r").value;
	var sg = specular[0].attributes.getNamedItem("g").value;
	var sb = specular[0].attributes.getNamedItem("b").value;
	var sa = specular[0].attributes.getNamedItem("a").value;

	var newLight = new CGFlight(this.scene, this.lights.length);

	if(light.nodeName == "omni")
	{
		var lx = location[0].attributes.getNamedItem("x").value;
		var ly = location[0].attributes.getNamedItem("y").value;
		var lz = location[0].attributes.getNamedItem("z").value;
		var lw = location[0].attributes.getNamedItem("w").value;

		newLight.setPosition(lx, ly, lz, lw);
	}
	else
	{
		if(light.nodeName == "spot")
		{
			var target = light.getElementsByTagName("target");

			var lx = location[0].attributes.getNamedItem("x").value;
			var ly = location[0].attributes.getNamedItem("y").value;
			var lz = location[0].attributes.getNamedItem("z").value;

			var tx = target[0].attributes.getNamedItem("x").value;
			var ty = target[0].attributes.getNamedItem("y").value;
			var tz = target[0].attributes.getNamedItem("z").value;

			newLight.setPosition(lx, ly, lz, 1.0);
			newLight.setSpotDirection(tx - lx, ty - ly, tz - lz);
		}
	}

	newLight.setAmbient(ar, ag, ab, aa);
	newLight.setDiffuse(dr, dg, db, da);
	newLight.setSpecular(sr, sg, sb, sa);

	newLight.setVisible(true);
	newLight.disable();

	this.lightsID.push(id);

	if(enabled == 1)
	{
		this.lightsBool[id] = true;
		newLight.enable();
	}
	else
	{
		this.lightsBool[id] = false;
	}

	newLight.update();

	this.lights.push(newLight);
}

MySceneGraph.prototype.getRootElement = function()
{
	for(var i = 0; i < this.objectStrings.length; i++)
	{
		if(this.objectStrings[i] == this.rootID)
		{
			return this.object[i];
		}
	}
}

MySceneGraph.prototype.parseTextures = function(rootElement)
{
	var elems =  rootElement.getElementsByTagName('textures');
	if (elems == null) {
		return "textures element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'textures' element found.";
	}

	var textures = elems[0].children;

	for(var i = 0; i < textures.length; i++)
	{
		this.processTexture(textures[i]);
	}

	console.log("textures read");
}

MySceneGraph.prototype.processTexture = function(texture)
{
	var id = texture.attributes.getNamedItem("id").value;
	var filePath = texture.attributes.getNamedItem("file").value;
	var length_s = texture.attributes.getNamedItem("length_s").value;
	var length_t = texture.attributes.getNamedItem("length_t").value;

	var tex = new Texture(this.scene, id, filePath, length_s, length_t);

	this.textures.push(tex);
}

MySceneGraph.prototype.getTexture = function(id)
{
	for(var i = 0; i < this.textures.length; i++)
	{
		if(this.textures[i].id == id)
		{
			return this.textures[i];
		}
	}
}

MySceneGraph.prototype.parseMaterials = function(rootElement)
{
	var elems =  rootElement.getElementsByTagName('materials');
	if (elems == null) {
		return "materials element is missing.";
	}

	var material = elems[0].children;

	for(var i = 0; i < material.length; i++)
	{
		this.processMaterial(material[i]);
	}

	console.log("materials read");
}

MySceneGraph.prototype.processMaterial = function(material)
{
	var id = material.attributes.getNamedItem("id").value;

	var emission = material.getElementsByTagName("emission");

	var emiss = [-1, -1, -1, -1];
	var ambi = [-1, -1, -1, -1];
	var diff = [-1, -1, -1, -1];
	var spec = [-1, -1, -1, -1];

	var shin = -1;

	if(emission != null)
	{
		emiss[0] = this.reader.getFloat(emission[0], "r", true);
		emiss[1] = this.reader.getFloat(emission[0], "g", true);
		emiss[2] = this.reader.getFloat(emission[0], "b", true);
		emiss[3] = this.reader.getFloat(emission[0], "a", true);
	}

	var ambient = material.getElementsByTagName("ambient");

	if(ambient != null)
	{
		ambi[0] = this.reader.getFloat(ambient[0], "r", true);
		ambi[1] = this.reader.getFloat(ambient[0], "g", true);
		ambi[2] = this.reader.getFloat(ambient[0], "b", true);
		ambi[3] = this.reader.getFloat(ambient[0], "a", true);
	}

	var diffuse = material.getElementsByTagName("diffuse");

	if(diffuse != null)
	{
		diff[0] = this.reader.getFloat(diffuse[0], "r", true);
		diff[1] = this.reader.getFloat(diffuse[0], "g", true);
		diff[2] = this.reader.getFloat(diffuse[0], "b", true);
		diff[3] = this.reader.getFloat(diffuse[0], "a", true);
	}
	
	var specular = material.getElementsByTagName("specular");

	if(specular != null)
	{
		spec[0] = this.reader.getFloat(specular[0], "r", true);
		spec[1] = this.reader.getFloat(specular[0], "g", true);
		spec[2] = this.reader.getFloat(specular[0], "b", true);
		spec[3] = this.reader.getFloat(specular[0], "a", true);
	}
	
	var shininess = material.getElementsByTagName("shininess");

	if(shininess != null)
	{
		shin = this.reader.getFloat(shininess[0], "value", true);
	}

	var mater = new Material(this.scene, id, emiss, ambi, diff, spec);

	this.materials.push(mater);
}

MySceneGraph.prototype.parseAnimations = function(rootElement)
{
	var elems =  rootElement.getElementsByTagName('animations');
	if (elems == null) {
		return "animations element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'animations' element found.";
	}

	var animations = elems[0].children;

	for(var i = 0; i < animations.length; i++)
	{
		this.processAnimation(animations[i]);
	}

	console.log(this.animations);
	console.log(this.animationsID);

	console.log("animations read");
}

MySceneGraph.prototype.processAnimation = function(animation)
{
	var id = animation.attributes.getNamedItem("id").value;

	var time = this.reader.getFloat(animation, "span", true);

	var type = animation.attributes.getNamedItem("type").value;

	if(type == "linear")
	{
		var controlPoints = animation.children;

		var controlvector = [];

		for(var i = 0; i < controlPoints.length; i++)
		{
			var x = this.reader.getFloat(controlPoints[i], "xx", true);
			var y = this.reader.getFloat(controlPoints[i], "yy", true);
			var z = this.reader.getFloat(controlPoints[i], "zz", true);

			controlvector.push(new Coords(x, y, z));
		}

		this.animations.push(new LinearAnimation(controlvector, time*1000));
	}
	else if(type == "circular")
	{
		var x = this.reader.getFloat(animation, "centerx", true);
		var y = this.reader.getFloat(animation, "centery", true);
		var z = this.reader.getFloat(animation, "centerz", true);

		var radius = this.reader.getFloat(animation, "radius", true);
		var startAng = this.reader.getFloat(animation, "startang", true)*Math.PI/180;
		var rotAng = this.reader.getFloat(animation, "rotang", true)*Math.PI/180;

		this.animations.push(new CircularAnimation(new Coords(x, y, z), radius, startAng, rotAng, time*1000));
	}

	this.animationsID.push(id);
}

MySceneGraph.prototype.associateAnimations = function(component, c)
{
	var animation = component.getElementsByTagName('animation');

	if(animation[0] == null)
	{
		return;
	}

	var aRef = animation[0].getElementsByTagName('animationref');

	if(aRef == null)
	{
		return;
	}

	for(var i = 0; i < aRef.length; i++)
	{
		var id = aRef[i].attributes.getNamedItem("id").value;

		c.addAnimation(this.getAnimation(id));
	}
}

MySceneGraph.prototype.getAnimation = function(id)
{
	for(var i = 0; i < this.animations.length; i++)
	{
		if(this.animationsID[i] == id)
		{
			return this.animations[i];
		}
	}

	return null;
}

/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {
	
	var elems =  rootElement.getElementsByTagName('globals');
	if (elems == null) {
		return "globals element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

	var tempList=rootElement.getElementsByTagName('list');

	if (tempList == null  || tempList.length==0) {
		return "list element is missing.";
	}
	
	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];

		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	};

};
	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


