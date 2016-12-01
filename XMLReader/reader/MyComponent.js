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
    this.mID = [];

    this.animations = [];
    this.currentAnimation = [];

    this.defaultAppearance = new CGFappearance(scene);
}

MyComponent.prototype.display = function()
{
    this.scene.pushMatrix();

    this.applyTransforms();

    this.applyAnimations();

    for(var i = 0; i < this.components.length; i++)
    {
        if(this.components[i] instanceof MyComponent)
        {
            if(this.components[i].tID != "none")
            {
                this.texture.applyTexture();
            }
        }
        else
        {
            this.texture.applyTexture();
        }

        if(this.components[i] instanceof MyComponent)
        {
            if(this.components[i].mID[this.components[i].currAppearance] != "none")
            {
                this.appearances[this.currAppearance].applyMaterial();
            }
        }
        else
        {
            this.appearances[this.currAppearance].applyMaterial();
        }

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

MyComponent.prototype.checkInheritanceMaterial = function()
{
    for(var i = 0; i < this.components.length; i++)
    {
        if(this.components[i] instanceof MyComponent)
        {
            for(var j = 0; j < this.components[i].mID.length; j++)
            {
                if(this.components[i].mID[j] == "inherit")
                {
                    this.components[i].appearances.push(this.appearances[0]);
                    this.components[i].currAppearance++;
                }
            }
        }
    }
}

MyComponent.prototype.addAnimation = function(animation)
{
    this.animations.push(animation);
}

MyComponent.prototype.update = function(dt)
{
    for(var i = 0; i < this.animations.length; i++)
    {
        this.currentAnimation[i] = this.animations[i].getPosition(dt);
        
        if(!this.animations[i].over)
        {
            break;
        }
    }

    for(var i = 0; i < this.components.length; i++)
    {
        if(this.components[i] instanceof MyComponent)
        {
            this.components[i].update(dt);
        }
    }
}

MyComponent.prototype.applyAnimations = function()
{
    for(var i = 0; i < this.currentAnimation.length; i++)
    {
        this.currentAnimation[i].apply(this.scene);
    }
}

MyComponent.prototype.changePoint = function(direction)
{
   
    for(var i = 0; i < this.components.length; i++)
    {
        if(this.components[i] instanceof MyComponent)
        {
            this.components[i].changePoint(direction);
        }

         if(this.components[i] instanceof Chessboard)
        {
            this.components[i].changePoint(direction);
        }
    }

}