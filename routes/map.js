var  express =  require('express');
var router = express.Router();

var controller = require('../controllers/mapController')

router.get('/overview',controller.Over)
router.get('/table',controller.Table)
router.get('/detail',controller.Detail)

module.exports = router;