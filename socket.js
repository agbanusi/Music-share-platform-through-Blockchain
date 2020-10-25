const fetch = require('node-fetch');
const os =require('os')
//const inter = os.networkInterfaces()
//const ipv4 = inter['Locaal Area Connection']
//console.log(inter,'/n', ipv4, '/n')
let url ="http://127.0.0.1:8082"
let meters=[]

function sockets(io){
    io.on('connection', socket=>{
        socket.emit('connected',socket.id)

        socket.on('accepted', data=>{
            meters = data.meters
        })

        setInterval(()=>{
            if (url && meters.length>0){
                let datum = meters.map(async(i)=>{
                    let res = await fetch(`${url}/meterTransactions/${i}`)
                    let data = await res.json()
                    return data
                })
                socket.emit('update', datum)
            }
        }, 1*3600*1000)

    })
}

module.exports = sockets