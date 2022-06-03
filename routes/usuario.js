var  express =  require('express');
var router = express.Router();

var controller = require('../controllers/userController')

router.get('/overview?:maps?:nombre?:apellido?:order?:page?',controller.List)
router.post('/contributions/:id',controller.Table)
router.get('/details/:id', controller.Details)
router.get('/countries', controller.Countries)

module.exports = router;
