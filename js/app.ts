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


/*function drawStripe(webGLContext: WebGLRenderingContext, x: number, y: number, width : number, height: number) : void {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;
  webGLContext.bufferData(webGLContext.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2,
  ]), webGLContext.STATIC_DRAW);
}

*/
function drawStripe(x: number, y: number, width : number, height: number, color: string | THREE.Color = COLORS[0]) {
  const material = new THREE.MeshBasicMaterial( { color } );
  const plane = new THREE.PlaneGeometry(width, height);
  const planeMesh = new THREE.Mesh(plane, material);
  planeMesh.position.set(x, y, -0.5);
  return planeMesh;
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
  const plane = new THREE.PlaneGeometry(0.75, 0.5);


  const fragmentShaderSourceNode = document.getElementById(FRAGMENT_SHADER_ID)
  if(!fragmentShaderSourceNode) {
    console.error(`Cannot find id ${FRAGMENT_SHADER_ID} in the dom`)
    return;
  }
  const fragmentShader = fragmentShaderSourceNode.innerText;
  const uniforms = {
    iTime: { value: 0 },
    iResolution:  { value: new THREE.Vector3() },
  };
  const material = new THREE.ShaderMaterial({
    fragmentShader,
    uniforms,
  });

  const heightStripe = 1.0;
  const widthStripe = 1/NB_STRIPES;
  for(let index = 0; index < NB_STRIPES; ++index) {
    let stripe = drawStripe(-0.5 + (widthStripe/2) + (index/NB_STRIPES), 0, widthStripe, heightStripe, COLORS[index]);
    scene.add(stripe);
  }

  //const planeMesh = new THREE.Mesh(plane, material);
  //scene.add(planeMesh);

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

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}



window.addEventListener("load", function(event) {
  main();
});
