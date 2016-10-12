
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();

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

	error = this.parseScene(rootElement);

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
	this.axisLength = this.reader.getNamedItem("axis_length").value;

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

	this.background[0] = background.attributes.getNamedItem("r").value;
	this.background[1] = background.attributes.getNamedItem("g").value;
	this.background[2] = background.attributes.getNamedItem("b").value;
	this.background[3] = background.attributes.getNamedItem("a").value;
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

