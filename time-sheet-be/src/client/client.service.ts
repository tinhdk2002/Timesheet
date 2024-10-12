import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRespository: Repository<Client>
  ) {}

  async create(createClientDto: CreateClientDto) {
    let client = new Client();
    client.code = createClientDto.code;
    client.name = createClientDto.name;
    if(createClientDto.address)
      client.address = createClientDto.address;
    return await this.clientRespository.save(client)
  }

  async findAll() {
    return await this.clientRespository.find();
  }

  async findOne(id: number) {
    let client =  await this.clientRespository.findOne({where: {id: id}})
    if (!client) {
      throw new NotFoundException(`Not found client #${id}`);
    }
    return client
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    let client = await this.findOne(id)
    if(updateClientDto.name)
      client.name = updateClientDto.name
    if(updateClientDto.code)
      client.code = updateClientDto.code
    if(updateClientDto.address)
      client.address = updateClientDto.address
    this.clientRespository.save(client)
    return client;
  }

  async remove(id: number) {
    const client = await this.findOne(id)
    if(!client)
      throw new NotFoundException('Not found client') 
    return this.clientRespository.delete(id).catch((e) => {
      console.log(e.detail)
    });
  }
}
