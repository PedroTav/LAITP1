function Texture(scene, id, filePath, length_s, length_t)
{
    this.scene = scene;

    this.id = id || "none";

    this.appearance = new CGFappearance(scene);

    this.filePath = filePath || "none"

    this.textured = false;

    if(this.filePath != "none")
    {
        this.textured = true;
        this.appearance.loadTexture(filePath);
    }

    this.length_s = length_s || 1;
    this.length_t = length_t || 1;
}

Texture.prototype.applyTexture = function()
{
    if(this.textured)
    {
        this.appearance.apply();
    }
}