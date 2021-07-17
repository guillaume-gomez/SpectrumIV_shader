var NB_STRIPES = 13;
var COLORS = [
    { r: 240 / 255, g: 193 / 255, b: 1 / 255 },
    { r: 144 / 255, g: 182 / 255, b: 35 / 255 },
    { r: 106 / 255, g: 167 / 255, b: 74 / 255 },
    { r: 78 / 255, g: 149 / 255, b: 119 / 255 },
    { r: 53 / 255, g: 122 / 255, b: 181 / 255 },
    { r: 64 / 255, g: 103 / 255, b: 170 / 255 },
    { r: 123 / 255, g: 66 / 255, b: 107 / 255 },
    { r: 151 / 255, g: 73 / 255, b: 113 / 255 },
    { r: 180 / 255, g: 83 / 255, b: 77 / 255 },
    { r: 195 / 255, g: 85 / 255, b: 48 / 255 },
    { r: 209 / 255, g: 103 / 255, b: 43 / 255 },
    { r: 225 / 255, g: 146 / 255, b: 2 / 255 },
    { r: 238 / 255, g: 191 / 255, b: 0 / 255 },
];
var VERTEX_SHADER_ID = "vertex-shader-2d";
var FRAGMENT_SHADER_ID = "fragment-shader-2d";
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
function createShader(webGLContext, type, source) {
    var shader = webGLContext.createShader(type);
    if (!shader) {
        throw "the shader cannot be created";
    }
    webGLContext.shaderSource(shader, source);
    webGLContext.compileShader(shader);
    var success = webGLContext.getShaderParameter(shader, webGLContext.COMPILE_STATUS);
    if (!success) {
        console.error(webGLContext.getShaderInfoLog(shader));
        webGLContext.deleteShader(shader);
        throw "the shader has not the been compiled";
    }
    return shader;
}
function createProgram(webGLContext, vertexShader, fragmentShader) {
    var program = webGLContext.createProgram();
    if (!program) {
        throw "the program cannot be created";
    }
    webGLContext.attachShader(program, vertexShader);
    webGLContext.attachShader(program, fragmentShader);
    webGLContext.linkProgram(program);
    var success = webGLContext.getProgramParameter(program, webGLContext.LINK_STATUS);
    if (!success) {
        console.error(webGLContext.getProgramInfoLog(program));
        webGLContext.deleteProgram(program);
        throw "the program cannot be built";
    }
    return program;
}
function resizeCanvasToDisplaySize(canvas) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    var displayWidth = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;
    // Check if the canvas is not the same size.
    var needResize = canvas.width !== displayWidth ||
        canvas.height !== displayHeight;
    if (needResize) {
        // Make the canvas the same size
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
    return needResize;
}
function setRectangle(webGLContext, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    webGLContext.bufferData(webGLContext.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]), webGLContext.STATIC_DRAW);
}
// Returns a random integer from 0 to range - 1.
function randomInt(range) {
    return Math.floor(Math.random() * range);
}
window.addEventListener("load", function (event) {
    /// --------LOAD THE SHADERS---------------- ///
    var vertexShaderSourceNode = document.getElementById(VERTEX_SHADER_ID);
    if (!vertexShaderSourceNode) {
        console.error("Cannot find id " + VERTEX_SHADER_ID + " in the dom");
        return;
    }
    var vertexShaderSource = vertexShaderSourceNode.innerText;
    var fragmentShaderSourceNode = document.getElementById(FRAGMENT_SHADER_ID);
    if (!fragmentShaderSourceNode) {
        console.error("Cannot find id " + FRAGMENT_SHADER_ID + " in the dom");
        return;
    }
    var fragmentShaderSource = fragmentShaderSourceNode.innerText;
    /// ------------------------ ///
    var canvas = getCanvas();
    canvas.width = window.innerHeight;
    canvas.height = window.innerHeight;
    var webGLContext = getContext(canvas);
    var vertexShader = createShader(webGLContext, webGLContext.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(webGLContext, webGLContext.FRAGMENT_SHADER, fragmentShaderSource);
    var program = createProgram(webGLContext, vertexShader, fragmentShader);
    // look up where the vertex data needs to go.
    var positionAttributeLocation = webGLContext.getAttribLocation(program, "a_position");
    var resolutionUniformLocation = webGLContext.getUniformLocation(program, "u_resolution");
    // color
    var colorUniformLocation = webGLContext.getUniformLocation(program, "u_color");
    var timeUniformLocation = webGLContext.getUniformLocation(program, "u_time");
    // Create a buffer and put three 2d clip space points in it
    var positionBuffer = webGLContext.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    webGLContext.bindBuffer(webGLContext.ARRAY_BUFFER, positionBuffer);
    // code above this line is initialization code.
    // code below this line is rendering code.
    resizeCanvasToDisplaySize(canvas);
    // Tell WebGL how to convert from clip space to pixels
    webGLContext.viewport(0, 0, canvas.width, canvas.height);
    // Clear the canvas
    webGLContext.clearColor(0, 0, 0, 0);
    webGLContext.clear(webGLContext.COLOR_BUFFER_BIT);
    // Tell it to use our program (pair of shaders)
    webGLContext.useProgram(program);
    // Turn on the attribute
    webGLContext.enableVertexAttribArray(positionAttributeLocation);
    // Bind the position buffer.
    webGLContext.bindBuffer(webGLContext.ARRAY_BUFFER, positionBuffer);
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = webGLContext.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    webGLContext.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
    // set the resolution
    webGLContext.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
    var stripeWidth = (canvas.width) / NB_STRIPES;
    for (var index = 0; index < NB_STRIPES; ++index) {
        // Setup a random rectangle
        // This will write to positionBuffer because
        // its the last thing we bound on the ARRAY_BUFFER
        // bind point
        setRectangle(webGLContext, index * stripeWidth, 0, stripeWidth, canvas.height);
        // Set a random color.
        webGLContext.uniform4f(colorUniformLocation, COLORS[index].r, COLORS[index].g, COLORS[index].b, 1);
        webGLContext.uniform1f(timeUniformLocation, Math.random());
        // Draw the rectangle.
        var primitiveType = webGLContext.TRIANGLES;
        var offset_1 = 0;
        var count = 6;
        webGLContext.drawArrays(primitiveType, offset_1, count);
    }
});
//# sourceMappingURL=app.js.map