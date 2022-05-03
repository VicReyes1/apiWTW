var  express =  require('express');
var router = express.Router();

var controller = require('../controllers/userController')

router.get('/List',controller.List)

module.exports = router;