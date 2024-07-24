import { Team } from "./team"

export class Leader {
    _id?: string
    id: string
    name: string
    email: string
    createdAt?: string
    teams?: Team[]
    teamIds?: string[]

    constructor(id:string, _id:string, name: string, email: string, createdAt:string, teams: Team[], teamIds: string[]) {
        this._id = _id
        this.id = id
        this.name = name
        this.email = email
        this.createdAt = createdAt
        this.teams = teams
        this.teamIds = teamIds
    }
}