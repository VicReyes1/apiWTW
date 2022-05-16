var  express =  require('express');
var router = express.Router();

var controller = require('../controllers/mapController')

router.get('/overview',controller.Over)

module.exports = router;