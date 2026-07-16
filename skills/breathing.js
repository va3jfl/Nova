/* Guided breathing — a MODULE plugin: takes over the CRT screen with a
   pulsing circle and spoken box-breathing cues (4-4-4-4). Shows how plugins
   build screen modules with ctx.openModule. */

(() => {
NOVA.registerSkill({
  name: 'breathing',
  hint: '"start a breathing exercise" / "help me relax"',
  match: t => /\b(?:start |do |begin )?(?:a )?breathing exercise\b/i.test(t)
           || /\bhelp me (?:relax|breathe|calm down)\b/i.test(t)
           || /\bbox breathing\b/i.test(t) ? [1] : null,
  async run(m, ctx){
    let stopped = false, timer = null;
    ctx.openModule('breathe', el => {
      const circle = document.createElement('div');
      circle.style.cssText = 'width:26%;aspect-ratio:1;border-radius:50%;background:var(--face-dim);' +
        'border:2px solid var(--face);box-shadow:0 0 30px var(--face-dim);transition:transform 3.6s ease-in-out;';
      const label = document.createElement('div'); label.className = 'bigSub';
      label.style.fontSize = 'clamp(12px,2.6vw,17px)';
      el.append(circle, label);
      const PHASES = [
        ['BREATHE IN', 1.55, 'Breathe in'],
        ['HOLD', 1.55, 'Hold'],
        ['BREATHE OUT', 1.0, 'And out'],
        ['HOLD', 1.0, ''],
      ];
      let i = 0, round = 0;
      const step = () => {
        if (stopped) return;
        const [txt, scale, cue] = PHASES[i];
        label.textContent = txt;
        circle.style.transform = `scale(${scale})`;
        if (cue && round < 2) NOVA.say(cue);         // spoken cues for the first two rounds
        i = (i + 1) % PHASES.length;
        if (i === 0) round++;
        if (round >= 8){ NOVA.say('Nice work. Feeling calmer?'); NOVA.closeModule(); return; }
        timer = setTimeout(step, 4000);
      };
      step();
      return {
        hint: 'follow the circle · four seconds each · say "close" to stop',
        onClose: () => { stopped = true; clearTimeout(timer); },
      };
    });
    await ctx.reply("Let's do a couple of minutes of box breathing. Follow the circle.");
  }
});
})();
