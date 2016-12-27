function MyFullTransform()
{
    this.transformations = [];
}

MyFullTransform.prototype.addTransform = function(t)
{
    this.transformations.push(t);
}

MyFullTransform.prototype.apply = function(scene)
{
    for(var i = 0; i < this.transformations.length; i++)
    {
        this.transformations[i].apply(scene);
    }
}