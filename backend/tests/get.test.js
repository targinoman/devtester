const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const { init } = require('../server')

const { expect } = Code;
const { before, describe, it } = exports.lab = Lab.script();

describe('GET /contacts', () => {

    let resp;
    let user_token;

    before(async () => {
        const user = { email: 'raphael@tmnt.com', password: 'porrada' }

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

    before(async () => {

        var server = await init();

        resp = await server.inject({
            method: 'get',
            url: '/contacts',
            headers: { 'Authorization': user_token }
        })
    })

    it('deve retornar 200', async () => {
        expect(resp.statusCode).to.equal(200)
    })

    it('deve retornar uma lista', async () => {
        expect(resp.respult).to.be.array()
    })
})