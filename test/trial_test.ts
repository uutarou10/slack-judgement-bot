import anyTest, { TestInterface } from 'ava';
import Trial from '../model/trial';
import { ReactionType } from '../model/reactionType';
import { ResultType } from '../model/resultType';

const test = anyTest as TestInterface<{trial: Trial}>
const ts = 'xxxxxxxxxx';
const conversation = 'yyyyy';

test.beforeEach(t => {
	t.context.trial = new Trial(ts, conversation);
})

test('should judge correctly', t => {
	const trial = t.context.trial;
	t.is(trial.judgement(), ResultType.Draw);

	trial.addVote('id1', ReactionType.Guilty);
	t.is(trial.judgement(), ResultType.Guilty);

	trial.addVote('id2', ReactionType.NotGuilty);
	trial.addVote('id3', ReactionType.NotGuilty);
	t.is(trial.judgement(), ResultType.NotGuilty);
});

test('should not be able to vote more than once', t => {
	const users = ['1', '1', '2', '3'];
	users.forEach(u => t.context.trial.addVote(u, ReactionType.Guilty));

	t.deepEqual(t.context.trial.getVoteUseres(), ['1', '2', '3']);
})

test('getVoteUsers should return users array', t => {
	const users = ['1', '2', '3'];
	users.forEach(u => t.context.trial.addVote(u, ReactionType.Guilty));

	t.deepEqual(t.context.trial.getVoteUseres(), users);
})

test('should be able to remove vote with userId', t => {
	const users = ['1', '2', '3'];
	users.forEach(u => t.context.trial.addVote(u, ReactionType.Guilty));
	
	t.context.trial.removeVote('1');
	t.deepEqual(t.context.trial.getVoteUseres(), ['2', '3']);
})