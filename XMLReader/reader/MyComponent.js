function MyComponent(scene)
{
    CGFobject.call(this,scene);
    
    this.components = [];
}

MyComponent.prototype.display = function()
{
    for(var i = 0; i < this.components.length; i++)
    {
        this.scene.pushMatrix();
        this.components[i].display();
        this.scene.popMatrix();
    }
}

MyComponent.prototype.addComponent = function(component)
{
    this.components.push(component);
}