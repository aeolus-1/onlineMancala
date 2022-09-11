function c(e) {return JSON.parse(JSON.stringify(e))}
function sO(t, n) {
    return ((t % n) + n) % n;
  }
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

        var newToken = new gameToken(pos.x,pos.y, dep)

        newToken.dep = dep

        state.gameTokens.push(newToken)
        state.deps[dep].push(newToken)

    },
    moveTokens(state,dep) {
        var tokens = state.deps[dep],
            l = 0
        for (let i = 0; i < tokens.length; i++,l++) {
            const token = tokens[i];
            var targetDep = sO(dep-l-1, 14),
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

        var iterations = 100
        
        for (let k = 0; k < iterations; k++) {
            state.gameTokens = state.gameTokens.sort((a,b)=>{return Math.sign(Math.random()-0.5)})
            for (let i = 0; i < state.gameTokens.length; i++) {
                const token = state.gameTokens[i];
                if (token.target != undefined) {
                    var dst = (Math.sqrt(Math.pow(token.pos.x-token.target.x, 2)+Math.pow(token.pos.y-token.target.y, 2)))
    
                    var box = hitboxes[token.dep],
                        buffer = 25,
                        coll = (token.pos.x-buffer > box.x && token.pos.x+buffer < box.x+box.width && token.pos.y-buffer > box.y && token.pos.y+buffer < box.y+box.height)
    
                    if (!coll) {
                        var angle = Math.atan2(token.pos.x-token.target.x, token.pos.y-token.target.y)+(Math.PI/2)
                        token.pos.x += Math.cos(angle)*(3/iterations)
                        token.pos.y -= Math.sin(angle)*(3/iterations)
                    } /*else {
                        var angle = Math.atan2(token.pos.x-token.target.x, token.pos.y-token.target.y)+(Math.PI/2)
                        token.pos.x += Math.cos(angle)*(3/iterations)*0.1
                        token.pos.y -= Math.sin(angle)*(3/iterations)*0.1
                    }*/
                }
                for (let j = 0; j < state.gameTokens.length; j++) {
                    var token2 = state.gameTokens[j],
                        dst = (Math.sqrt(Math.pow(token.pos.x-token2.pos.x, 2)+Math.pow(token.pos.y-token2.pos.y, 2))),

                        thres = 22
                        
                    if (dst <= thres && token.id != token2.id) {
                        var angle = (Math.random()*0.1)+Math.atan2(token.pos.x-token2.pos.x, token.pos.y-token2.pos.y)-(Math.PI/2),
                            diff = thres-dst
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
        return state
    },

    testForWin(state, player) {
        if (state.deps[0].length+state.deps[7].length>= 48) {
            return Math.sign(state.deps[0].length-state.deps[7].length)*-(-1+(player*2))
        } else {
            return false
        }
    },

    runAI(upsetPercent, upsetRange) {
        /*
        var options = []
        for (let i = 0; i < 14; i++) {
            var l = Math.abs(14-(targetDep+i))%14
            console.log(l)
            if (state.deps[l].length > 0 && l%7!=0) {
                options.push({
                    dep:l,
                    dst:Math.abs(state.deps[l].length-i),
                    len:state.deps[l].length
                })
            }
        }
        options = options.sort((a,b)=>{
            return Math.sign(a.dst-b.dst)
        })
        
        console.log(options)
        return options[0].dep
        */
       function finalScore(board) {
           var rand = (Math.random()<upsetPercent?Math.round((Math.random()-0.5)*upsetRange):0)
           return (board.deps[7].length-board.deps[0].length)+rand
       }
       function getMoves(board, player) {
           var moves = new Array()
           for (let i = 0; i < 14; i++) {
               if (i!=0&&i!=7&&board.deps[i].length>0) {
                moves.push(i)
               }
               
           }
           return moves
       }
       function updateBoard(board, move, player) {
           var board = GameState.makeMove({...board} , move, 0)
           return {
               newBoard:board,
               player:(player+1)%2
           }
       }

       function maxMinMove(board, player, depth, maxForPlayer, level) {
        // When we can't make any more moves, just calculate the "final score" of the board.
       

        // Get our list of possible moves and set a default we'll definitely beat.
        const moves = getMoves(board, player);
        const maximise = maxForPlayer === player;
        const worstScore = maximise ? -Infinity : Infinity;
        let bestMove = [moves[0], worstScore];

        if (depth === -1) {
            return [null, finalScore(board, maxForPlayer)];
          }
          

        for (let move of moves) {

          // Get the next board state with each move.
          const nextState = updateBoard(c(board), move, player);
      
          // Get the next min/max score for the board created by this move.

          const [_, score] = maxMinMove(c(nextState.newBoard), nextState.player, depth - 1, maxForPlayer, level);
      
          // If we're maximising, set the new max; if minimising likewise.
          const setNewMax = maximise && score > bestMove[1];
          const setNewMin = (!maximise) && score <= bestMove[1];
          if (setNewMax || setNewMin) {
            bestMove = [move, score];
          }

        }
      
        return bestMove;
      }
      console.time()
      var s = maxMinMove(JSON.parse(JSON.stringify(currentState)), 1, 2, 1, 0)
      console.timeEnd()
      console.log(s)
      return s[0]
    },
}
class gameToken {
    constructor(x, y, dep) {
        this.pos = {x:x,y:y}
        this.target = {...this.pos}

        this.dep = dep                                            

        this.id = `${Math.random()}`
    }
}


function submitMove(dep) {
    if (playerTurn == currentState.turn) {
        
    }
}


var currentState = new gameState(),
    win = false





function update(state) {
    for (let i = 0; i < hitboxes.length; i++) {
        const box = hitboxes[i];

        if (mouse.pos.x > box.x && mouse.pos.x < box.x+box.width && mouse.pos.y > box.y && mouse.pos.y < box.y+box.height) {

            renders.push({
                text:`${currentState.deps[box.pos].length}`,
                x:(box.width*0.5)+box.x,
                y:box.y-10,
            })

            if (isClick() && !(!!lobbyId && !otherPlayer) && i!=0&&i!=7 && currentState.deps[box.pos].length>0) {
                if (window.socket != undefined) {
                    if (currentState.turn == playerTurn) {

                        socket.emit("submitMove", {
                            lobby:lobbyId,
                            clientId:clientId,
                            pos:box.pos,
                        })
                    }
                } else {
                    if (currentState.turn == playerTurn) {
                        GameState.makeMove(currentState, box.pos, currentState.turn)
                        setTimeout(() => {
                            var skill = 1-parseFloat(document.getElementById("botSelection").children[1].value)
                            GameState.makeMove(currentState, GameState.runAI(skill, 10*(skill)), 1)
                        }, 1);
                    }
                    //playerTurn = (currentState.turn+1)%2
                }
            }
            
        }

    }

    GameState.updateTokens(state)

    if (win == false) {
        var winner = GameState.testForWin(currentState, 0)
        if (winner !== false) {
            win = true
            window.onbeforeunload = undefined
            setTimeout(() => {
                window.open(`./gameOver.html#${winner}_${currentState.deps[0].length}-${currentState.deps[7].length}`,  "_self")
            }, 1000);
        }
    }


    setPreControls()
}

setInterval(()=>{
    update(currentState)
}, 1000/120)