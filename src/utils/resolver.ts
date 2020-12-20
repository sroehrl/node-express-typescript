import {Model} from "../models/Model";
import {Request, Response, NextFunction} from 'express-serve-static-core'

export default class Resolver{
    private model: Model;
    constructor(modelInstance: Model) {
        this.model = modelInstance;
    }
    get = async (req: Request, res: Response) => {
        const id = req.params.id || req.user.userId;
        res.json(await this.model.get(id));
    }
    getAll = async (req: Request, res: Response) => {
        res.json(await this.model.find());
    }
    create = async (req: Request, res: Response) => {
        res.json(await this.model.create(req.body))
    }
    update = async (req: Request, res: Response) => {
        res.json(await this.model.update(req.body))
    }

}