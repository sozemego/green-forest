export const WindShader = {
  uniforms: {
    time: { type: "f", value: 0 }
  },

  vertexShader: [
    "varying vec2 vUv;",
    "uniform float time;",
    "void main(){",
    "  vUv = uv;",
    "  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1);",
    "}"
  ].join("\n"),

  fragmentShader: [
    "uniform sampler2D texture1;",
    "varying vec2 vUv;",
    "uniform float time;",
    "vec2 Wave( vec2 p ) {",
    "    float x = cos(6.28 * time) * 0.025 * p.y;",
    "    return vec2(p.x + x, p.y);",
    "}",
    "void main(){",
    "  gl_FragColor = texture2D(texture1, Wave(vUv));",
    "}"
  ].join("\n")
};
