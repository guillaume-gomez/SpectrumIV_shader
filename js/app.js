//import * as THREE from "three";
var NB_STRIPES = 13;
var COLORS = [
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
];
var VERTEX_SHADER_ID = "vertex-shader-2d";
var FRAGMENT_SHADER_ID = "fragment-shader-2d";
var FRAGMENT_SHADER_ID_SPECTRUM = "fragment-shader-2d-spectrum";
function getCanvas() {
    var canvas = document.getElementById("canvas");
    if (!canvas) {
        throw "cannot find the canvas in the page";
    }
    return canvas;
}
function getContext(canvas) {
    var context = canvas.getContext("webgl");
    if (!context) {
        throw "cannot find the context in the page";
    }
    return context;
}
function drawStripe(x, y, width, height, color) {
    if (color === void 0) { color = COLORS[0]; }
    var material = new THREE.MeshBasicMaterial({ color: color });
    var plane = new THREE.PlaneGeometry(width, height);
    var planeMesh = new THREE.Mesh(plane, material);
    planeMesh.position.set(x, y, -0.3);
    return planeMesh;
}
function createFrame(frameSize, materialFrame) {
    //const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    var plane = new THREE.PlaneGeometry(1, 1);
    var planeMesh = new THREE.Mesh(plane, materialFrame);
    planeMesh.position.setZ(-0.5);
    var material2 = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    var plane2 = new THREE.PlaneGeometry(1 - frameSize, 1 - frameSize);
    var planeMesh2 = new THREE.Mesh(plane2, material2);
    planeMesh2.position.setZ(-0.4);
    return [planeMesh, planeMesh2];
}
function main() {
    var canvas = getCanvas();
    canvas.width = window.innerHeight;
    canvas.height = window.innerHeight;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setClearColor(0x000000, 1.0);
    var camera = new THREE.OrthographicCamera(-0.5, // left
    0.5, // right
    0.5, // top
    -0.5, // bottom
    -0.5, // near,
    0.5);
    var scene = new THREE.Scene();
    var plane = new THREE.PlaneGeometry(0.25, 0.25);
    var fragmentShaderSourceNode = document.getElementById(FRAGMENT_SHADER_ID);
    if (!fragmentShaderSourceNode) {
        console.error("Cannot find id " + FRAGMENT_SHADER_ID + " in the dom");
        return;
    }
    var fragmentShader = fragmentShaderSourceNode.innerText;
    var fragmentShaderSpectrumSourceNode = document.getElementById(FRAGMENT_SHADER_ID_SPECTRUM);
    if (!fragmentShaderSpectrumSourceNode) {
        console.error("Cannot find id " + FRAGMENT_SHADER_ID_SPECTRUM + " in the dom");
        return;
    }
    var fragmentShaderSpectrum = fragmentShaderSpectrumSourceNode.innerText;
    var uniforms = {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector3() },
    };
    var material = new THREE.ShaderMaterial({
        fragmentShader: fragmentShader,
        uniforms: uniforms,
    });
    var uniformsSpectrum = {
        iTime: { value: 1 },
        vertexColor: { value: new THREE.Vector4(1, 1, 1, 1) },
    };
    var materialSpectrum = new THREE.ShaderMaterial({
        fragmentShader: fragmentShaderSpectrum,
        uniforms: uniformsSpectrum,
    });
    var matrixHeight = 1.0;
    var matrixWidth = 1.0;
    var frameSize = 0.1;
    var heightStripe = matrixHeight - frameSize;
    var widthStripe = (matrixWidth - frameSize) / NB_STRIPES;
    for (var index = 0; index < NB_STRIPES; ++index) {
        var stripe = drawStripe(-((matrixWidth - frameSize) / 2) + (widthStripe / 2) + (((matrixWidth - frameSize) * index) / NB_STRIPES), 0, widthStripe, heightStripe, COLORS[index]);
        scene.add(stripe);
    }
    /*const planeMesh = new THREE.Mesh(plane, material);
    scene.add(planeMesh);
  */
    var frame = createFrame(frameSize, materialSpectrum);
    scene.add.apply(scene, frame);
    function resizeRendererToDisplaySize(renderer) {
        var canvas = renderer.domElement;
        var width = canvas.clientWidth;
        var height = canvas.clientHeight;
        var needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }
    function render(time) {
        time *= 0.001; // convert to seconds
        resizeRendererToDisplaySize(renderer);
        var canvas = renderer.domElement;
        uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
        uniforms.iTime.value = time;
        //uniformsSpectrum.vertexColor.value.set(1, 0, 1, 1);
        uniformsSpectrum.iTime.value = time;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
window.addEventListener("load", function (event) {
    main();
});
//# sourceMappingURL=app.js.map