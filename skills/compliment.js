/* ============================================================
   NOVA skill plugin — TEMPLATE & EXAMPLE
   ------------------------------------------------------------
   How plugins work:
   1. Put .js files in this /skills folder (next to nova.html).
   2. List them in skills/manifest.json:  ["compliment.js", ...]
   3. They load automatically when NOVA boots.

   A skill is one object:
     NOVA.registerSkill({
       name:  'shown in settings',
       hint:  '"example phrase" — shown in the skills list',
       match: text => truthy-or-null,      // regex match / parsed object
       run:   async (m, ctx) => { ... },   // m is whatever match returned
     });

   Inside run() you get ctx with three wiring styles:
     ctx.reply(text)              → NOVA speaks your answer directly
     ctx.brain(skillName, data)   → hand data/facts to the AI brain,
                                    it phrases the spoken answer itself
     ctx.openModule(name, build)  → take over the CRT screen with your
                                    own UI (see modules in nova.html);
                                    return {onVoice, onClose, hint}
   Also available globally: NOVA.say(text), NOVA.ask(text),
   NOVA.settings, NOVA.debug (last skill→brain handoff).

   SECURITY: plugins run with full page access — only install files
   you wrote or trust.
   ============================================================ */

NOVA.registerSkill({
  name: 'compliment',
  hint: '"give me a compliment"',
  match: t => /\b(give me a )?compliment( me)?\b/i.test(t) ? [1] : null,
  async run(m, ctx){
    const c = [
      'You have excellent taste in robots.',
      'Your voice sounds especially clear today.',
      'Somewhere, a neural network is jealous of your brain.',
      'You ask better questions than most humans I know.',
      'If I had hands, I would give you a high five.',
    ];
    ctx.reply(c[Math.floor(Math.random() * c.length)]);
  }
});
