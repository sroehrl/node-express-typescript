import {Model} from "../Model";
import mysql from "../../utils/mysql";
import bcrypt from "bcrypt";

interface RegistrationInterface {
    id?: string,
    userName: string,
    password: string
}

class User extends Model{
    constructor() {
        super('user',['password']);
    }
    async create(newObject: RegistrationInterface): Promise<UserInterface>{
        newObject.id = await this.createId();
        newObject.password = await bcrypt.hash(newObject.password, 10);
        try{
            await mysql.insert('user', newObject);
            return await this.get(newObject.id);
        } catch (e) {
            console.log(e)
        }

    }
    async login(userName: string, password: string): Promise<UserInterface>{
        try{
            const user = await mysql.find('user',{userName})
            const match = await bcrypt.compare(password,user[0].password);
            if(match){
                delete user[0].password;
                return user[0];
            }
            return null;
        } catch (e) {
            return null;
        }

    }
}

export default new User();