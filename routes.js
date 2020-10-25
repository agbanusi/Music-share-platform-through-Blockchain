const fetch = require('node-fetch');
let url = 'http://159.89.100.23:8081'

let header =(token)=>{return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": "Bearer "+token,
}};

function routes(app, lms, accounts){
    //registration endpoint  --not available
    app.post('/register',(req,res)=>{
        let body = req.body
        if(body){
            fetch(`${url}/api/auth/register`, {method: "POST",headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)})
            .then(res=>res.json())
            .then(data=>{
                if(data.user){
                    lms.addConsumer(data.user.name, body.password, {from: accounts[0]})
                    .then(res=>{
                        res.cookie('token',data.access_token,{maxAge: 3600, httpOnly: false})
                        res.json({status: 'success', 'name':data.user.name, 'email':data.user.email, 'id':data.user.id, 'token':data.access_token})
                    })
                    .catch(e=>{
                        console.log(e)
                        res.json({status:'Failed'})
                    })
                }else{
                    res.json({status:'Failed'})
                }
            }).catch(e=>{
                res.json({status:'Failed'})
            })
        }else{
            res.json({status:'Failed'})
        }
    })
    //login endpoint
    app.post('/login', (req,res)=>{
        let body = req.body
        if(body && body.email && body.password){
            fetch(`${url}/api/auth/login`, {method: "POST",headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)})
            .then(res=>res.json())
            .then(async(data)=>{
                if(data.access_token){
                    let datum = await personDetails(data.access_token, data.user.id)
                    //let length = datum.meters? data.meters.length : 0
                    lms.addConsumer(data.user.name, req.body.password, {from: accounts[0]})
                    .then(resu=>{
                        console.log(resu)
                        res.cookie('token',data.access_token,{maxAge: 3600, httpOnly: false})
                        res.json({status: 'success', 'name':data.user.name, 'email':data.user.email, 'id':data.user.id, 'token':data.access_token})
                    })
                    .catch(e=>{
                        console.log(e)
                        res.json({status:'Failed'})
                    })
                    
                }else{
                    console.log('over')
                    res.json({status:'Failed'})
                }
            }).catch(e=>{
                console.log(e, 'here')
                res.json({status:'Failed'})
            })
        }else{
            res.json({status:'Failed'})
        }
    })
    //agent login or super user
    app.post('agentLogin', async(req,res)=>{
        let body = req.body
        if(body){
            let data = await addProducer(body)
            if(data){
                lms.addProducer(data.agent.name, body.password, {from: accounts[0]})
                .then(resu=>{
                    res.cookie('token',data.access_token,{maxAge: 3600, httpOnly: false})
                    res.json({status: 'success', 'name':data.agent.name, 'email':data.agent.email, 'id':data.agent.id, 'token':data.access_token})
                })
                .catch(e=>{
                    console.log(e)
                    res.json({status:'Failed'})
                })
            }else{
                res.json({status:'Failed'})
            }
        }
    })
    //general personal details of a person
    app.get('/details/:id', async(req, res)=>{
        let serial = req.params.id
        if(serial){
            let token = cookie(req,'token')
            console.log(token)
            let data = await personDetails(token, serial)
            if(data){
                res.json(data)
            }else{
                res.json({status:'Failed'})
            }
        }else{
            res.json({status:'Failed'})
        }
    })
    //add transactions by a person endpoint
    app.post('/addTransaction/:id', async(req,res)=>{
        let agent = req.params.id
        let body = req.body
        if(body){
            let token = cookie(req,'token')
            let data = await addTransaction(token, body, agent)
            if(data){
                lms.addTransaction(body.meter_id, data.token.token, body.user_id, agent, data.token.unit, data.amount, {from: accounts[0]})
                .then(resu=>{
                    res.json({status:'success', 'amount':data.amount, 'token':data.token.token,' id':data.token.id})
                })
                .catch(e=>{
                    console.log(e)
                    res.json({status:'Failed'})
                })
            }else{
                res.json({status:'Failed'})
            }
        }
    })
    //check a single transaction detail
    app.get('/singleTransaction/:id', async(req,res)=>{
        let serial = req.params.id
        if(serial){
            let token = cookie(req,'token')
            let data = await singleTransaction(token, serial)
            if(data){
                lms.getTransaction(serial,data.token.meter_id, {from: accounts[0]})
                .then(resu=>{
                    res.json({data, 'confirm':resu})
                }).catch(e=>{
                    console.log(e)
                    res.json({status:'Failed'})
                })
                
            }else{
                res.json({status:'Failed'})
            }
        }else{
            res.json({status:'Failed'})
        }
    })
    //check transactions done on a particular meter
    app.get('/meterTransactions/:id', async(req, res)=>{
        let serial = req.params.id
        if(serial){
            let token = cookie(req,'token')
            let date = new Date()
            let from = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
            let end = `${date.getFullYear()-1}-${date.getMonth()}-${date.getDate()}`
            let datum = await consumption(token, serial, from, end)
            let data = await meterTransactions(token, serial)
            if(datum && data){
                datum = datum.slice(-1)[0]
                let refData = data.map(i=>{return{'unit':i.paid_for.energy,'amount':i.transaction.amount, 'date':i.created_at}})
                lms.getMeterTransactions(serial)
                .then(resu=>{
                    res.json({'history':refData.slice(0,15),'availableUnit':datum.credit_on_meter, 'daily': datum.daily_consumption, 'confirm':resu})
                }).catch(e=>{
                    console.log(e)
                    res.json({status:'Failed'})
                })
                
            }else{
                res.json({status:'Failed'})
            }
            
        }else{
            res.json({status:'Failed'})
        }
    })
    //check entire transactions done by a person
    app.get('/personTransaction/:serial', async(req,res)=>{
        let serial = req.params.id
        if(serial){
            let token = cookie(req,'token')
            let data = await personTransaction(token, serial)
            if(data){
                let refData = data.map(i=>{return{'amount':i.transaction.amount, 'date':i.transaction.created_at}})
                res.json(refData)
            }else{
                res.json({status:'Failed'})
            }
        }else{
            res.json({status:'Failed'})
        }
    })
    //check energy consumtions in a time period
    app.get('/consumption/:serial?time=timer', async(req,res)=>{
        let time = req.query.timer
        let serial = req.params.serial
        if(time && time){
            let token = cookie(req,'token')
            let date = new Date()
            let from = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
            let end
            if(time == 'year'){
                end = `${date.getFullYear()-1}-${date.getMonth()}-${date.getDate()}`
            }else if(time == 'month'){
                end = `${date.getFullYear()}-${date.getMonth()-1>0?date.getMonth()-1:11}-${date.getDate()}`
            }else if(time == 'day'){
                end = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()-1>0?date.getDate()-1:28}`
            }
            let datum = await consumption(token, serial, from, end)
            let detail = await details(token,serial)
            
            if(datum && detail){
                let deet = detail.meter_parameter.tariff.price
                let gross = (datum.slice(-1)[0]).total_consumption - (datum[0].total_consumption)
                lms.addConsumption(serial, gross, {from: accounts[0]})
                .then(resu=>{
                    res.json({'energy':gross, 'tariff': detail})
                })
                .catch(e=>{
                    console.log(e)
                    res.json({status:'Failed'})
                })
            }else{
                res.json({status:'Failed'})
            }
        }else{
            res.json({status:'Failed'})
        }
    })
    //add a meter endpoint
    app.post('/createMeter', async(req,res)=>{
         let body = req.body
         if(body){
             let token = cookie(req,'token')
             let data = await create(token, body )
             if(data){
                 lms.addMeter(body.serial_number, body.id, 0, {from: accounts[0]})
                 .then(resu=>{
                    res.json({status:'success', data})
                 })
                .catch(e=>{
                    console.log(e)
                    res.json({status:'Failed'})
                })
             }else{
                res.json({status:'Failed'})
             }
         }
    })
    //get all meters allocated to a person
    app.get('/allMeters/:person', async(req,res)=>{
         let person = req.params.person
         if(person){
             let token = cookie(req,'token')
             let data = await personMeters(token, person)
             if(data){
                let t=true
                data.meters.forEach(async(i)=>{
                    let from = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
                    let end = `${date.getFullYear()-1}-${date.getMonth()}-${date.getDate()}`
                    let datum = await consumption(token, i.meter.serial_number, from, end)
                    lms.addMeter(i.meter.serial_number,  person, (datum.slice(-1)[0]).credit_on_meter, {from: accounts[0]})
                    .then(resu=>{
                        console.log('yeah')
                    })
                    .catch(e=>{
                        console.log(e)
                        t = false
                    })
                })
                if(t){
                    res.json({'meters':data.meters})
                }else{
                    res.json({status:'Failed'})
                }
                
             }else{
                res.json({status:'Failed'})
             }
         }else{
            res.json({status:'Failed'})
         }
    })
    //add a person to an account
    app.post('/addPerson', async(req,res)=>{
        let body = req.body
        if(body){
            let token = cookie(req,'token')
            let data = await createPerson(token, body)
            if(data){
                res.json({status:'success', 'data':data})
            }else{
                res.json({status:'Failed'})
             }
        }else{
            res.json({status:'Failed'})
         }
    })
    //update a person's information
    app.put('/updatePerson/:id', async(req,res)=>{
         let body = req.body
         let person = req.params.id
         if(body && person){
            let token = cookie(req,'token')
            let data = await updatePerson(token, body, person)
            if(data){
                res.json({status:'success'})
            }else{
                res.json({status:'Failed'})
            }
         }else{
            res.json({status:'Failed'})
         }
    })
    //add address of a person
    app.post('/addAddress/:person', async(req,res)=>{
        let body = req.body
        let person = req.params.person
        if(body && person){
            let token = cookie(req,'token')
            let data = await createAddress(token, body, person)
            if(data){
                res.json({status:'success', 'data':data})
            }else{
                res.json({status:'Failed'})
            }
        }else{
            res.json({status:'Failed'})
         }
    })
    //update an address
    app.put('/updateAddress/:person', async(req,res)=>{
        let body = req.body
        let person = req.params.person
        if(body && person){
            let token = cookie(req,'token')
            let data = await updateAddress(token, body, person)
            if(data){
                res.json({status:'success'})
            }else{
                res.json({status:'Failed'})
            }
        }else{
            res.json({status:'Failed'})
         }
    })
    //get all addresses adde by a person
    app.get('addresses/:person', async(req, res)=>{
        let person = req.params.person
        if(person){
            let token = cookie(req,'token')
            let data = await  personAddresses(token, body, person)
            if(data){
                res.json({'addresses': data})
            }else{
                res.json({status:'Failed'})
            }
        }
    })
}
function cookie(req,id){
    try{
        let rawCookie = req.cookies.split(';')
        rawCookie = rawCookie.map(i=>i.trim())
        let refCookie = rawCookie.map(i=>{
            let lis = i.split('=')
            return {id:lis[0], value:lis[1]}
        })
        let des = refCookie.filter(i=>i.id==id)
        return des
    }catch(e){
        return req.header('authorization').split(' ')[1]
    }
}
async function create(token, body){
    let headers = header(token)
    let ris = await fetch(`${url}/api/meter`, {method: "POST",headers, body: JSON.stringify(body)})
    let data = await ris.json()
    return data
}
async function details(token, serial){
    let headers = header(token)
    let ris = await fetch(`${url}/api/meter/${serial}`, {method: "GET",headers})
    let data = await ris.json()
    return data.data.meter_parameter
}
async function addTransaction(token, body, agent){
    let headers = header(token)
    let ris = await fetch(`${url}/api/transactions/${agent}`, {method: "POST",headers, body: JSON.stringify(body)})
    let data = await ris.json()
    return data.data
}
async function addProducer(body){
    let headers = header(token)
    let ris = await fetch(`${url}/api/app/login`, {method: "POST",headers, body: JSON.stringify(body)})
    let data = await ris.json()
    return data.data
}
async function meterTransactions(token, serial){
    let headers = header(token)
    let ris = await fetch(`${url}/api/meters/${serial}/transactions`, {method: "GET",headers})
    let data = await ris.json()
    return data.data
}
async function consumption(token, serial, start, end){
    let headers = header(token)
    let ris = await fetch(`${url}/api/meters/${serial}/consumptions/${start}/${end}`, {method: "GET",headers})
    let data = await ris.json()
    return data.data
}
async function singleTransaction(token,transaction_id){
    let headers = header(token)
    let ris = await fetch(`${url}api/transactions/${transaction_id}`, {method: "GET",headers})
    let data = await ris.json()
    return data.data
}
async function createAddress(token, body, personId){
    let headers = header(token)
    let ris = await fetch(`${url}/api/people/${personId}/addresses`, {method: "POST",headers, body: JSON.stringify(body)})
    let data = await ris.json()
    return data
}
async function updateAddress(token, body, personId){
    let headers = header(token)
    let ris = await fetch(`${url}/api/people/${personId}/addresses`, {method: "PUT",headers, body: JSON.stringify(body)})
    let data = await ris.json()
    return data
}
async function personDetails(token, personId){
    let headers = header(token)
    let ris = await fetch(`${url}/api/people/${personId}`, {method: "GET",headers})
    let data = await ris.json()
    return data
}
async function personTransaction(token, personId){
    let headers = header(token)
    let ris = await fetch(`${url}/api/people/${personId}/transactions`, {method: "GET",headers})
    let data = await ris.json()
    return data.data
}
async function personAddresses(token, person){
    let headers = header(token)
    let ris = await fetch(`${url}/api/people/${person}/addresses`, {method: "GET",headers})
    let data = await ris.json()
    return data.data
}
async function personMeters(token, person){
    let headers = header(token)
    let ris = await fetch(`${url}/api/people/${person}/meters`, {method: "GET",headers})
    let data = await ris.json()
    return data.data
}
async function createPerson(token, body){
    let headers = header(token)
    let ris = await fetch(`${url}/api/people`, {method: "POST",headers, body: JSON.stringify(body)})
    let data = await ris.json()
    return data
}
async function updatePerson(token, body, personId){
    let headers = header(token)
    let ris = await fetch(`${url}/api/people/${personId}`, {method: "PUT",headers, body: JSON.stringify(body)})
    let data = await ris.json()
    return data
}
module.exports = routes