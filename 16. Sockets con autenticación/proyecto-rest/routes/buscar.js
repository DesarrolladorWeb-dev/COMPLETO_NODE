const {Router} = require('express')
const {buscar} = require('../controllers/buscar')

const router = Router()

router.get('/:coleccion/:termino', buscar)//busquedas son los mayormente en get




module.exports = router;