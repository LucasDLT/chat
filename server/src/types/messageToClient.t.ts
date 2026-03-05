export interface PublicMessage {
  id: number;
  text: string;
  craetedAt: Date;
  sender: PublicUser;
}
export interface PublicUser {
  id: number;
  name: string;
}


export interface PrivateMessage {
  id:number, 
  text:string,
  craetedAt:Date,
  sender:PrivateUser,
  receiver:PrivateUser | null
}
interface PrivateUser {
  id: number;
  name: string;
}