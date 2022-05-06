var  express =  require('express');
var router = express.Router();

var controller = require('../controllers/userController')

router.get('/overview',controller.List)
router.get('/contributions',controller.Table)
router.get('/details',controller.Details)

module.exports = router;
