function glsl(str: TemplateStringsArray): string {
  return str as unknown as string;
}

export const fragmentShaderSource = glsl`
    // this is the fragment (or pixel) shader

    precision mediump float; // set float to medium precision
    uniform vec4 uPixelColor; // uniform means it is a constant

    void main(void) {
        // for every pixel called (within the square) sets
        // constant color white with alpha-channel value of 1.0
        gl_FragColor = uPixelColor;
        }
        // End of fragment/pixel shader
`;
