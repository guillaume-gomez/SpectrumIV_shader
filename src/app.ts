import * as THREE from "three";
import FRAGMENT_SHADER_SPECTRUM from "./shaders/fragment/spectrum";
import RAINBOW_FRAGMENT_SHADER from "./shaders/fragment/rainbow";
//import VERTEX_SHADER from "./vertex-shader-2d";


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

const ENABLE_SHADER_ID = "enable-shader";

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if(!result || result.length <= 2) {
    throw "Error cannot convert "
  }

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

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

function drawStripe(x: number, y: number, width : number, height: number, material: THREE.ShaderMaterial) {
  const plane = new THREE.PlaneGeometry(width, height);
  const planeMesh = new THREE.Mesh(plane, material);
  planeMesh.position.set(x, y, 0);
  return planeMesh;
}

function createFrame(frameSize: number) {
  const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
  const plane = new THREE.PlaneGeometry(1, 1);
  const planeMesh = new THREE.Mesh(plane, material);
  planeMesh.position.setZ(-0.1);

  const material2 = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
  const plane2 = new THREE.PlaneGeometry(1-frameSize/2, 1-frameSize/2);
  const planeMesh2 = new THREE.Mesh(plane2, material2);
  planeMesh2.position.setZ(-0.1);

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

  const rainbowFragmentShader = RAINBOW_FRAGMENT_SHADER;
  const fragmentShaderSpectrum = FRAGMENT_SHADER_SPECTRUM;

  const uniforms = {
    iTime: { value: 0 },
    iResolution:  { value: new THREE.Vector3() },
  };
  const material = new THREE.ShaderMaterial({
    fragmentShader: rainbowFragmentShader,
    uniforms,
  });

  const matrixHeight = 1.0;
  const matrixWidth = 1.0;
  const frameSize = 0.2;

  const uniformsSpectrums : Object[] = [];
  const materialSpectrums : THREE.ShaderMaterial[] = [];

  const heightStripe = matrixHeight - frameSize;
  const widthStripe = (matrixWidth -frameSize) / NB_STRIPES;
  for(let index = 0; index < NB_STRIPES; ++index) {

    const rgb = hexToRgb(COLORS[index]);
    const uniformsSpectrum = {
      iTime: { value: 1 },
      iResolution:  { value: new THREE.Vector3() },
      vertexColor:  { value: new THREE.Vector3(rgb.r/255, rgb.g/255, rgb.b/255) },
    };
    uniformsSpectrums.push(uniformsSpectrum);

    const materialSpectrum = new THREE.ShaderMaterial({
      fragmentShader: fragmentShaderSpectrum,
      uniforms: uniformsSpectrum,
    });
    materialSpectrums.push(materialSpectrum);

    let stripe = drawStripe(-((matrixWidth-frameSize)/2) + (widthStripe/2) + (((matrixWidth - frameSize)*index)/NB_STRIPES), 0, widthStripe, heightStripe, materialSpectrum);
    scene.add(stripe);
  }

  /*const planeMesh = new THREE.Mesh(plane, material);
  planeMesh.position.setZ(0.2);
  scene.add(planeMesh);*/

  const frame = createFrame(frameSize);
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

    //uniformsSpectrum.vertexColor.value.set(1, 0, 1, 1);
    uniformsSpectrums.forEach((uniformsSpectrum: any) => {
      if(enableShader) {
        uniformsSpectrum.iResolution.value.set(canvas.width, canvas.height, 1);
        uniformsSpectrum.iTime.value = time;
      } else {
        //reset
        uniformsSpectrum.iTime.value = Math.PI / 2;
      }
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}



// global variables
let enableShader = true;

window.addEventListener("load", function(event) {
  main();

  const checkbox = document.getElementById(ENABLE_SHADER_ID);
  if(checkbox) {
    checkbox.addEventListener("change", (event: Event) => {
      const { checked } = event.target as HTMLInputElement;
      enableShader = checked;
    })
  }
});
