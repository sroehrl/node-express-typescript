import express from 'express';
import loader from "./utils/loader";
import cors from 'cors';
import path from "path";
import fs from 'fs';
import morgan from 'morgan';
morgan(':method :url :status :res[content-length] - :response-time ms');
import {Express, Request, Response, NextFunction} from "express-serve-static-core";

const app : Express = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_PATH = process.env.FRONTEND_PATH || '../';

const frontEndPath = path.join(__dirname,FRONTEND_PATH)
app.use(cors());
app.use(express.json());
app.use(express.static(frontEndPath))
loader(app);

// do not register routes after this!
const allRoutes = [];
const invokeRoutes = () => {
    setTimeout(()=>{
        console.log('Registered routes')
        app._router.stack.forEach(mw => {
            if(mw.route){
                const capture = mw.route.path.match(/^\/[a-z]+[a-z\/-]*/);
                allRoutes.push(capture[0]);
            }
        })
        console.log(allRoutes.join(', '))
    })
}



app.use(function(req:Request, res: Response, next:NextFunction) {

    if(!fs.existsSync(frontEndPath+req.path) && allRoutes.filter(r => req.path.startsWith(r)).length < 1){
        console.log('redirect:',req.path)
        res.sendFile(frontEndPath + 'index.html');
    } else {
        next()
    }

});

const server = app.listen(PORT, () => {
    invokeRoutes();
    console.log('running on http://localhost:'+PORT);
})

export {app, server, invokeRoutes}
