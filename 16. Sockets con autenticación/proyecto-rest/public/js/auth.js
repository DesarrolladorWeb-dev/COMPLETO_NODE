
const miFormulario = document.querySelector('form')

miFormulario.addEventListener('submit', ev => {
    ev.preventDefault()
    const formData = {}
    for ( let el of miFormulario.elements){
        if (el.name.length > 0) {
            formData[el.name] = el.value
        }
    }
    console.log(formData)

    var url = 'http://localhost:5000/api/auth/'

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers:{'Content-Type' : 'application/json'}
    })
    .then(resp => resp.json())
    .then(({token , msg}) => {
        if(msg){
            return console.log(msg)
        }
        localStorage.setItem('token', token)
        window.location = 'chat.html';

    })
    .catch(err => {
        console.log(err)
    })



})