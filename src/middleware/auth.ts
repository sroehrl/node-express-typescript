import jsonwebtoken from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express-serve-static-core'
import AuthObject from "./AuthObjectInterface";

declare module 'express-serve-static-core' {
    interface Request {
        user?: AuthObject
    }

    interface Response {
        myField?: string
    }
}

const secret = process.env.JWT_SECRET || 'my-secret';

class Auth {
    assign = (payload: AuthObject): string => {
        return jsonwebtoken.sign(payload, secret);
    }

    decode = (jwt: string): AuthObject => {
        try {
            return jsonwebtoken.verify(jwt, secret);
        } catch (e) {
            return null;
        }
    }

    protected = (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.header('Authorization');
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            const jwt: AuthObject = this.decode(token);
            if (jwt) {
                console.log(jwt)
                req.user = jwt;
                next();
            }
        }
        if(typeof req.user === 'undefined'){
            res.status(401).json({error: 'unauthorized'}).end();
        }
    }

}


export default new Auth();