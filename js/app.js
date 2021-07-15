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
function getCanvas() {
    var canvas = document.getElementById("canvas");
    if (!canvas) {
        throw "cannot find the canvas in the page";
    }
    return canvas;
}
function getContext(canvas) {
    var context = canvas.getContext("2d");
    if (!context) {
        throw "cannot find the context in the page";
    }
    return context;
}
function drawFrame(context, thicknessFrame) {
    var width = context.canvas.width;
    var thicknessOuterFrame = thicknessFrame / 4;
    context.save();
    context.fillRect(0, 0, width, width);
    context.clearRect(thicknessOuterFrame, thicknessOuterFrame, width - (thicknessOuterFrame * 2), width - (thicknessOuterFrame * 2));
    context.fillRect(thicknessOuterFrame * 2, thicknessOuterFrame * 2, width - (thicknessOuterFrame * 4), width - (thicknessOuterFrame * 4));
    context.restore();
}
function drawColorStripe(context, xOrigin, yOrigin, width, height, color) {
    context.save();
    context.fillStyle = color;
    context.fillRect(xOrigin, yOrigin, width, height);
    context.restore();
}
function draw() {
    var canvas = getCanvas();
    var context = getContext(canvas);
    context.canvas.width = window.innerHeight;
    context.canvas.height = window.innerHeight;
    var frameThickness = 150;
    drawFrame(context, frameThickness);
    var _a = context.canvas, width = _a.width, height = _a.height;
    var stripeWidth = (width - frameThickness) / NB_STRIPES;
    var rest = (width - (2.0 * frameThickness)) % NB_STRIPES;
    console.log(stripeWidth);
    console.log(height);
    console.log(window.innerHeight);
    for (var index = 0; index < NB_STRIPES; ++index) {
        drawColorStripe(context, frameThickness / 2 + stripeWidth * index, frameThickness / 2, stripeWidth, height - frameThickness, COLORS[index]);
    }
}
function reportWindowSize() {
    draw();
}
window.onresize = reportWindowSize;
window.addEventListener("load", function (event) {
    draw();
});
//# sourceMappingURL=app.js.map