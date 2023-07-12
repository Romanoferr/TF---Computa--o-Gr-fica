import Camera from './camera.js';
import Light from './light.js';
import Mesh from './mesh.js';

class Scene {
  constructor(gl) {
    // Camera virtual
    this.cam = new Camera(gl);

    // Luz
    this.light1 = new Light('fixa');  // tá 'funcionando só a segunda luz criada
    this.light2 = new Light('n');     // tem descobrir como mudar a posicao de um ponto de luz

    // Mesh
    this.mesh = new Mesh( 1.0);
    this.copy = new Mesh(-1.0);
  }

  async init(gl) {
    await this.mesh.loadMeshV4();
    this.mesh.init(gl, this.light1);
    this.mesh.init(gl, this.light2);

    await this.copy.loadMeshV4()
    this.copy.init(gl, this.light1);
    this.copy.init(gl, this.light2);
  }

  draw(gl) {  
    this.cam.updateCam();
    this.light1.updateLight();
    this.light2.updateLight();

    this.mesh.draw(gl, this.cam, this.light1);
    this.copy.draw(gl, this.cam, this.light1);

    this.mesh.draw(gl, this.cam, this.light2);
    this.copy.draw(gl, this.cam, this.light2);
  }
}

class Main {
  constructor() {
    const canvas = document.querySelector("#glcanvas");

    this.gl = canvas.getContext("webgl2");
    this.setViewport();

    this.scene = new Scene(this.gl);
    this.scene.init(this.gl).then(() => {
      this.draw();
    });
  }

  setViewport() {
    var devicePixelRatio = window.devicePixelRatio || 1;
    this.gl.canvas.width = 1024 * devicePixelRatio;
    this.gl.canvas.height = 768 * devicePixelRatio;

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }

  draw() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.scene.draw(this.gl);

    requestAnimationFrame(this.draw.bind(this));
  }
}

window.onload = () => {
  const app = new Main();
  app.draw();
}


