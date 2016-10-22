function MyComponent(scene)
{
    CGFobject.call(this,scene);

    this.components = [];

    this.transformations = [];

    this.texture = new Texture(scene);
    this.appearances = [];

    this.appearances.push(new Material(scene));
    this.currAppearance = 0;

    this.tID = "none";

    this.defaultAppearance = new CGFappearance(scene);
}

MyComponent.prototype.display = function()
{
    this.scene.pushMatrix();
    this.applyTransforms();

    for(var i = 0; i < this.components.length; i++)
    {
        this.texture.applyTexture();
        this.appearances[this.currAppearance].applyMaterial();
        this.components[i].display();
        this.defaultAppearance.apply();
    }

    this.scene.popMatrix();
}

MyComponent.prototype.addComponent = function(component)
{
    this.components.push(component);
}

MyComponent.prototype.applyTransforms = function()
{
    for(var i = 0; i < this.transformations.length; i++)
    {
        this.transformations[i].apply(this.scene);
    }
}

MyComponent.prototype.updateTexCoordsGLBuffers = function()
{
    for(var i = 0; i < this.components.length; i++)
    {
        this.components[i].updateTexCoordsGLBuffers();
    }
}

MyComponent.prototype.updateMaterials = function()
{
    if(this.currAppearance == this.appearances.length - 1)
    {
        this.currAppearance = 0;
    }
    else
    {
        this.currAppearance++;
    }

    for(var i = 0; i < this.components.length; i++)
    {
        if(this.components[i] instanceof MyComponent)
        {
            this.components[i].updateMaterials();
        }
    }
}

MyComponent.prototype.checkInheritance = function()
{
    for(var i = 0; i < this.components.length; i++)
    {
        if(this.components[i] instanceof MyComponent && this.components[i].tID == "inherit")
        {
            this.components[i].texture = this.texture;
        }
    }
}