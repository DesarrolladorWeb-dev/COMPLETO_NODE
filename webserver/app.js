const express = require('express')
const hbs = require('hbs')

const app = express()
const port = 8686

// Handlebar
app.set('view engine', 'hbs')
hbs.registerPartials(__dirname + '/views/partials');//pra usarlo en el home


//  este es el path del slash '/'
app.use(express.static('public')) //se ejecutara sobre las rutas que definen ,

// app.get('/', function (req, res) { //se ejecuta el de arriba
//   res.send('Home page')
// })

app.get('/', function (req, res) {
  res.render('home', {
    nombre : 'Fernando Herrera',
    titulo: 'Curso de Node'
  })
})

// se mostrar el hola mundo desde public porque la ruta se llama como la carpeta
app.get('/generic', function (req, res) {
  res.render('generic', {
    nombre : 'Fernando Herrera',
    titulo: 'Curso de Node'
  })
  })
app.get('/elements', function (req, res) {
  res.render('elements', {
    nombre : 'Fernando Herrera',
    titulo: 'Curso de Node'
  })
  })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.get('*', (req, res) => {
    res.sendFile(__dirname +'/public/404.html')
  })

// app.listen(8686)