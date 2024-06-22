import { time } from "console";
import { Client } from "src/client/entities/client.entity";
import { Task } from "src/task/entities/task.entity";
import { TimeSheet } from "src/time-sheet/entities/time-sheet.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name: string

    @Column()
    code: string


    @Column({
        type: 'date',
        default: () => 'CURRENT_DATE'
    })
    startAt: Date;
 
    @Column({type: 'date'})
    endAt: Date;


    @ManyToOne(() => Client, client => client.project, {cascade: true})
    @JoinColumn()
    client: Client 

    @ManyToMany(() => User, user => user.projects)
    @JoinTable()
    users: User[];

    @ManyToMany(() => Task)
    @JoinTable()
    tasks: Task[];

    @OneToMany(() => TimeSheet, timesheet => timesheet.projects)
    timesheets: TimeSheet[]
}
