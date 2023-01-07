const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const authService = require('../auth/auth.service')
const updateService = require('./update.service')

async function getUpdates(req, res) {
    try {
        const updates = await updateService.query(req.query)
        res.send(updates)
    } catch (err) {
        logger.error('Cannot get updates', err)
        res.status(500).send({ err: 'Failed to get updates' })
    }
}

async function deleteUpdate(req, res) {
    try {
        const deletedCount = await updateService.remove(req.params.id)
        if (deletedCount === 1) {
            res.send({ msg: 'Deleted successfully' })
        } else {
            res.status(400).send({ err: 'Cannot remove update' })
        }
    } catch (err) {
        logger.error('Failed to delete update', err)
        res.status(500).send({ err: 'Failed to delete update' })
    }
}


async function addUpdate(req, res) {

    var loggedinUser = authService.validateToken(req.cookies.loginToken)
    try {
        var update = req.body

        update.byUser = { ...update.byUser }
        update = await updateService.add(update)


        
        update.byUserId = loggedinUser._id

        // User info is saved also in the login-token, update it
        const loginToken = authService.getLoginToken(loggedinUser)
        res.cookie('loginToken', loginToken)

        res.send(update)

    } catch (err) {
        console.log(err)
        logger.error('Failed to add update', err)
        res.status(500).send({ err: 'Failed to add update' })
    }
}

module.exports = {
    getUpdates,
    deleteUpdate,
    addUpdate
}