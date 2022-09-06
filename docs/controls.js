var mouse = {
    pos:{x:0,y:0},
    down:false
},
    preMouse = {...mouse}

function setPreControls(){
    preMouse = {...mouse}
}

function isClick() {
    return mouse.down && !preMouse.down
}

document.addEventListener("mousemove",(e)=>{
    mouse.pos.x = e.offsetX-(window.innerWidth/2)
    mouse.pos.y = e.offsetY-(window.innerHeight/2)
})
document.addEventListener("mousedown",(e)=>{
    mouse.down = true
})
document.addEventListener("mouseup",(e)=>{
    mouse.down = false
})