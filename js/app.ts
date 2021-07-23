//import * as THREE from "three";
const NB_STRIPES = 13;
const COLORS = [
  "#f0c101",
  "#90b623",
  "#6aa74a",
  "#4e9577",
  "#357ab5",
  "#4067aa",
  "#7b426b",
  "#974971",
  "#b4534d",
  "#c35530",
  "#d1672b",
  "#e19202",
  "#eebf00"
]

const VERTEX_SHADER_ID = "vertex-shader-2d";
const FRAGMENT_SHADER_ID = "fragment-shader-2d";
const FRAGMENT_SHADER_ID_SPECTRUM = "fragment-shader-2d-spectrum";


function getCanvas() : HTMLCanvasElement {
  let canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if(!canvas) {
    throw "cannot find the canvas in the page";
  }
  return canvas;
}

function getContext(canvas: HTMLCanvasElement) : WebGLRenderingContext {
  let context = canvas.getContext("webgl");
  if(!context) {
    throw "cannot find the context in the page";
  }
  return context;
}

function drawStripe(x: number, y: number, width : number, height: number, color: string | THREE.Color = COLORS[0]) {
  const material = new THREE.MeshBasicMaterial( { color } );
  const plane = new THREE.PlaneGeometry(width, height);
  const planeMesh = new THREE.Mesh(plane, material);
  planeMesh.position.set(x, y, -0.3);
  return planeMesh;
}

function createFrame(frameSize: number, materialFrame: THREE.ShaderMaterial) {
  //const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
  const plane = new THREE.PlaneGeometry(1, 1);
  const planeMesh = new THREE.Mesh(plane, materialFrame);
  planeMesh.position.setZ(-0.5);

  const material2 = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
  const plane2 = new THREE.PlaneGeometry(1-frameSize, 1-frameSize);
  const planeMesh2 = new THREE.Mesh(plane2, material2);
  planeMesh2.position.setZ(-0.4);
  return [planeMesh, planeMesh2];
}


function main() {
  const canvas = getCanvas();
  canvas.width  = window.innerHeight;
  canvas.height = window.innerHeight;

  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.setClearColor( 0x000000, 1.0 );
  

  const camera = new THREE.OrthographicCamera(
    -0.5, // left
     0.5, // right
     0.5, // top
    -0.5, // bottom
    -0.5, // near,
     0.5, // far
  );
  const scene = new THREE.Scene();
  const plane = new THREE.PlaneGeometry(0.25, 0.25);


  const fragmentShaderSourceNode = document.getElementById(FRAGMENT_SHADER_ID)
  if(!fragmentShaderSourceNode) {
    console.error(`Cannot find id ${FRAGMENT_SHADER_ID} in the dom`)
    return;
  }
  const fragmentShader = fragmentShaderSourceNode.innerText;

  const fragmentShaderSpectrumSourceNode = document.getElementById(FRAGMENT_SHADER_ID_SPECTRUM)
  if(!fragmentShaderSpectrumSourceNode) {
    console.error(`Cannot find id ${FRAGMENT_SHADER_ID_SPECTRUM} in the dom`)
    return;
  }
  const fragmentShaderSpectrum = fragmentShaderSpectrumSourceNode.innerText;

  const uniforms = {
    iTime: { value: 0 },
    iResolution:  { value: new THREE.Vector3() },
  };
  const material = new THREE.ShaderMaterial({
    fragmentShader,
    uniforms,
  });

  const uniformsSpectrum = {
    iTime: { value: 1 },
    vertexColor:  { value: new THREE.Vector4(1, 1, 1, 1) },
  };
  const materialSpectrum = new THREE.ShaderMaterial({
    fragmentShader: fragmentShaderSpectrum,
    uniforms: uniformsSpectrum,
  });

  const matrixHeight = 1.0;
  const matrixWidth = 1.0;
  const frameSize = 0.1;

  const heightStripe = matrixHeight - frameSize;
  const widthStripe = (matrixWidth -frameSize) / NB_STRIPES;
  for(let index = 0; index < NB_STRIPES; ++index) {
    let stripe = drawStripe(-((matrixWidth-frameSize)/2) + (widthStripe/2) + (((matrixWidth - frameSize)*index)/NB_STRIPES), 0, widthStripe, heightStripe, COLORS[index]);
    scene.add(stripe);
  }

  const planeMesh = new THREE.Mesh(plane, material);
  scene.add(planeMesh);

  const frame = createFrame(frameSize, materialSpectrum);
  scene.add(...frame);

  function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time: number) {
    time *= 0.001;  // convert to seconds

    resizeRendererToDisplaySize(renderer);

    const canvas = renderer.domElement;
    uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
    uniforms.iTime.value = time;

    uniformsSpectrum.vertexColor.value.set(1, 0, 1, 1);
    uniformsSpectrum.iTime.value = time;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}



window.addEventListener("load", function(event) {
  main();
});
