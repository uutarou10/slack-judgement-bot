import { RTMClient } from '@slack/client'
import Trial from './model/trial';
import { ResultType } from './model/resultType';
import { ReactionType } from './model/reactionType';

const token = process.env.SLACK_TOKEN || ''
const config = {
  beginEmoji: 'deliberation',
  guiltyEmoji: 'guilty',
  notGuiltyEmoji: 'not-guilty',
  judgementSeconds: 60
}

const rtm = new RTMClient(token);
rtm.start();

let trials: Trial[] = [];

rtm.on('message', event => {
  if (event.text && event.text.includes(`:${config.beginEmoji}:`)) {
    rtm.sendMessage(
      `開廷!\n有罪だと思ったら:${config.guiltyEmoji}:、無罪だと思ったら:${config.notGuiltyEmoji}:をこのメッセージのリアクションにつけてね!(${config.judgementSeconds}秒以内)`,
      event.channel
    ).then(res => {
      const trial = new Trial(res.ts, event.channel);
      trials = [...trials, trial];
      
      setTimeout(() => {
        const result = trial.judgement();
        let message = '';

        switch (result) {
          case ResultType.Guilty:
            message = "判決!\n被告人は…………… *有罪* !!!!\n以上、閉廷!"           
            break;
          case ResultType.NotGuilty:
            message = "判決!\n被告人は…………… *無罪* !!!!\n以上、閉廷!"           
            break;
          case ResultType.Draw:
            const isGuilty = Math.random() >= 0.5;
            message = `判決!\n被告人は…………… (票数が同じだったので裁判長の独断で) *${isGuilty ? "有罪" : "無罪"}* !!!!\n以上、閉廷!`           
            break;
        }

        rtm.sendMessage(message, trial.conversation);
        trials = trials.filter(t => trial.ts !== t.ts);
      }, config.judgementSeconds * 1000);
    })
  }
});

rtm.on('reaction_added', event => {
  if ([config.guiltyEmoji, config.notGuiltyEmoji].includes(event.reaction)) {
    const trial = trials.find(trial => trial.ts === event.item.ts);

    if (trial) {
      trial.addVote(event.user, event.reaction === config.guiltyEmoji ? ReactionType.Guilty : ReactionType.NotGuilty);
    }
  }
});

rtm.on('reaction_removed', event => {
  if (event.reaction.includes([config.guiltyEmoji, config.notGuiltyEmoji])) {
    const trial = trials.find(trial => trial.ts === event.item.ts);

    if (trial) {
      trial.removeVote(event.user);
    }
  }
})
