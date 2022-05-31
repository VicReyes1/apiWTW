var  express =  require('express');
var router = express.Router();

var controller = require('../controllers/userController')

router.get('/overview?:maps?:order?',controller.List)
router.get('/contributions/:id',controller.Table)
router.get('/details/:id', controller.Details)
router.get('/countries', controller.Countries)

module.exports = router;
