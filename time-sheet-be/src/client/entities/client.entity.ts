import { Project } from "src/project/entities/project.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    name: string

    @Column()
    code: string

    @Column()
    address?: string

    @OneToMany(() => Project, project => project.client)
    project: Project[];
}
