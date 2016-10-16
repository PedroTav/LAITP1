function MyComponent(scene)
{
    CGFobject.call(this,scene);

    this.components = [];

    this.transformations = [];
}

MyComponent.prototype.display = function()
{
    this.scene.pushMatrix();
    this.applyTransforms();

    for(var i = 0; i < this.components.length; i++)
    {
        this.components[i].display();
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