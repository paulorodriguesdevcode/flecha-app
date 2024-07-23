import { Leader } from "./leader"

export class Team {
    id: string
    name: string
    leader?: Leader
    leaderIds?: string[]

    constructor(id:string, name: string, leader: Leader, leaderIds: string[]) {
        this.id = id
        this.name = name
        this.leader = leader
        this.leaderIds = leaderIds
        
    }
}