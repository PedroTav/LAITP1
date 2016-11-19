#ifdef GL_ES
precision highp float;
#endif

varying vec4 coords;

uniform float div;
uniform vec4 c1;
uniform vec4 c2;
uniform vec4 cs;
uniform int su;
uniform int sv;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main() {

    highp int yi = int(vTextureCoord.y*div);
    highp int xi = int(vTextureCoord.x*div);

    highp int y = int(mod((vTextureCoord.y * div), 2.0));
    highp int x = int(mod((vTextureCoord.x * div), 2.0));

    gl_FragColor = texture2D(uSampler, vTextureCoord);

    if(xi == su && yi == sv)
	{
	    gl_FragColor = gl_FragColor*cs;
	}
	else
    {
        if (x == y)
        {
            gl_FragColor = gl_FragColor*c1;
        }
        else
        {
            gl_FragColor = gl_FragColor*c2;
        }
    }
}