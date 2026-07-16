/* Twenty Questions — a conversational multi-turn plugin.
   Shows the advanced API: NOVA.llm(prompt, system) for raw one-shot brain
   calls (no chat memory), and NOVA.listen(fn) to catch the user's next
   utterance without the wake word.
   You think of a thing; NOVA asks yes/no questions and tries to guess it. */

NOVA.registerSkill({
  name: 'twenty questions',
  hint: '"let\'s play twenty questions" — think of a thing, NOVA guesses',
  match: t => /\b(?:play |let'?s play )?(?:twenty|20) questions\b/i.test(t) ? [1] : null,
  async run(m, ctx){
    if (!(await NOVA.llm('ping'))) return ctx.reply('My brain is still loading — try again in a minute.');
    const MAXQ = 12;
    const qa = [];
    const SYS = 'You are playing 20 questions. The human is thinking of a single common object, animal, food, or thing. ' +
      'You ask strategic yes/no questions to narrow it down. Reply with EXACTLY one line: either your next yes/no question, ' +
      'or, only when quite confident, "GUESS: <the thing>". Never explain, never number, one short question only.';

    const turn = async () => {
      const transcript = qa.length
        ? 'So far:\n' + qa.map(x => `Q: ${x.q} A: ${x.a}`).join('\n')
        : 'No questions asked yet.';
      const forceGuess = qa.length >= MAXQ;
      let out = await NOVA.llm(
        transcript + '\n\n' + (forceGuess
          ? 'You are out of questions. You MUST reply with "GUESS: <your single best guess>".'
          : `Ask question number ${qa.length + 1}, or guess if confident.`), SYS);
      if (!out) return NOVA.say('My brain glitched — game over.');
      out = out.split('\n')[0].trim();
      const guess = out.match(/^guess\s*:?\s*(.+?)[.!?]?$/i);
      if (guess || forceGuess){
        const thing = guess ? guess[1] : out.replace(/[.!?]$/, '');
        await NOVA.say(`Is it ${thing}?`);
        NOVA.listen(async ans => {
          if (/\b(yes|yeah|yep|correct|right|it is)\b/i.test(ans))
            await NOVA.say(`Ha! Got it in ${qa.length + 1} questions. The circuits win again.`);
          else
            await NOVA.say(`Hmm, you win this round. I was sure it was ${thing}. Rematch any time!`);
          return true;
        });
        return;
      }
      await NOVA.say(out);
      NOVA.listen(async function onAnswer(ans){
        if (/\b(stop|quit|give up|end game|cancel)\b/i.test(ans)){ await NOVA.say('Okay, game over.'); return true; }
        const norm = /\b(yes|yeah|yep|correct|it is|it does)\b/i.test(ans) ? 'yes'
                   : /\b(no|nope|nah|it isn'?t|it does not|doesn'?t)\b/i.test(ans) ? 'no'
                   : /\b(sometimes|kind of|sort of|maybe|partially)\b/i.test(ans) ? 'sometimes' : null;
        if (!norm){ await NOVA.say('Just say yes, no, or sometimes.'); NOVA.listen(onAnswer); return true; }
        qa.push({ q: out, a: norm });
        await turn();
        return true;
      });
    };

    await ctx.reply('Think of an object, animal, or food — say "ready" when you have one.');
    NOVA.listen(async ans => {
      if (!/\b(ready|go|okay|yes|yep)\b/i.test(ans)){ await NOVA.say('No rush. Say twenty questions again when ready.'); return true; }
      await turn();
      return true;
    });
  }
});
