var canvas = document.getElementById("c");
    ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight
    
var preDim = {x:canvas.width,y:canvas.height}
function checkCanvasSize() {
    if (preDim.x != window.innerWidth || preDim.y != window.innerHeight) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        preDim = {x:window.innerWidth,y:window.innerHeight}
    }
}