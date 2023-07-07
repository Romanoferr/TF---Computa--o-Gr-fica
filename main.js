import vertShaderSrc from './simple.vert.js';
import fragShaderSrc from './simple.frag.js';

import Shader from './shader.js';

var objFileContent;

class Scene {
  constructor(gl) {
    this.objData = [];
    
    this.mat = mat4.create();
    this.translate = 0;

    this.vertShd = null;
    this.fragShd = null;
    this.program = null;

    this.vaoLoc = -1;

    this.init(gl);
    this.fetchOBJFile(gl);
  }

  init(gl) {
    this.createShaderProgram(gl);
    this.createUniforms(gl);
  }

  createShaderProgram(gl) {
    this.vertShd = Shader.createShader(gl, gl.VERTEX_SHADER, vertShaderSrc);
    this.fragShd = Shader.createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);
    this.program = Shader.createProgram(gl, this.vertShd, this.fragShd);

    gl.useProgram(this.program);
  }

  createUniforms(gl) {
    this.matLoc = gl.getUniformLocation(this.program, "u_mat");

    this.uniformTranslate = gl.getUniformLocation(this.program, "u_T");
    gl.uniform1f(this.uniformTranslate, 0.5);

    this.uniformScale = gl.getUniformLocation(this.program, "u_S");
    gl.uniform1f(this.uniformScale, 0.5);
  }

  loadOBJFile(objFileName) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
  
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.responseText);
          } else {
            reject(new Error("Error loading file: " + xhr.status));
          }
        }
      };
  
      xhr.open("GET", objFileName, true);
      xhr.send();
    });
  }
  
  // Usage de async/await
  async fetchOBJFile(gl) {
    try {
      objFileContent = await this.loadOBJFile('inputs/bunny.obj');
      this.renderScene(gl, objFileContent);
    
    } catch (error) {
      console.log(error);
    }
  }

  preParseData(data){
    data = data.split('\n');
    return data
  }

  loadOBJ(file) {
    var vertices = [];
    var normals = [];
    var indices = [];

    var file = this.preParseData(file);

    console.log(file);
  
    for (var i = 0; i < file.length; i++) {
      var line = file[i];
  
      if (line.startsWith("v ")) {
        var values = line.split(" ");
        var x = parseFloat(values[1]);
        var y = parseFloat(values[2]);
        var z = parseFloat(values[3]);
        vertices.push(x, y, z);
      } else if (line.startsWith("vn ")) {
        var values = line.split(" ");
        var x = parseFloat(values[1]);
        var y = parseFloat(values[2]);
        var z = parseFloat(values[3]);
        normals.push(x, y, z);
      } else if (line.startsWith("f ")) {
        var values = line.split(" ");
  
        for (var j = 1; j < values.length; j++) {
          var vertexData = values[j].split("/");
          var vertexIndex = parseInt(vertexData[0]); 
          indices.push(vertexIndex);
        }
      }
    }

    console.log(vertices);
    console.log(normals);
    console.log(indices);
    return { vertices, normals, indices };
  }

  renderScene(gl, objFileContent) {
    var objData = this.loadOBJ(objFileContent);

    console.log(objData);
    var objVBO = Shader.createVertexBufferObject(gl, objData);
    gl.bindBuffer(gl.ARRAY_BUFFER, objVBO.vbo);

      // Configurar o atributo de posição dos vértices
  var positionAttributeLocation = 0;
  var positionSize = 3; // Os vértices têm 3 componentes (x, y, z)
  var positionType = gl.FLOAT; // O tipo de dado dos vértices
  var positionNormalize = false; // Não normalizar os dados
  var positionStride = 0; // 0 = usar o tamanho padrão do tipo de dado e número de componentes
  var positionOffset = 0; // Começar no início do buffer de vértices
  
  gl.vertexAttribPointer(
    positionAttributeLocation,
    positionSize,
    positionType,
    positionNormalize,
    positionStride,
    positionOffset
  );
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Ligar o buffer de índices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objVBO.indexBuffer);

  // Renderizar os vértices
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = objVBO.numIndices;
  gl.drawElements(primitiveType, count, gl.UNSIGNED_SHORT, offset);

  // Desligar o VBO
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  }

  objectTransformation(gl) {}

}

class Main {
  constructor() {
    const canvas = document.querySelector("#glcanvas");
    this.gl = canvas.getContext("webgl2");

    var devicePixelRatio = window.devicePixelRatio || 1;
    this.gl.canvas.width = 1024 * devicePixelRatio;
    this.gl.canvas.height = 768 * devicePixelRatio;

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    this.scene = new Scene(this.gl);
  }
}

window.onload = () => {
  const app = new Main();
  // app.draw();
}
