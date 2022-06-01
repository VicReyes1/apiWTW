var  express =  require('express');
var router = express.Router();

var controller = require('../controllers/mapController')

router.get('/overview/:initialDate/:finishDate',controller.Over)
router.post('/table/:initialDate/:finishDate',controller.Table)
router.get('/detail/:uid',controller.Detail)

module.exports = router;