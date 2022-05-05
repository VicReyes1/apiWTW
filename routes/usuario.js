var  express =  require('express');
var router = express.Router();

var controller = require('../controllers/userController')

router.get('/overview',controller.List)

module.exports = router;