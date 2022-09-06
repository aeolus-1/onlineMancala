var images = new (function(){
    this.background = document.createElement("img");this.background.src = "./backgroundImage.jpeg"

})()




function draw(state) {
    checkCanvasSize()

    ctx.save()

    ctx.clearRect(0,0,canvas.width, canvas.height)

    ctx.translate(window.innerWidth/2,window.innerHeight/2)

    ctx.drawImage(images.background, images.background.width*-0.5, images.background.height*-0.5)


    for (let i = 0; i < state.gameTokens.length; i++) {
        const token = state.gameTokens[i];
        ctx.beginPath()

        ctx.arc(token.pos.x,token.pos.y, 10, 0, Math.PI*2)

        ctx.closePath()
        ctx.fill()
    }

    var string = ((window.isTurn)?"Make your move":"Wait for the other player"),
        width = ctx.measureText(string).width
    ctx.fillText(string, -width/2, -330)
    

    ctx.restore()
}


setInterval(()=>{
    draw(currentState)
}, 1000/30)