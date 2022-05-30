const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query() {
    try {
        // const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('board')
        var boards = await collection.find({}).toArray()
        return boards
    } catch (err) {
        logger.error('cannot find boards', err)
        throw err
    }
}

async function getById(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        const board = collection.findOne({ _id: ObjectId(boardId) })
        console.log(board)
        return board
    } catch (err) {
        logger.error(`while finding board ${boardId}`, err)
        throw err
    }
}

async function remove(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        await collection.deleteOne({ _id: ObjectId(boardId) })
        return boardId
    } catch (err) {
        logger.error(`cannot remove car ${boardId}`, err)
        throw err
    }
}

async function add(board) {
    try {
        // board.createdAt = Date.now()
        const collection = await dbService.getCollection('board')
        const addedBoard = await collection.insertOne(board)
        return addedBoard.insertedId
    } catch (err) {
        logger.error('cannot insert board', err)
        throw err
    }
}

async function update(board) {
    try {
        var id = ObjectId(board._id)
        delete board._id
        const collection = await dbService.getCollection('board')
        await collection.updateOne({ _id: id }, { $set: { ...board } })
        return board
    } catch (err) {
        logger.error(`cannot update board ${board._id}`, err)
        throw err
    }
}

// function _buildCriteria({ filterBy }) {
//     let criteria = {}
//     filterBy = JSON.parse(filterBy)
//     if (filterBy.name) {
//         const regex = new RegExp(filterBy.name, 'i')
//         criteria.name = regex
//     }
//     if (filterBy.status) {
//         if (filterBy.status === 'all') criteria = { ...criteria }
//         if (filterBy.status === 'inStock') criteria.inStock = true
//     }
//     if (filterBy.labels.length) {
//         criteria.labels = { $all: filterBy.labels }
//     }
//     return criteria
// }

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}