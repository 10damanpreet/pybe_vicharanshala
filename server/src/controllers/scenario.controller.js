const scenarioRepository = require('../repositories/scenario.repository');
const { AppError } = require('../middleware/errorHandler');

/**
 * GET /api/scenarios
 * Supports query params: q, difficulty, concept, page, limit
 */
async function getAll(req, res, next) {
  try {
    const { q, difficulty, concept, page, limit } = req.query;
    const result = await scenarioRepository.findAll({ q, difficulty, concept, page, limit });
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/scenarios/:id
 */
async function getById(req, res, next) {
  try {
    const scenario = await scenarioRepository.findById(req.params.id);
    if (!scenario) {
      throw new AppError('Scenario not found.', 404);
    }
    return res.status(200).json({ success: true, data: scenario });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/scenarios
 * Body is pre-validated by Zod middleware.
 */
async function create(req, res, next) {
  try {
    const scenario = await scenarioRepository.create(req.body);
    return res.status(201).json({ success: true, data: scenario });
  } catch (err) {
    return next(err);
  }
}

/**
 * PUT /api/scenarios/:id
 * Body is pre-validated by Zod scenarioUpdateSchema (partial).
 */
async function update(req, res, next) {
  try {
    const existing = await scenarioRepository.findById(req.params.id);
    if (!existing) {
      throw new AppError('Scenario not found.', 404);
    }
    const updated = await scenarioRepository.update(req.params.id, req.body);
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    return next(err);
  }
}

/**
 * DELETE /api/scenarios/:id
 */
async function remove(req, res, next) {
  try {
    const existing = await scenarioRepository.findById(req.params.id);
    if (!existing) {
      throw new AppError('Scenario not found.', 404);
    }
    await scenarioRepository.remove(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };
