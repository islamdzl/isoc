const {exec} = require('child_process')

const random = ()=>{
    return Math.floor(Math.random() * 10000000000)
}
exec("echo "+ random() +" > ~/.exec/bin/tokin", (error, stdout, stderr) => {
    if (error) {
        console.log(error)
    }else{
        console.log(stdout)
    }
    
  })
