
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

	this.rectangleID = 0;
	this.triangleID = 0;
	this.cylinderID = 0;
	this.sphereID = 0;
	this.torusID = 0;

	this.rectangleStrings = [];
	this.triangleStrings = [];
	this.cylinderStrings = [];
	this.sphereStrings = [];
	this.torusStrings = [];

	this.object = [];
	this.objectStrings = [];

	this.transformations = [];
	this.transformationsID = [];

	this.lights = [];

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

	
	error = this.parseTransformations(rootElement);

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

	var perspective = views.children[0];

	if(perspective == null || perspective.length == 0)
	{
		return "perspective is missing";
	}

	this.camera = new Camera();

	this.camera.near = perspective.attributes.getNamedItem("near").value;
	this.camera.far = perspective.attributes.getNamedItem("far").value;
	this.camera.angle = perspective.attributes.getNamedItem("angle").value*degToRad;

	var from = perspective.children[0];

	this.camera.from.x = from.attributes.getNamedItem("x").value;
	this.camera.from.y = from.attributes.getNamedItem("y").value;
	this.camera.from.z = from.attributes.getNamedItem("z").value;

	var to = perspective.children[1];

	this.camera.to.x = to.attributes.getNamedItem("x").value;
	this.camera.to.y = to.attributes.getNamedItem("y").value;
	this.camera.to.z = to.attributes.getNamedItem("z").value;

	console.log("Cameras read");
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

	for(var i = 0; i < cLength; i++)
	{
		var name = components[i].attributes.getNamedItem("id").value;

		if(name == this.rootID)
		{
			this.rootElement = this.processComponent(components[i], name, components);
		}
		//this.processComponent(components[i]);
	}

	console.log("components read");
}

MySceneGraph.prototype.processComponent = function(component, name, components)
{
	var c = new MyComponent(this.scene);

	this.processTransforms(component, c);

	var children = component.getElementsByTagName('children');

	var ref = children[0].getElementsByTagName('primitiveref');

	//this.objectStrings.push(component.attributes.getNamedItem("id").value);

	if(ref != null && ref.length > 0)
	{
		var namePrimitive = ref[0].attributes.getNamedItem("id").value;

		console.log("Primitive " + name);

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

				//var comp = this.getComponentFromName(name);

				/*console.log("Component " + name);

				if(comp != null)
				{	
					c.components.push(comp);
				}*/

				for(var j = 0; j < components.length; j++)
				{
					var nameNewComponent = components[j].attributes.getNamedItem("id").value;

					if(nameNewComponent == nameComponent)
					{
						c.components.push(this.processComponent(components[j], nameComponent, components));
						break;
					}
				}

				//this.object.push(c);
			}
		}
	}

	return c;
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

	if(enabled == 1)
	{
		newLight.enable();
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
			console.log(this.objectStrings[i]);
			console.log(this.rootID);
			return this.object[i];
		}
	}
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


