import "reflect-metadata"
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Message } from "./Message"
import {AuthProvider} from "../../domain/enum/auth_provider_enum"
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!:number

    @Column()
    name!:string
    
    @Column({ unique: true })
    email!:string 
  
    @Column()
    password!:string

    @Column()
    provider!:AuthProvider
 
    @OneToMany(() => Message, message => message.sender)
    setMessages!: Message[]

    @OneToMany(() => Message, message => message.receiver)
    receivedMessages!: Message[]
}

//aca dejo una nota sobre relaciones: usuario puede tener muchos mensajes recibidos y enviados. Se agrega el decorador onetomany y debajo la propiedad tipada usando la entidad relacionada como tipo. La entidad que posea en manytoone, es la que guarda el ID de la relacion. El callback que vemos al inicio y usa la entidad relacionada, indica que llamamos a esa entidad para relacionarla y con el segundo callback indicamos con notacion de puntos que propiedad es la que se relaciona. 