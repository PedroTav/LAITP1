#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float div;
uniform int su2;
uniform int sv2;

varying vec2 vTextureCoord;

void main() {
    vTextureCoord = aTextureCoord;

    highp int yi = int(vTextureCoord.y*div);
    highp int xi = int(vTextureCoord.x*div);

    vec4 v = vec4(aVertexPosition, 1.0);

    if(xi == su2 && yi == sv2 || xi == su2 + 1 && yi == sv2 || xi == su2  && yi == sv2 + 1 || xi == su2 + 1 && yi == sv2 + 1)
    {
        v.z += 0.1;
    }

	gl_Position = uPMatrix * uMVMatrix * v;
}
