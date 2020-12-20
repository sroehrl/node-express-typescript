import mysql from "../utils/mysql";

export class Model {
    private readonly currentModel: string;
    private excluded: Array<string>;
    constructor(modelName: string, hide: Array<string> = []) {
        this.currentModel = modelName;
        this.excluded = hide;
    }
    async get(id:string){
        let entity = await mysql.get(this.currentModel, id)
        if(entity){
            this.excluded.forEach(key => {
                delete entity[key];
            })
        }
        return entity;
    }
    async find(condition:object = {}){
        let entities = await mysql.find(this.currentModel, condition);
        entities.forEach((entity,i)=>{
            this.excluded.forEach(key => {
                delete entities[i][key];
            })
        })
        return entities;
    }
    async create(newObject:any){
        newObject.id = await this.createId();
        await mysql.insert(this.currentModel, newObject)
        return await this.get(newObject.id);
    }
    async update(existingObject:object){
        return await mysql.update(this.currentModel, existingObject)
    }
    async createId():Promise<string>{
        let result = await mysql.raw('SELECT REPLACE(UUID(),"-","") as id');
        return result[0].id;
    }
}