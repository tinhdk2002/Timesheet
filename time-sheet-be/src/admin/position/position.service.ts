import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Position } from './entities/position.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>
  ) {}
  async create(createPositionDto: CreatePositionDto) {
    let position: Position = new Position();
    position.name = createPositionDto.name;
    position.shortName = createPositionDto.shortName;
    position.code = createPositionDto.code;
    return await this.positionRepository.save(position);
  }

  async findAll() {
    return await this.positionRepository.find();
  }

  async findOne(id: number) {
    const position = await this.positionRepository.findOne({where: {id: id}});
    if (!position) {
      throw new NotFoundException("Not found Position")
    }
    return position;
  }

  async update(id: number, updatePositionDto: UpdatePositionDto) {
    const position = await this.findOne(id)
    if (!position) {
      throw new NotFoundException(`Not found postition #${id}`);
    } 
    if (updatePositionDto.code) {
      position.code = updatePositionDto.code
    } 
    if (updatePositionDto.name) {
      position.name = updatePositionDto.name
    }
    if (updatePositionDto.shortName) {
      position.shortName = updatePositionDto.shortName
    }
    this.positionRepository.save(position)
    return position;
  }

  async remove(id: number) {
    const position = await this.findOne(id)
    if(!position) {
      throw new NotFoundException(`Not fount ${id} position`)
    }
    return this.positionRepository.delete(id)
  }
}
