var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
function randChar() {
    return characters.charAt(Math.floor(Math.random() *characters.length))
}

function getLobbyCode() {
    return `${randChar()}${randChar()}${randChar()}${randChar()}`
}