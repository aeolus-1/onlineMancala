
let depDim = {
    width:110,
    height:133,
    xGap:8.5
}
var hitboxes = [
    {x:-470.5,y:-255,width:110,height:510,pos:0},
]

hitboxes.push(    {x:360.5,y:-255,width:110,height:510,pos:7},
    )
for (let i = 0; i < 6; i++) {
    hitboxes.push({
        x:-352+(i*(depDim.width+depDim.xGap)),
        y:-255,
        width:110,
        height:133,
        pos:i+1,
    
    })
    
    hitboxes.push({
            x:-352+(i*(depDim.width+depDim.xGap)),
            y:122,
            width:110,
            height:133,
            pos:13-i,
        })
}


hitboxes = hitboxes.sort((a,b)=>{return Math.sign(a.pos-b.pos)})



class gameState {
    constructor(){
        this.deps =[[],[],[],[],[],[],[],[],[],[],[],[],[],[],]
        this.turn = 0

        this.gameTokens = new Array()
    }
}
var GameState = {
    
    addToken(state, dep) {

        var hitbox = hitboxes[dep],
            pos = {x:hitbox.x+(hitbox.width/2),y:hitbox.y+(hitbox.height/2)}

        var newToken = new gameToken(pos.x,pos.y)

        newToken.dep = dep
        console.log(newToken.dep)

        state.gameTokens.push(newToken)
        state.deps[dep].push(newToken)

    },
    moveTokens(state,dep) {
        var tokens = state.deps[dep],
            l = 0
        for (let i = 0; i < tokens.length; i++,l++) {
            const token = tokens[i];
            console.log(token)
            var targetDep = (dep+l+1)%14,
                hitbox = hitboxes[targetDep]


            token.target = {x:hitbox.x+(hitbox.width/2),y:hitbox.y+(hitbox.height/2)}
            token.dep = targetDep
            for (let j = 0; j < tokens.length; j++) {
                if (tokens[j].id == token.id) {
                    tokens.splice(j, 1)
                    i--
                    
                    break
                }
            }
            state.deps[targetDep].push(token)
        }
    },
    updateTokens(state) {

        var iterations = 10
        
        for (let k = 0; k < iterations; k++) {
            state.gameTokens = state.gameTokens.sort((a,b)=>{return Math.sign(Math.random()-0.5)})
            for (let i = 0; i < state.gameTokens.length; i++) {
                const token = state.gameTokens[i];
                if (token.target != undefined) {
                    var dst = (Math.sqrt(Math.pow(token.pos.x-token.target.x, 2)+Math.pow(token.pos.y-token.target.y, 2)))
    
                    var box = hitboxes[token.dep],
                        buffer = 30,
                        coll = (token.pos.x-buffer > box.x && token.pos.x+buffer < box.x+box.width && token.pos.y-buffer > box.y && token.pos.y+buffer < box.y+box.height)
    
                    if (!coll) {
                        var angle = Math.atan2(token.pos.x-token.target.x, token.pos.y-token.target.y)+(Math.PI/2)
                        token.pos.x += Math.cos(angle)*(3/iterations)
                        token.pos.y -= Math.sin(angle)*(3/iterations)
                    } 
                }
                for (let j = 0; j < state.gameTokens.length; j++) {
                    var token2 = state.gameTokens[j],
                        dst = (Math.sqrt(Math.pow(token.pos.x-token2.pos.x, 2)+Math.pow(token.pos.y-token2.pos.y, 2)))
                        
                    if (dst <= 20 && token.id != token2.id) {
                        var angle = (Math.random()*0.1)+Math.atan2(token.pos.x-token2.pos.x, token.pos.y-token2.pos.y)-(Math.PI/2),
                            diff = 20-dst
                        token.pos.x += Math.cos(angle)*diff*0.25
                        token.pos.y -= Math.sin(angle)*diff*0.25
                        token2.pos.x -= Math.cos(angle)*diff*0.25
                        token2.pos.y += Math.sin(angle)*diff*0.25
                    }
                }
    
            }
        }
        
    },
    
    makeMove(state, dep, turn) {
        GameState.moveTokens(state, dep)
        state.turn = (turn+1)%2
    },
}
class gameToken {
    constructor(x, y) {
        this.pos = {x:x,y:y}
        this.target = {...this.pos}

        

        this.id = `${Math.random()}`
    }
}


function submitMove(dep) {
    if (playerTurn == currentState.turn) {
        
    }
}


var currentState = new gameState()





function update(state) {
    for (let i = 0; i < hitboxes.length; i++) {
        const box = hitboxes[i];

        if (mouse.pos.x > box.x && mouse.pos.x < box.x+box.width && mouse.pos.y > box.y && mouse.pos.y < box.y+box.height) {

            renders.push({
                text:`${currentState.deps[box.pos].length}`,
                x:mouse.pos.x+10,
                y:mouse.pos.y-10,
            })

            if (isClick()) {
                if (window.socket != undefined) {
                    if (currentState.turn == playerTurn) {

                        socket.emit("submitMove", {
                            lobby:lobbyId,
                            clientId:clientId,
                            pos:box.pos,
                        })
                    }
                } else {
                    GameState.makeMove(currentState, box.pos, currentState.turn)
                    playerTurn = currentState.turn
                }
            }
            
        }

    }

    GameState.updateTokens(state)


    setPreControls()
}

setInterval(()=>{
    update(currentState)
}, 1000/120)