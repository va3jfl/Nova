/* Countdown — "how many days until Christmas" / "how long until July 20".
   Pure local date math; knows common holidays, plain dates, and computes
   floating ones like Thanksgiving. */

(() => {
const fixed = { // month (1-12), day
  christmas: [12, 25], 'christmas eve': [12, 24], "new year's eve": [12, 31], 'new years eve': [12, 31],
  'new year': [1, 1], "new year's": [1, 1], halloween: [10, 31], "valentine's day": [2, 14],
  valentines: [2, 14], 'st patricks day': [3, 17], "st patrick's day": [3, 17],
  'fourth of july': [7, 4], 'july 4th': [7, 4], 'independence day': [7, 4],
  'april fools': [4, 1], 'cinco de mayo': [5, 5], 'veterans day': [11, 11], 'earth day': [4, 22],
};
const MONTHS = { january:1, february:2, march:3, april:4, may:5, june:6, july:7,
  august:8, september:9, october:10, november:11, december:12 };
function thanksgiving(year){                       // 4th Thursday of November
  const d = new Date(year, 10, 1);
  const firstThu = 1 + ((11 - d.getDay()) % 7);
  return new Date(year, 10, firstThu + 21);
}
function nextDate(mo, day){
  const now = new Date(); let d = new Date(now.getFullYear(), mo - 1, day);
  d.setHours(0, 0, 0, 0);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (d < today) d = new Date(now.getFullYear() + 1, mo - 1, day);
  return d;
}
NOVA.registerSkill({
  name: 'countdown',
  hint: '"how many days until Christmas" / "how long until July 20"',
  match: t => {
    const m = t.match(/how (?:many days|long) (?:is it )?(?:until|till|to) (.+?)[?.]?$/i)
           || t.match(/days until (.+?)[?.]?$/i);
    return m ? { what: m[1].trim().toLowerCase() } : null;
  },
  async run(m, ctx){
    let target = null, label = m.what;
    if (fixed[m.what]) target = nextDate(...fixed[m.what]);
    else if (/thanksgiving/.test(m.what)){
      target = thanksgiving(new Date().getFullYear());
      const today = new Date(); today.setHours(0,0,0,0);
      if (target < today) target = thanksgiving(new Date().getFullYear() + 1);
    } else {
      const md = m.what.match(/(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:st|nd|rd|th)?/i)
              || m.what.match(/(\d{1,2})(?:st|nd|rd|th)? (?:of )?(january|february|march|april|may|june|july|august|september|october|november|december)/i);
      if (md){
        const mo = MONTHS[(md[1] + '').toLowerCase()] || MONTHS[(md[2] + '').toLowerCase()];
        const day = parseInt(md[2], 10) || parseInt(md[1], 10);
        if (mo && day >= 1 && day <= 31) target = nextDate(mo, day);
      }
      const slash = m.what.match(/^(\d{1,2})\/(\d{1,2})$/);
      if (!target && slash) target = nextDate(+slash[1], +slash[2]);
    }
    if (!target) return ctx.reply(`I couldn't work out the date for "${m.what}". Try a holiday name or something like "July 20th".`);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const days = Math.round((target - today) / 86400e3);
    if (days === 0) return ctx.reply(`That's today! Happy ${label}!`);
    if (days === 1) return ctx.reply(`That's tomorrow!`);
    const weeks = days >= 21 ? ` — about ${Math.round(days / 7)} weeks` : '';
    ctx.reply(`${days} days until ${label}${weeks}.`);
  }
});
})();
