const { Router } = require('express');
const scenarioController = require('../controllers/scenario.controller');
const { scenarioSchema, scenarioUpdateSchema, validateBody } = require('../middleware/validate');

const router = Router();

router.get('/', scenarioController.getAll);
router.get('/:id', scenarioController.getById);
router.post('/', validateBody(scenarioSchema), scenarioController.create);
router.put('/:id', validateBody(scenarioUpdateSchema), scenarioController.update);
router.delete('/:id', scenarioController.remove);

module.exports = router;
