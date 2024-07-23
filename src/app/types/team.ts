import { Leader } from "./leader"

export class Team {
    id: string
    name: string
    leader?: Leader
    leaderId?: string

    constructor(id:string, name: string, leader: Leader, leaderId: string) {
        this.id = id
        this.name = name
        this.leader = leader
        this.leaderId = leaderId
        
    }
}