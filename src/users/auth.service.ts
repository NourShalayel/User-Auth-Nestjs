import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from "util";


const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {

    constructor(private userService: UsersService) { }

    async signup(email: string, password: string) {

        //see if email used!

        const users = await this.userService.find(email);
        if (users.length) {
            throw new BadRequestException("email already used")
        }

        //Hash useer password 
        //generate the salt 
        const salt = randomBytes(8).toString('hex');
        //hash the salt and password togrther
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        //join the hased result and the salt together 
        const result = salt + '.' + hash.toString('hex');

        //create new user
        const user = await this.userService.create(email, result);

        //return the user
        return user
    }

    async signin(email: string, password: string) {

        const [user] = await this.userService.find(email);
        if (!user) {
            throw new NotFoundException("email does not exist , please sign up first ")
        }

        const [salt, sortedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (sortedHash != hash.toString('hex')) {
            throw new BadRequestException('Incorrect Password !')
        }

        return user;

    }
}