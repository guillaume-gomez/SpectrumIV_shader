
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

function draw() {
  
}

window.addEventListener("load", function(event) {
  draw();
});