import Vote from "./vote";
import { ReactionType } from "./reactionType";
import { ResultType } from "./resultType";

export default class Trial {
  ts: string;
  conversation: string;
  votes: Vote[];

  constructor(ts: string, conversation: string) {
    this.ts = ts;
    this.conversation = conversation;
    this.votes = [];
  }

  addVote(userId: string, reactionType: ReactionType): Vote|undefined {
    if (this.votes.find(vote => vote.userId === userId) === undefined) {
      const vote = new Vote(userId, reactionType);
      this.votes = [...this.votes, vote]
      return vote;
    } else {
      return undefined;
    }
  }

  removeVote(userId: string) {
    this.votes = this.votes.filter(vote => vote.userId !== userId);
  }

  judgement(): ResultType {
    let guiltyCount = 0;
    let notGuiltyCount = 0;

    this.votes.forEach(vote => {
      switch (vote.reactionType) {
        case ReactionType.Guilty:
          guiltyCount++;
          break;
        case ReactionType.NotGuilty:
          notGuiltyCount++;
          break;
      }
    })

    if (guiltyCount === notGuiltyCount) {
      return ResultType.Draw;
    } else if (guiltyCount > notGuiltyCount) {
      return ResultType.Guilty;
    } else {
      return ResultType.NotGuilty;
    }
  }

  getVoteUseres(): string[] {
    return this.votes.map(vote => vote.userId)
  }
}