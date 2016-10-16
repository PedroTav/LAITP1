function Texture(scene, id, filePath, length_s, length_t)
{
    this.scene = scene;

    this.id = id || "none";

    this.appearance = new CGFappearance(scene);

    this.filePath = filePath || "none"

    if(this.filePath != "none")
    {
        this.appearance.loadTexture(filePath);
    }

    this.length_s = length_s || 1;
    this.length_t = length_t || 1;
}

Texture.prototype.applyTexture = function()
{
    this.appearance.apply();
}