function Coords(x, y, z) {

    this.x = x || 0.0;
    this.y = y || 0.0;
    this.z = z || 0.0;
}

Coords.prototype.getX = function()
{
    return this.x;
}

Coords.prototype.getY = function()
{
    return this.y;
}

Coords.prototype.getZ = function()
{
    return this.z;
}