import * as THREE from "three";
import FRAGMENT_SHADER_SPECTRUM from "./shaders/fragment/spectrum";
import GRADIENT_FRAGMENT_SHADER from "./shaders/fragment/gradient";
import RAINBOW_FRAGMENT_SHADER from "./shaders/fragment/rainbow";
import FRAGMENT_SHADER_BLACK_STRIPES from "./shaders/fragment/black_stripes";
import FRAGMENT_SHADER_WAVE_X from "./shaders/fragment/wave_x";
import FRAGMENT_SHADER_MOVING_DOT from "./shaders/fragment/moving_dot";
import FRAGMENT_SHADER_NOISE_X from "./shaders/fragment/noise_x";
import FRAGMENT_SHADER_LINE_MOUSE from "./shaders/fragment/line_mouse";
import FRAGMENT_SHADER_ROT_SQUARE from "./shaders/fragment/rot_square";
import FRAGMENT_SHADER_VCR from "./shaders/fragment/vcr";
//import VERTEX_SHADER from "./shaders/vertex/vertex-shader-2d";

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
const SHADER_EVENT_ID = "shader-events";

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


function resizeCanvas(renderer: THREE.WebGLRenderer, camera : THREE.OrthographicCamera) {
  const canvasLayout = document.getElementById("canvas-layout");
      if(!canvasLayout) {
        throw new Error("cannot find canvas layout id");
      }

      let canvas = getCanvas();
      const size = Math.min(
        Math.min(canvasLayout.offsetWidth, canvasLayout.offsetHeight),
        window.innerHeight
      );

      canvasLayout.style.height = `${size + 10 }px`;
      //camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(size, size);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function main() {
  const canvas = getCanvas();

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
  resizeCanvas(renderer, camera);
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

  const heightStripe = matrixHeight - frameSize;
  const widthStripe = (matrixWidth -frameSize) / NB_STRIPES;
  for(let index = 0; index < NB_STRIPES; ++index) {

    const rgb = hexToRgb(COLORS[index]);
    const uniformsSpectrum = {
      iTime: { value: 1 },
      iResolution:  { value: new THREE.Vector3() },
      vertexColor:  { value: new THREE.Vector3(rgb.r/255, rgb.g/255, rgb.b/255) },
      iMouse: { value: new THREE.Vector2() }
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

  function render(time: number) {
    time *= 0.001;  // convert to seconds
    const canvas = renderer.domElement;
    uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
    uniforms.iTime.value = time;


    //uniformsSpectrum.vertexColor.value.set(1, 0, 1, 1);
    uniformsSpectrums.forEach((uniformsSpectrum: any) => {
      
      if(stateShader !== "disabled") {
        uniformsSpectrum.iMouse.value.x = mousePositions.x;
        uniformsSpectrum.iMouse.value.y = mousePositions.y;

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

  window.addEventListener('resize', () =>
  {
      // Update sizes
      resizeCanvas(renderer, camera);
  });

  window.addEventListener('dblclick', () =>
  {
      const fullscreenElement = document.fullscreenElement;
      if(!canvas) {
          return;
      }

      if(!fullscreenElement)
      {
          if(canvas.requestFullscreen)
          {
              canvas.requestFullscreen()
          }
      }
      else
      {
          if(document.exitFullscreen)
          {
              document.exitFullscreen()
          }

      }
  })

}


type StateShaderType =
  "disabled"|
  "gradient" |
  "mouse-gradient-y"|
  "black-stripes" |
  "wave-x" |
  "noise-x"|
  "line-mouse"|
  "rotation-square"|
  "vcr"
  ;
// global variables
let stateShader : StateShaderType = "gradient";
let mousePositions = { x: 0, y: 0};

let uniformsSpectrums : Object[] = [];
let materialSpectrums : THREE.ShaderMaterial[] = [];

function switchShaderForSpectrum(shaderString: string, spectrumMaterials: THREE.ShaderMaterial[]) {
  spectrumMaterials.forEach(spectrumMaterial => {
    spectrumMaterial.fragmentShader = shaderString;
    spectrumMaterial.needsUpdate=true;
  });
}

window.addEventListener("load", function(event) {
  main();

  document.onmousemove = function(e) {
    mousePositions.x = e.pageX / window.innerWidth;
    mousePositions.y = e.pageY / window.innerHeight;
  }

  const select = document.getElementById(SHADER_EVENT_ID);
  if(select) {
    (select as HTMLInputElement).value = "gradient";
    select.addEventListener("change", (event: Event) => {
      const { value } = event.target as HTMLInputElement;
      stateShader = value as StateShaderType;
      switch(value) {
        case "gradient":
          switchShaderForSpectrum(FRAGMENT_SHADER_SPECTRUM, materialSpectrums);
          break;
        case "mouse-gradient-y":
          switchShaderForSpectrum(GRADIENT_FRAGMENT_SHADER, materialSpectrums);
          break;
        case "black-stripes":
          switchShaderForSpectrum(FRAGMENT_SHADER_BLACK_STRIPES, materialSpectrums);
          break;
        case "wave-x":
          switchShaderForSpectrum(FRAGMENT_SHADER_WAVE_X, materialSpectrums);
          break;
        case "moving-dot":
          switchShaderForSpectrum(FRAGMENT_SHADER_MOVING_DOT, materialSpectrums);
          break;
        case "noise-x":
          switchShaderForSpectrum(FRAGMENT_SHADER_NOISE_X, materialSpectrums);
          break;
        case "line-mouse":
          switchShaderForSpectrum(FRAGMENT_SHADER_LINE_MOUSE, materialSpectrums);
          break;
        case "rotation-square":
          switchShaderForSpectrum(FRAGMENT_SHADER_ROT_SQUARE, materialSpectrums);
          break;
        case "vcr":
          switchShaderForSpectrum(FRAGMENT_SHADER_VCR, materialSpectrums);
          break;
        case "disabled":
        default:
          break;
      }
    });
  }

});