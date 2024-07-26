import { Leader } from "./leader";
import { Team } from "./team";

export class Goal {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  type?: 'leader' | 'team' | string;
  leaders?: Leader[];
  teams?: Team[];
  referenceIds?: string[];
  isDeleted?: boolean;
  teamIds?: string[];
  result?: number

  constructor(
    id: string,
    title: string,
    dueDate: string,
    type: 'leader' | 'team',
    referenceIds: string[],
    description?: string,
    leaders?: Leader[],
    teams?: Team[],
    isDeleted?: boolean,
    teamIds?: string[]
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.type = type;
    this.referenceIds = referenceIds;
    this.leaders = leaders;
    this.teams = teams;
    this.isDeleted = isDeleted;
    this.teamIds = teamIds;
  }
}
