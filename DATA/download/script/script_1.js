const button = document.getElementById('download')
button.addEventListener('click',()=>{
    const xhr = new XMLHttpRequest()
    xhr.open('GET','https://isoc.onrender.com/download')
    xhr.send()
})