
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
    gl_Position.xy = position.xy * u_S + vec2(u_T-0.08,-0.6); 
    vColor = color;
}`

