function MyTransformation()
{
    this.type;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.ang = 0;
}

MyTransformation.prototype.setTranslate = function(x, y, z)
{
    this.type = "Translate";
    this.x = x;
    this.y = y;
    this.z = z;
}

MyTransformation.prototype.setScale = function(x, y, z)
{
    this.type = "Scale";
    this.x = x;
    this.y = y;
    this.z = z;
}

MyTransformation.prototype.setRotate = function(x, y, z, ang)
{
    this.type = "Rotate";
    this.x = x;
    this.y = y;
    this.z = z;
    this.ang = ang;
}

MyTransformation.prototype.apply = function(scene)
{
    if(this.type == "Translate")
    {
        scene.translate(this.x, this.y, this.z);
    }

    if(this.type == "Scale")
    {
        scene.scale(this.x, this.y, this.z);
    }

    if(this.type == "Rotate")
    {
        scene.rotate(this.ang, this.x, this.y, this.z);
    }
}