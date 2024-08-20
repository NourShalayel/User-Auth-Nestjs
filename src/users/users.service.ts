import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private repo: Repository<User>) { }

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }


  findOne(id: number) {
    if(!id){
      return null
    }
    return this.repo.findOneBy({id});

  }

  find(email: string) {
    return this.repo.findBy({ email });

  }

  async update( id : number , attrs : Partial<User> ) {
    const user = await this.findOne(id);
    if(!user){
      throw new Error('user not foune')
    }
    Object.assign(user , attrs);
    
    return this.repo.save(user);
  }

  async remove(id : number) {
    console.log(id)
    const user = await this.findOne(id);
    if(!user){
      throw new Error('user not foune')
    }
    return this.repo.remove(user);

  }
}
