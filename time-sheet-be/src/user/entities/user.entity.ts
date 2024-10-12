import { Exclude } from "class-transformer";
import { Branch } from "src/admin/branch/entities/branch.entity";
import { Position } from "src/admin/position/entities/position.entity";
import { Project } from "src/project/entities/project.entity";
import { Task } from "src/task/entities/task.entity";
import { TimeSheet } from "src/time-sheet/entities/time-sheet.entity";
import { UserRole } from "src/utils/user-role.enum";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity()
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string; 

    @Column()
    @Exclude()
    password: string;

    @Column({
      type: 'enum',
      enum: UserRole,
      default: UserRole.USER
    })
    role: UserRole[]; 
    
    @Column()
    sex?: string

    @ManyToMany(() => Project, project => project.users)
    projects: Project[];

    @OneToMany(() => TimeSheet, timesheet => timesheet.user)
    timesheet: TimeSheet[];

    @ManyToOne(() => Branch, branch => branch.user)
    @JoinColumn()
    branch: Branch;

    @ManyToOne(() => Position, position => position.user)
    @JoinColumn()
    position: Position;
}

