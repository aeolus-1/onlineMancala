var images = new (function(){
    this.background = document.createElement("img");this.background.src = "./backgroundImage.jpeg"

    this.token = document.createElement("img");this.token.src = "./token.png"


})()

var renders = new Array()



function draw(state) {
    checkCanvasSize()

    ctx.save()

    ctx.clearRect(0,0,canvas.width, canvas.height)

    ctx.translate(window.innerWidth/2,window.innerHeight/2)
    ctx.save()
    ctx.scale(-1, -1)
    if (!!(window.player-1)) {ctx.scale(-1, -1)}

    ctx.drawImage(images.background, images.background.width*-0.5, images.background.height*-0.5)

    ctx.restore()

    for (let i = 0; i < state.gameTokens.length; i++) {
        const token = state.gameTokens[i];
        var size = 20



        var grd = ctx.createRadialGradient(token.pos.x, token.pos.y, 0, token.pos.x, token.pos.y, size);
        grd.addColorStop(0, "#000f");
        grd.addColorStop(0.7, "#0000");

        // Fill with gradient
        ctx.fillStyle = grd;
        ctx.fillRect(token.pos.x-100, token.pos.y-100, 200, 200);


        ctx.drawImage(images.token, token.pos.x-(size/2), token.pos.y-(size/2), size, size)






    }

    ctx.font = `${25}px Shadows Into Light`
    ctx.fillStyle = "#000"



    for (let i = 0; i < renders.length; i++) {
        var render = renders[i];

        render = {
            text:"help",
            x:0,
            y:0,
            color:"#000",
            size:25,

            ...render,
        }

        ctx.font = `bold ${render.size}px Shadows Into Light`
        ctx.fillStyle = render.color
        ctx.strokeStyle = "#fff"


        var string = render.text,
        width = ctx.measureText(string).width
        ctx.strokeText(string, (-width/2)+render.x, render.y)
        ctx.font = `${render.size}px Shadows Into Light`
        ctx.fillText(string, (-width/2)+render.x, render.y)

    }
    renders = new Array()
    if (lobbyId) {

    var string = (otherPlayer)?((window.isTurn)?"Make your move":"Other player's move"):"Waiting for Player 2",
        width = ctx.measureText(string).width
    ctx.fillText(string, -width/2, -330)

        var string = `Lobby Code: ${lobbyId}`,
            width = ctx.measureText(string).width
        ctx.fillText(string, -width/2, 330)
    }
    

    ctx.restore()
}



