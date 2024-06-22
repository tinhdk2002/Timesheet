import { Project } from "src/project/entities/project.entity";
import { Task } from "src/task/entities/task.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { StatusTS } from "../ultis/status.enum";
import { User } from "src/user/entities/user.entity";

@Entity()
export class TimeSheet {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    note: string

    @Column()
    time: number

    @Column()
    type: string

    @Column({type: 'date'})
    date: Date

    @Column({
        type: 'enum',
        enum: StatusTS,
        default: StatusTS.NEW,
    })
    status: StatusTS
   

    @ManyToOne(() => Project, project => project.timesheets , {cascade: true})
    @JoinColumn()
    projects: Project

    @ManyToOne(() => Task, task => task.timesheet , {cascade: true})
    @JoinColumn()
    tasks: Task

    @ManyToOne(() => User, user => user.timesheet, {cascade: true})
    @JoinColumn()
    user: User
}
