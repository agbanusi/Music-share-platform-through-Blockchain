require('dotenv').config();
const express= require('express')
const app =express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const routes = require('./routes')
const sockets = require('./socket')
const cookieParser = require('cookie-parser')
const Web3 = require('web3');
const contract = require('truffle-contract');
const artifacts = require('./build/MOPower.json');

app.use(express.json())
app.use(cookieParser())

if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider)
  } else {
    var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
}

const LMS = contract(artifacts)
LMS.setProvider(web3.currentProvider)

async function adder(){
    try{
        const accounts = await web3.eth.getAccounts(); //["0x3bCB9a276aE28407DEE578b597DD6Bf94D53d9A3"] //metamask account 0x3bCB9a276aE28407DEE578b597DD6Bf94D53d9A3
        //console.log(accounts)
        const lms = await LMS.deployed();
        //var lms = LMS.at(accounts[0])
        //console.log(lms)
        routes(app, lms, accounts)
        sockets(io)
        http.listen(process.env.PORT || 8082, () => {
            console.log('listening on port 8082');
        })
    }catch(e){
        console.log(e)
    }
    
}

adder()
