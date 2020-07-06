const WebSocket = require('ws')

let url = 'https://stats.tomochain.com/primus'
let ws = new WebSocket(url)
let blockNumber = 0
let chunk = {
    count: 0,
    timestamp: 0
}

ws.on('close', () => { 
    console.log('WS closed!')
})

ws.on('open', function connection() {
    console.log('WS connected!')
    ws.ping()
})
ws.on('message', connection)
function connection(data) {
    let d = JSON.parse(data)
    if (d.action === 'block') {
        ws.ping()
        if (parseInt(d.data.block.number) > blockNumber) {
            chunk.count = chunk.count + d.data.block.transactions.length
            console.log(d.data.block.number, d.data.block.hash, chunk.count, d.data.block.timestamp, d.data.block.timestamp - chunk.timestamp)
            if ((d.data.block.timestamp - chunk.timestamp) > 60) {
                console.log('Tps =', chunk.count / 60)
                chunk.count = 0
                chunk.timestamp = d.data.block.timestamp
            }
            blockNumber = parseInt(d.data.block.number)
        }
    }
}

