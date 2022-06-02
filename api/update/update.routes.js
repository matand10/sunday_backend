const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { addUpdate, getUpdates, deleteUpdate } = require('./update.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getUpdates)
router.post('/', log, /*requireAuth*/ addUpdate)
router.delete('/:id', /*requireAuth*/  deleteUpdate)

module.exports = router