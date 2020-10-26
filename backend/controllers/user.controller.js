const UserModel = require('../models/user.model')
const md5 = require('md5')

module.exports = {
    async create(request, h) {
        if (request.payload === null) {
            return h.response({ message: 'Bad JSON' }).code(400)
        }

        if (!request.payload.email) {
            return h.response({ message: 'O email é obrigatório.' }).code(409);
        }
        if (!request.payload.password) {
            return h.response({ message: 'A senha é obrigatória.' }).code(409);
        }

        const user = new UserModel({
            email: request.payload.email,
            password: md5(request.payload.password)
        })

        const dup = await UserModel.findOne({ email: user.email }).exec();

        if (dup)
            return h.response({ error: 'Esse email já está cadastrado' }).code(409)

        try {
            let result = await user.save();

            return h.response(result).code(201);

        } catch (error) {
            return h.response(error).code(500)
        }
    },
    async login(request, h) {

        if (request.payload === null) {
            return h.response({ message: 'Bad JSON' }).code(400)
        }

        const { email, password } = request.payload

        try {
            const user = await UserModel.findOne({ email: email, password: md5(password) }).exec();

            if (!user) {
                return h.response({ error: 'Não autorizado' }).code(401)
            }

            return h.response({ user_token: user._id }).code(200)
        } catch (error) {
            return h.response(error).code(500)
        }

    }
}