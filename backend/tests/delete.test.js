const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const { init } = require('../server')

const { expect } = Code;
const { before, describe, it } = exports.lab = Lab.script();

describe('DELETE /contacts', () => {

    let user_token;

    before(async () => {
        const user = { email: 'leonardo@tmnt.com', password: 'simSensei' }

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

    describe('dado que eu tenho um contato indesejado', () => {

        const contact = {
            name: 'Destruidor',
            number: '11666666666',
            description: 'Aulas de vilania'
        }

        let server
        let resp
        let contactId

        before(async () => {
            server = await init()

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { 'Authorization': user_token }
            })

            contactId = resp.result._id
        })

        it('quando eu apago esse contato', async () => {
            resp = await server.inject({
                method: 'delete',
                url: '/contacts/' + contactId,
                headers: { 'Authorization': user_token }
            })
        })

        it('deve retornar 204', () => {
            expect(resp.statusCode).to.equal(204)
        })
    })

    describe('dado que não tenho acesso', () => {

        const contact = {
            name: 'Destruidor',
            number: '11666666666',
            description: 'Aulas de vilania'
        }

        let server
        let resp
        let contactId

        before(async () => {
            server = await init()

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { 'Authorization': user_token }
            })

            contactId = resp.result._id
        })

        it('quando tento esse contato', async () => {
            resp = await server.inject({
                method: 'delete',
                url: '/contacts/' + contactId,
                headers: { 'Authorization': "5f918ac8a4a93e28e41d1234" }
            })
        })

        it('deve retornar 401', () => {
            expect(resp.statusCode).to.equal(401)
        })
    })
})