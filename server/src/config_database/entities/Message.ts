import "reflect-metadata"
import { Column, PrimaryGeneratedColumn, Entity, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    text!: string;
    
    @Column()
    craetedAt!: Date;

    @ManyToOne(() => User, user => user.setMessages,{ nullable: false })
    sender!: User;

    @ManyToOne(() => User, user => user.receivedMessages,{ nullable: true })
    receiver!: User | null;
}
//nota sobre relaciones en la entidad User.