import fs from 'fs';
import path from 'path';
import {Express} from "express-serve-static-core";

export default (app: Express) => {
    const routeController = fs.readdirSync(path.join(__dirname, '../routes'), 'utf8');
    routeController.forEach((route) => {
        if (!route.includes('.map')) {
            import('../routes/' + route).then(Controller => {
                Controller.default(app)
            })
        }
    })
}