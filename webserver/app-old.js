const http = require ('http')
http.createServer((req,res) => {
    // res.setHeader('Content-Disposition', 'attachment; filename=lista.csv');
    // res.writeHead(200,{'Content-Type' : 'application/csv'});

    res.write('hola mundo');
 
    res.end()
})
.listen( 8686) 
console.log('escuchando en el puerto', 8686)