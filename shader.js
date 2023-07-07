export default class Shader {
  static createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      var info = gl.getShaderInfoLog(shader);
      console.log('Could not compile WebGL program:' + info);
    }

    return shader;
  }

  static createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      var info = gl.getProgramInfoLog(program);
      console.log('Could not compile WebGL program:' + info);
    }

    return program;
  }

  static isArrayBuffer(value) {
    return value && value.buffer instanceof ArrayBuffer && value.byteLength !== undefined;
  }

  static createVertexBufferObject(gl, objData) {
    var vbo = gl.createBuffer();
    var indexBuffer = gl.createBuffer();
  
    // Ligar o VBO
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  
    // Carregar os dados dos vértices para o VBO
      // Calcular corretamente a quantidade de bytes em objData.indices?
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objData.vertices), gl.STATIC_DRAW); // checar tamanho
  
    // Configurar o atributo de posição dos vértices
    var positionAttributeLocation = 1; //TODO: check pq quando coloca 0 isso aqui some?
    var positionSize = 3; // Os vértices têm 3 componentes (x, y, z)
    var positionType = gl.FLOAT; // O tipo de dado dos vértices
    var positionNormalize = false;
    var positionStride = 0;
    var positionOffset = 0;
    gl.vertexAttribPointer(
      positionAttributeLocation,
      positionSize,
      positionType,
      positionNormalize,
      positionStride,
      positionOffset
    );
    gl.enableVertexAttribArray(positionAttributeLocation); // TODO: check
  
    // Ligar o buffer de índices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  
    // Carregar os dados dos índices
        // Calcular corretamente a quantidade de bytes em objData.indices?
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(objData.indices), gl.STATIC_DRAW);
  
    // Desligar o VBO
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
    return { vbo, indexBuffer, numIndices: objData.indices.length };
  }
}