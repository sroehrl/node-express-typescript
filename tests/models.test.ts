import {app, server} from "../src";
import auth from "../src/middleware/auth";
import mysql from "../src/utils/mysql";
import User from '../src/models/user';
import bcrypt from 'bcrypt';
let runner;
describe('Models tests', () => {
    beforeEach(async done => {
        server.close();
        runner = app.listen(4000);
        setTimeout(() => done(), 800)
    })
    afterEach(done => {
        runner.close(done)
    })
    it('should return valid output for overwritten UserModel CRUD', async () => {
        const connection = mysql.getConnection();
        const newUser = {id:'123456',userName:'sam',password:'123456'};
        // create
        connection.addExpectedOutcome(null,[{id:'123456'}])
        connection.addExpectedOutcome(null,[newUser])
        connection.addExpectedOutcome(null,[newUser])
        const created = await User.create(newUser);
        expect(created.id).toBe(newUser.id);
        // login
        newUser.password = await bcrypt.hash('123456', 10);
        connection.addExpectedOutcome(null,[newUser])
        const login = await User.login('sam','123456')
        expect(login.id).toBe(newUser.id);
    })

})