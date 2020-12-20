import {Express, Request, Response} from 'express-serve-static-core'
import auth from "../middleware/auth";
import Resolver from "../utils/resolver";
import userModel from "../models/user"

const UserResolver = new Resolver(userModel);

export default (app: Express) => {
    app.route('/api/auth')
        .post(UserResolver.create)
        .get(auth.protected, UserResolver.get)
        .put(auth.protected, UserResolver.update)
    app.route('/api/login')
        .post((req:Request, res: Response) => {
            userModel.login(req.body.userName, req.body.password).then(user => {
                if(user){
                    const jwt = auth.assign({userId:user.id, scope:['read','write']});
                    res.json({token:jwt});
                } else {
                    res.status(401).end();
                }

            })

        })

}