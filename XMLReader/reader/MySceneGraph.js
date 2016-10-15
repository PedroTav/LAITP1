
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
	this.camera.angle = perspective.attributes.getNamedItem("angle").value;

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

}

MySceneGraph.prototype.processCylinder= function(type, name)
{

}

MySceneGraph.prototype.processSphere= function(type, name)
{

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
		this.processComponent(components[i]);
	}
	
	console.log("components read");
}

MySceneGraph.prototype.processComponent = function(component)
{
	var children = component.getElementsByTagName('children');

	var ref = children[0].getElementsByTagName('primitiveref');

	this.objectStrings.push(component.attributes.getNamedItem("id").value);

	if(ref != null && ref.length > 0)
	{
		var name = ref[0].attributes.getNamedItem("id").value;

		this.createNewPrimitive(name);
	}
	else
	{
		ref = children[0].getElementsByTagName('componentref');

		if(ref != null && ref.length > 0)
		{
			var c = new MyComponent(this.scene);

			var cLength = ref.length;

			for(var i = 0; i < cLength; i++)
			{
				var name = ref[i].attributes.getNamedItem("id").value;

				var comp = this.getComponentFromName(name);

				if(comp != null)
				{
					c.push(comp);
				}
			}

			this.object.push(c);
		}
	}
}

MySceneGraph.prototype.createNewPrimitive = function(name)
{
	for(var i = 0; i < this.rectangleStrings.length; i++)
	{
		if(this.rectangleStrings[i] == name)
		{
			var c = new MyComponent(this.scene);

			c.components.push(this.rectangle[i]);
			this.object.push(c);
		}
	}

	for(var i = 0; i < this.triangleStrings.length; i++)
	{
		if(this.triangleStrings[i] == name)
		{
			var c = new MyComponent(this.scene);

			c.components.push(this.triangle[i]);
			this.object.push(c);
		}
	}

	for(var i = 0; i < this.cylinderStrings.length; i++)
	{
		if(this.cylinderStrings[i] == name)
		{
			var c = new MyComponent(this.scene);

			c.components.push(this.cylinder[i]);
			this.object.push(c);
		}
	}

	for(var i = 0; i < this.sphereStrings.length; i++)
	{
		if(this.sphereStrings[i] == name)
		{
			var c = new MyComponent(this.scene);

			c.components.push(this.sphere[i]);
			this.object.push(c);
		}
	}

	for(var i = 0; i < this.torusStrings.length; i++)
	{
		if(this.torusStrings[i] == name)
		{
			var c = new MyComponent(this.scene);

			c.components.push(this.torus[i]);
			this.object.push(c);
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


