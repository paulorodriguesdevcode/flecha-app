import { Team } from "./team"

export class Leader {
    id: string
    name: string
    email: string
    createdAt?: string
    teams?: Team[]
    teamIds?: string[]

    constructor(id:string, name: string, email: string, createdAt:string, teams: Team[], teamIds: string[]) {
        this.id = id
        this.name = name
        this.email = email
        this.createdAt = createdAt
        this.teams = teams
        this.teamIds = teamIds
    }
}