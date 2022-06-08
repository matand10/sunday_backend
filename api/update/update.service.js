const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('update')
        // const reviews = collection.find().toArray()
        const updates = await collection.find(criteria).toArray()
        // var updates = await collection.aggregate([
        //     {
        //         $match: criteria
        //     },
        //     {
        //         $lookup:
        //         {
        //             localField: 'byUser._id',
        //             from: 'user',
        //             foreignField: '_id',
        //             as: 'byUser'
        //         }
        //     },
        //     {
        //         $unwind: '$byUser'
        //     },
        //     {
        //         $lookup:
        //         {
        //             localField: 'aboutTaskId',
        //             from: 'task',
        //             foreignField: '_id',
        //             as: 'aboutTask'
        //         }
        //     },
        //     {
        //         $unwind: '$aboutTask'
        //     }
        // ]).toArray()
        // updates = updates.map(update => {
        //     update.byUser = { _id: update.byUser._id, fullname: update.byUser.fullname }
        //     update.aboutToy = { _id: update.aboutToy._id, name: update.aboutTask.name }
        //     delete update.byUserId
        //     delete update.aboutUserId
        //     return update
        // })

        return updates
    } catch (err) {
        logger.error('cannot find updates', err)
        throw err
    }

}

async function remove(updateId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { loggedinUser } = store
        const collection = await dbService.getCollection('update')
        // remove only if user is owner/admin
        const criteria = { _id: ObjectId(updateId) }
        // if (!loggedinUser.isAdmin) criteria.byUserId = ObjectId(loggedinUser._id)
        const { deletedCount } = await collection.deleteOne(criteria)
        return deletedCount
    } catch (err) {
        logger.error(`cannot remove update ${updateId}`, err)
        throw err
    }
}


async function add(update) {
    try {
        const updateToAdd = {
            byUser: { _id: ObjectId(update.byUser._id), fullname: update.byUser.fullname, username: update.byUser.username, userImg: update.byUser.userImg },
            aboutTaskId: ObjectId(update.taskId),
            txt: update.txt,
            updateDate: update.updateDate,
        }
        const collection = await dbService.getCollection('update')
        await collection.insertOne(updateToAdd)
        return updateToAdd;
    } catch (err) {
        logger.error('cannot insert update', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.byUserId) criteria.byUserId = filterBy.byUserId
    return criteria
}

module.exports = {
    query,
    remove,
    add
}


