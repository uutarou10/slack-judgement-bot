import { ReactionType } from "./reactionType";

export default class Vote {
  userId: string;
  reactionType: ReactionType;

  constructor(userId: string, reactionType: ReactionType) {
    this.userId = userId;
    this.reactionType = reactionType;
  }
}