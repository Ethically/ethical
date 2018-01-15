const webSocket = new WebSocket('ws://localhost:9393')

webSocket.onopen = (evt) => {
    console.log('Ethical Dev Socket Open!')
}
webSocket.onmessage = (evt) => {
    if (evt.data === 'SERVER_STOP') {
        location.reload()
    } else {
        console.log( 'Ethical Dev Socket Received Message: ' + evt.data)
    }
}
webSocket.onclose = (evt) => {
    console.log('Ethical Dev Socket Closed.')
}
