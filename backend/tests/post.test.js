const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const { init } = require('../server')

const { expect } = Code;
const { before, describe, it } = exports.lab = Lab.script();

describe('POST /contacts', () => {

    let resp;
    let user_token

    before(async () => {
        const user = { email: 'michellangelo@tmnt.com', password: 'santatartaruga' }

        var server = await init();

        await server.inject({
            method: 'post',
            url: '/users',
            payload: user
        })

        resp = await server.inject({
            method: 'post',
            url: '/session',
            payload: user
        })

        user_token = resp.result.user_token
    })

    describe('quando o payload é válido', () => {
        before(async () => {

            var server = await init();

            let contact = {
                name: "Ian Ramalho Targino",
                number: "83998554664",
                description: "Orçamento de corridas"
            }

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { 'Authorization': user_token }
            })
        })

        it('deve retornar 200', async () => {
            expect(resp.statusCode).to.equal(201)
        })

        it('deve retornar o id do contato', async () => {
            expect(resp.result._id).to.be.a.object()
            expect(resp.result._id.toString().length).to.equals(24)
        })
    })

    describe('quando o contato já existe', () => {
        before(async () => {

            var server = await init();            

            let contact = {
                name: "Nina Ramalho Targino",
                number: "83998554665",
                description: "Orçamento de aulas de dança"
            }

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { 'Authorization': user_token }
            })

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { 'Authorization': user_token }
            })
        })

        it('deve retornar 409', async () => {
            expect(resp.statusCode).to.equal(409)
        })

        it('deve retornar o id do contato', async () => {
            expect(resp.result._id).to.be.a.object()
            expect(resp.result._id.toString().length).to.equals(24)
        })
    })

    describe('quando não tenho acesso', () => {
        before(async () => {

            var server = await init();

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: null,
                headers: { 'Authorization': '5f918ac8a4a93e28e41d1234' }
            })
        })

        it('deve retornar 401', async () => {
            expect(resp.statusCode).to.equal(401)
        })

    })
    
    describe('quando o payload é vazio', () => {
        before(async () => {

            var server = await init();

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: null,
                headers: { 'Authorization': user_token }
            })
        })

        it('deve retornar 400', async () => {
            expect(resp.statusCode).to.equal(400)
        })

    })

    describe('quando o payload não tem o nome', () => {
        before(async () => {

            var server = await init();

            let contact = {
                number: "83998554664",
                description: "Orçamento de corridas"
            }

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { 'Authorization': user_token }
            })
        })

        it('deve retornar 409', async () => {
            expect(resp.statusCode).to.equal(409)
        })

        it('deve retornar uma mensagem', async () => {
            expect(resp.result.message).to.equal('O nome é obrigatório.')
        })
    })

    describe('quando o nome está em branco', () => {
        before(async () => {

            var server = await init();

            let contact = {
                name: "",
                number: "83998554664",
                description: "Orçamento de corridas"
            }

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { 'Authorization': user_token }
            })
        })

        it('deve retornar 409', async () => {
            expect(resp.statusCode).to.equal(409)
        })

        it('deve retornar uma mensagem', async () => {
            expect(resp.result.message).to.equal('O nome é obrigatório.')
        })
    })

    describe('quando o payload não tem o WhatsApp', () => {
        before(async () => {

            var server = await init();

            let contact = {
                name: "Ian Ramalho Targino",
                description: "Orçamento de corridas"
            }

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { 'Authorization': user_token }
            })
        })

        it('deve retornar 409', async () => {
            expect(resp.statusCode).to.equal(409)
        })

        it('deve retornar uma mensagem', async () => {
            expect(resp.result.message).to.equal('O WhatsApp é obrigatório.')
        })
    })

    describe('quando o WhatsApp está em branco', () => {
        before(async () => {

            var server = await init();

            let contact = {
                name: "Ian Ramalho Targino",
                number: "",
                description: "Orçamento de corridas"
            }

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { 'Authorization': user_token }
            })
        })

        it('deve retornar 409', async () => {
            expect(resp.statusCode).to.equal(409)
        })

        it('deve retornar uma mensagem', async () => {
            expect(resp.result.message).to.equal('O WhatsApp é obrigatório.')
        })
    })

    describe('quando o payload não tem a descrição', () => {
        before(async () => {

            var server = await init();

            let contact = {
                name: "Ian Ramalho Targino",
                number: "83998554664"
            }

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { 'Authorization': user_token }
            })
        })

        it('deve retornar 409', async () => {
            expect(resp.statusCode).to.equal(409)
        })

        it('deve retornar uma mensagem', async () => {
            expect(resp.result.message).to.equal('A descrição é obrigatória.')
        })
    })

    describe('quando a descrição está em branco', () => {
        before(async () => {

            var server = await init();

            let contact = {
                name: "Ian Ramalho Targino",
                number: "83998554664",
                description: ""
            }

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { 'Authorization': user_token }
            })
        })

        it('deve retornar 409', async () => {
            expect(resp.statusCode).to.equal(409)
        })

        it('deve retornar uma mensagem', async () => {
            expect(resp.result.message).to.equal('A descrição é obrigatória.')
        })
    })

})