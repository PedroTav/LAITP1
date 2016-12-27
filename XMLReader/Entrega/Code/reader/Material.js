function Material(scene, id, emission, ambient, diffuse, specular, shininess)
{
    this.scene = scene;

    this.appearance = new CGFappearance(scene);

    this.id = id || "";

    this.emission = emission || [-1,-1,-1,-1];
    this.ambient = ambient || [-1,-1,-1,-1];
    this.diffuse = diffuse || [-1,-1,-1,-1];
    this.specular = specular || [-1,-1,-1,-1];

    this.shininess = shininess || -1;

    this.applied = false;

    if(this.emission[0] != -1)
    {
        this.applied = true;
        this.appearance.setEmission(emission[0], emission[1], emission[2], emission[3]);
    }

    if(this.ambient[0] != -1)
    {
        this.applied = true;
        this.appearance.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
    }

    if(this.diffuse[0] != -1)
    {
        this.applied = true;
        this.appearance.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
    }

    if(this.specular[0] != -1)
    {
        this.applied = true;
        this.appearance.setSpecular(specular[0], specular[1], specular[2], specular[3]);
    }

    if(this.shininess != -1)
    {
        this.applied = true;
        this.appearance.setShininess(shininess);
    }
}

Material.prototype.applyMaterial = function()
{
    if(this.applied)
    {
        this.appearance.apply();
    }
}