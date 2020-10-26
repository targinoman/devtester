const UserController = require('../controllers/user.controller')

module.exports = [
    {
        method: 'POST',
        path: '/users',
        handler: UserController.create
    },
    {
        method: 'POST',
        path: '/session',
        handler: UserController.login
    }
]