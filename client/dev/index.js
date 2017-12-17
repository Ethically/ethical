console.log('Hello from WebSockets!')
const webSocket = new WebSocket('ws://localhost:9393')

webSocket.onopen = function(evt) { console.log('Connection open ...') }
webSocket.onmessage = function(evt) {
    if (evt.data === 'SERVER_STOP') {
        location.reload()
    } else {
        console.log( 'Received Message: ' + evt.data)
    }
}
webSocket.onclose = function(evt) { console.log('Connection closed.') }
