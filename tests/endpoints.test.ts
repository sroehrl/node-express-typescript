import request from 'supertest';
import {app, server, invokeRoutes} from '../src';
import auth from "../src/middleware/auth";


const fakeRequest = request(app);
let runner;
describe('Endpoint tests', () => {
    beforeEach(done=>{
        server.close();
        invokeRoutes();
        runner = app.listen(4000);
        setTimeout(()=> done(),500)
    })
    afterEach(done => {
        runner.close(done)
    })


    it('should return public test', async () => {
        let response = await fakeRequest.get('/api/public');
        expect(response.status).toBe(200);
        expect(response.body.test).toBe('some')
    })
    it('should return unauthenticated status', async () => {
        let response = await fakeRequest.get('/api/protected');
        expect(response.status).toBe(401);
    })
    it('should return authenticated status', async () => {
        const user = {userId:'123456',scope: ['all']};
        let jwt = auth.assign(user);
        let response = await fakeRequest
            .get('/api/protected')
            .set({ "Authorization":"token " + jwt });
        expect(response.status).toBe(200);
    })
    it('should return index fallback', async () => {
        let response = await fakeRequest.get('/does-not-exist');
        expect(response.status).toBe(200);
        expect(response.text).toContain('<div class="container">');
    })
    it('should return public test', async () => {
        let response = await fakeRequest.get('/api/public');
        expect(response.status).toBe(200);
        expect(response.body.test).toBe('some')
    })
    it('should test resolver', async () => {
        let response = await fakeRequest.get('/api/fake/123');
        expect(response.status).toBe(200);

    })
})