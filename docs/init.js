window.onload = async ()=>{
    window.clientId = self.crypto.randomUUID()
    window.lobbyId = location.href.split("#")[1]

    window.playerTurn = 0

    window.otherPlayer = undefined


    if (lobbyId != undefined) {

        
        window.socket = io("https://socketioserver-aeolus.herokuapp.com/")
        if (navigator.onLine) {
            console.log("connected")

            

            socket.emit("requestLobby", {
                id:lobbyId,
                clientId:clientId,
            })


        } else {
            console.log("disconnected")
        }


        socket.on("returnLobby", (e)=>{
            console.log(e)
            window.otherPlayer = e.state.p2
            if (e.state.id == lobbyId) {
                var preLobby = {...currentState}
                
                window.isTurn = e.turn
                window.player = e.player
                currentState = e.state.state

                for (let i = 0; i < currentState.gameTokens.length; i++) {
                    const token = currentState.gameTokens[i];
                    for (let j = 0; j < preLobby.gameTokens.length; j++) {
                        const token2 = preLobby.gameTokens[j];
                        if (token2.id == token.id) {
                            token.pos = token2.pos
                        }
                    }
                }

            }
            
        })

        socket.on("allLobbys", (e)=>{
            console.log(e)
        })

        socket.on("responseCode", (e)=>{
            switch (e.code) {
                case "lobbyFull":
                    alert("Lobby Full")
                    break;
            
                default:
                    break;
            }
        })

        setInterval(refreshGame, 1500)


    } else {


        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 4; j++) {
                GameState.addToken(currentState, i+1)

            }
        }
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 4; j++) {
                GameState.addToken(currentState, i+8)

            }
        }


    }


}

function l() {
    socket.emit("requestAllLobbys")
}

window.onbeforeunload = (evt) => {
    if (lobbyId) {
        socket.emit("leaveLobby", {
            lobby:lobbyId,
            clientId:clientId,
        })
    }
    return true;
  }


function refreshGame() {
    socket.emit("requestLobby", {
        id:lobbyId,
        clientId:clientId,
    })
}



