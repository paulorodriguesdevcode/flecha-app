import { Leader } from "./leader";
import { Team } from "./team";

export interface Progress {
    _id?: string  
    goalId: string
    referenceId: string
    amount: number
}

export class Goal {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  target?: 'leader' | 'team' | string;
  leaders?: Leader[];
  teams?: Team[];
  referenceIds?: string[];
  referenceDetails?: Leader[] | Team[]
  isDeleted?: boolean;
  teamIds?: string[];
  result?: number
  totalProgress?: number
  progress?: Progress[]
  expectedGoal?: number

  constructor(
    id: string,
    title: string,
    dueDate: string,
    target: 'leader' | 'team',
    referenceIds: string[],
    description?: string,
    leaders?: Leader[],
    teams?: Team[],
    isDeleted?: boolean,
    teamIds?: string[],
    expectedGoal?: number
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.target = target;
    this.referenceIds = referenceIds;
    this.leaders = leaders;
    this.teams = teams;
    this.isDeleted = isDeleted;
    this.teamIds = teamIds;
    this.expectedGoal = expectedGoal;
  }
}
