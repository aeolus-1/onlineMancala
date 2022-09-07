window.onload = async ()=>{
    window.clientId = self.crypto.randomUUID()
    window.lobbyId = location.href.split("#")[1]

    window.playerTurn = 0


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



function refreshGame() {
    socket.emit("requestLobby", {
        id:lobbyId,
        clientId:clientId,
    })
}

setInterval(refreshGame, 1500)

