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


function getCanvas() : HTMLCanvasElement {
  let canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if(!canvas) {
    throw "cannot find the canvas in the page";
  }
  return canvas;
}

function getContext(canvas: HTMLCanvasElement) : CanvasRenderingContext2D {
  let context = canvas.getContext("2d");
  if(!context) {
    throw "cannot find the context in the page";
  }
  return context;
}

function drawFrame(context: CanvasRenderingContext2D, thicknessFrame: number)  {
  const { canvas: { width } } =  context;
  const thicknessOuterFrame = thicknessFrame / 4;
  context.save();

  context.fillRect(0, 0, width, width);
  context.clearRect(thicknessOuterFrame, thicknessOuterFrame, width - (thicknessOuterFrame * 2), width - (thicknessOuterFrame * 2));
  context.strokeRect(thicknessOuterFrame * 2, thicknessOuterFrame * 2, width - (thicknessOuterFrame * 4), width - (thicknessOuterFrame * 4));
  
  context.restore();

}

function drawColorStripe(context: CanvasRenderingContext2D, xOrigin : number, yOrigin: number, width: number, height: number, color: string) {
  context.save();
  context.fillStyle = color;
  context.fillRect(xOrigin, yOrigin, width, height);
  context.restore();
}


function draw() {
  let canvas = getCanvas();
  let context = getContext(canvas);
  context.canvas.width  = window.innerHeight;
  context.canvas.height = window.innerHeight;

  //const frameThickness = 100;
  //drawFrame(context, frameThickness);

  const { canvas: { width, height } } =  context;
  const stripeWidth = (width) / NB_STRIPES;
  console.log(stripeWidth)
  for(let index = 0; index < NB_STRIPES; ++index) {
    drawColorStripe(context, stripeWidth * index, 0, stripeWidth, height, COLORS[index]);
  }

}


function reportWindowSize() {
  draw();
}


window.onresize = reportWindowSize;

window.addEventListener("load", function(event) {
  draw();
});