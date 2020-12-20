import auth from '../src/middleware/auth';
import mysql from "../src/utils/mysql";
import {app, server} from '../src';
import {Model} from '../src/models/Model';
import Resolver from "../src/utils/resolver";
let runner;
describe('Internals tests', () => {
    beforeEach(async done=>{
        server.close();
        runner = app.listen(4000);
        setTimeout(()=> done(),800)
    })
    afterEach(done => {
        runner.close(done)
    })


    it('should create & validate jwt', async () => {
        const user = {userId:'123456',scope: ['all']};
        let jwt = auth.assign(user);
        let decoded = auth.decode(jwt);
        expect(decoded.userId).toBe(user.userId)
    })


    it('should enable CRUD', async () => {
        const connection = mysql.getConnection();
        const f = new Model('fake',['id']);
        connection.addExpectedOutcome(null,[{id:'1',name:'test'}])
        // get
        let get = await f.get('1');
        expect(get.name).toBe('test')
        // find
        connection.addExpectedOutcome(null,[{id:'1',name:'test'}])
        let find = await f.find({id:'1'})
        expect(find[0].name).toBe('test')
        // update
        connection.addExpectedOutcome(null,{success:true})
        let update = await f.update({id:'1'})
        expect(update.success).toBe(true)
        // create
        connection.addExpectedOutcome(null,[{id:'abc'}])
        connection.addExpectedOutcome(null,{ok:true})
        connection.addExpectedOutcome(null,[{id:'abc', name:'worked'}])
        let create = await f.create({name:'worked'})
        expect(create.name).toBe('worked')

    })

})