import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Message } from "./Message"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!:number

    @Column()
    name!:string
    
    @Column({ unique: true })
    emain!:string
 
    @Column()
    session!:string
 
    @Column()
    password!:string
 
    @OneToMany(() => Message, message => message.sender)
    setMessages!: Message[]

    @OneToMany(() => Message, message => message.receiver)
    receivedMessages!: Message[]
}