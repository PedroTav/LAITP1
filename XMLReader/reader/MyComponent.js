function MyComponent(scene)
{
    CGFobject.call(this,scene);

    this.components = [];

    this.transformations = [];

    this.texture = new Texture(scene);

    this.defaultAppearance = new CGFappearance(scene);
}

MyComponent.prototype.display = function()
{
    this.scene.pushMatrix();
    this.applyTransforms();

    for(var i = 0; i < this.components.length; i++)
    {
        this.texture.applyTexture();
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