import Auth from "../middleware/auth";
import {Express, Request, Response} from 'express-serve-static-core'
import Resolver from "../utils/resolver";
import {Model} from "../models/Model";
const Fake = new Resolver(new Model('test'));
export default  (app: Express) => {
    /*
    * public route
    * */
    app.get('/api/public', async (req:Request, res: Response) => {
        res.json({test: 'some'});
    })
    /*
    * protected route
    * */
    app.get('/api/protected', Auth.protected, (req:Request, res: Response) => {
        res.json({test: 'some'});
    })
    /*
    * resolved route
    * NOTE: this route will fail unless run through testing suite
    * */
    app.get('/api/fake/:id', Fake.get)


}