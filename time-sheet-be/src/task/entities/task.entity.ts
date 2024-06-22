import { IsEnum } from "class-validator";
import { time } from "console";
import { Project } from "src/project/entities/project.entity";
import { TimeSheet } from "src/time-sheet/entities/time-sheet.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, TypeORMError } from "typeorm";

export enum Type {
    COMMON = 'common',
    OTHER = 'other'
}

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @IsEnum(Type)
    @Column({
        type:'enum',
        enum: Type,
        default: Type.COMMON
    })
    type: Type;

    @Column()
    archive:boolean;

    @ManyToMany(() => Project, project => project.tasks)
    projects: Project[]

    @OneToMany(() => TimeSheet, timesheet => timesheet.tasks)
    timesheet: TimeSheet[]
}
