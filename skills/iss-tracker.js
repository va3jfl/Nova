/* Example data→brain plugin: live position of the International Space
   Station, via api.wheretheiss.at (free, CORS-friendly, no key).
   Shows the pattern: fetch real data, then let NOVA's brain phrase it. */

NOVA.registerSkill({
  name: 'iss tracker',
  hint: '"where is the space station"',
  match: t => /\bwhere(?:'s| is) the (?:iss|(?:international )?space station)\b/i.test(t) ? [1] : null,
  async run(m, ctx){
    const r = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
    if (!r.ok) return ctx.reply("I couldn't reach the satellite tracker.");
    const d = await r.json();
    await ctx.brain('iss tracker',
      `ISS right now: latitude ${d.latitude.toFixed(1)}, longitude ${d.longitude.toFixed(1)}, ` +
      `altitude ${Math.round(d.altitude)} km, speed ${Math.round(d.velocity)} km/h, ` +
      `visibility: ${d.visibility}. ` +
      'Tell the user roughly where that is over Earth in plain words (ocean/continent, hemisphere), and one fun detail.');
  }
});
