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
    mouse.pos.x = (e.offsetX-(window.innerWidth/2))*renderScale.x
    mouse.pos.y = (e.offsetY-(window.innerHeight/2))*renderScale.y
})
document.addEventListener("mousedown",(e)=>{
    mouse.down = true
})
document.addEventListener("mouseup",(e)=>{
    mouse.down = false
})

document.addEventListener("touchstart", (e)=>{
    mouse.down = true
})
document.addEventListener("touchend", (e)=>{
    mouse.down = false
})
document.addEventListener("touchmove", (e)=>{
    mouse.pos.x = (e.touches[0].clientX-(window.innerWidth/2))*renderScale.x
    mouse.pos.y = (e.touches[0].clientX-(window.innerHeight/2))*renderScale.y
})