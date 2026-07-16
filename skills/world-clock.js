/* World clock — "what time is it in Tokyo" — pure local, uses the browser's
   own timezone database via Intl. Add cities to the map freely. */

(() => {
const ZONES = {
  tokyo: 'Asia/Tokyo', london: 'Europe/London', paris: 'Europe/Paris', berlin: 'Europe/Berlin',
  rome: 'Europe/Rome', madrid: 'Europe/Madrid', moscow: 'Europe/Moscow', dubai: 'Asia/Dubai',
  'hong kong': 'Asia/Hong_Kong', beijing: 'Asia/Shanghai', shanghai: 'Asia/Shanghai',
  singapore: 'Asia/Singapore', seoul: 'Asia/Seoul', mumbai: 'Asia/Kolkata', delhi: 'Asia/Kolkata',
  sydney: 'Australia/Sydney', melbourne: 'Australia/Melbourne', auckland: 'Pacific/Auckland',
  honolulu: 'Pacific/Honolulu', hawaii: 'Pacific/Honolulu', anchorage: 'America/Anchorage',
  'los angeles': 'America/Los_Angeles', 'san francisco': 'America/Los_Angeles', seattle: 'America/Los_Angeles',
  denver: 'America/Denver', chicago: 'America/Chicago', houston: 'America/Chicago', dallas: 'America/Chicago',
  'new york': 'America/New_York', miami: 'America/New_York', boston: 'America/New_York',
  toronto: 'America/Toronto', 'mexico city': 'America/Mexico_City', 'sao paulo': 'America/Sao_Paulo',
  'buenos aires': 'America/Argentina/Buenos_Aires', cairo: 'Africa/Cairo', lagos: 'Africa/Lagos',
  johannesburg: 'Africa/Johannesburg', nairobi: 'Africa/Nairobi', istanbul: 'Europe/Istanbul',
  amsterdam: 'Europe/Amsterdam', stockholm: 'Europe/Stockholm', dublin: 'Europe/Dublin',
  lisbon: 'Europe/Lisbon', athens: 'Europe/Athens', warsaw: 'Europe/Warsaw', kyiv: 'Europe/Kyiv',
  bangkok: 'Asia/Bangkok', jakarta: 'Asia/Jakarta', manila: 'Asia/Manila', taipei: 'Asia/Taipei',
  'tel aviv': 'Asia/Jerusalem', reykjavik: 'Atlantic/Reykjavik',
};
NOVA.registerSkill({
  name: 'world clock',
  hint: '"what time is it in Tokyo"',
  match: t => {
    const m = t.match(/what(?:'s| is)? (?:the )?time (?:is it )?in ([a-z .'-]+?)[?.]?$/i)
           || t.match(/what time is it in ([a-z .'-]+?)[?.]?$/i);
    return m ? { city: m[1].trim().toLowerCase() } : null;
  },
  async run(m, ctx){
    const zone = ZONES[m.city] || ZONES[Object.keys(ZONES).find(k => m.city.includes(k) || k.includes(m.city))];
    if (!zone) return ctx.reply(`I don't have ${m.city} in my clock table — try a bigger nearby city.`);
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: zone });
    const theirDay = now.toLocaleDateString([], { weekday: 'long', timeZone: zone });
    const myDay = now.toLocaleDateString([], { weekday: 'long' });
    ctx.reply(`It's ${time} in ${m.city.replace(/\b\w/g, c => c.toUpperCase())}${theirDay !== myDay ? `, on ${theirDay}` : ''}.`);
  }
});
})();
