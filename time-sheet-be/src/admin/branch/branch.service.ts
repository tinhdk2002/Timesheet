import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './entities/branch.entity';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>
  ) {}
  async create(createBranchDto: CreateBranchDto) {
    let branch: Branch = new Branch();
    branch.name = createBranchDto.name;
    branch.displayName = createBranchDto.displayName;
    branch.code = createBranchDto.code;
    return await this.branchRepository.save(branch)
  }

  async findAll() {
    return await this.branchRepository.find();
  }

  async findOne(id: number) {
    const user = await this.branchRepository.findOne({
      where: {id: id}
    })
    if (!user) {
      throw new NotFoundException('Not found branch') 
    }
    return user
  }

   async update(id: number, updateBranchDto: UpdateBranchDto) {
    const branch: Branch = await this.findOne(id)
    if (!branch) {
      throw new NotFoundException('Not found branch')
    }
    if (updateBranchDto.name) {
      branch.name = updateBranchDto.name
    }
    if (updateBranchDto.displayName) {
      branch.displayName = updateBranchDto.displayName
    }
    if (updateBranchDto.code) {
      branch.code = updateBranchDto.code
    }
    return this.branchRepository.save(branch)
  }

  async remove(id: number) {
    const branch = await this.findOne(id)
    if (!branch) {
      throw new NotFoundException("Not found branch")
    }
    return this.branchRepository.delete(id)
  }
}
