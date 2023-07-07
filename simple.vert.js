
// Q4) ?
// Escreva o shader de vértices adequado ao programa
export default
`#version 300 es
precision highp float;

in vec4 position;
in vec4 color;

uniform float u_T;
uniform float u_S;

out vec4 vColor;

void main()
{
    gl_Position = position;
    vColor = color;
}`

