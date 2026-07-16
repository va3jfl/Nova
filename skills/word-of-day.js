/* Word of the day — rotates daily through a curated list, no network needed.
   Also: "give me a fancy word" for a random one. */

(() => {
const WORDS = [
  ['petrichor', 'the pleasant smell of earth after rain'],
  ['serendipity', 'finding something good without looking for it'],
  ['ephemeral', 'lasting a very short time'],
  ['sonder', 'the realization that every passerby has a life as vivid as your own'],
  ['luminous', 'full of or shedding light; glowing'],
  ['quixotic', 'wildly idealistic and impractical'],
  ['mellifluous', 'sweet or musical; pleasant to hear'],
  ['ubiquitous', 'present or found everywhere'],
  ['halcyon', 'denoting a period of time that was idyllically happy and peaceful'],
  ['obfuscate', 'to deliberately make something unclear'],
  ['pulchritude', 'physical beauty'],
  ['defenestration', 'the act of throwing someone out of a window'],
  ['sesquipedalian', 'given to using long words'],
  ['limerence', 'the state of being infatuated with another person'],
  ['apricity', 'the warmth of the sun in winter'],
  ['vellichor', 'the strange wistfulness of used bookstores'],
  ['susurrus', 'a whispering or rustling sound'],
  ['ineffable', 'too great to be expressed in words'],
  ['gossamer', 'something very light, thin, and delicate'],
  ['penumbra', 'the partially shaded outer region of a shadow'],
  ['zephyr', 'a soft gentle breeze'],
  ['ebullient', 'cheerful and full of energy'],
  ['taciturn', 'reserved; saying little'],
  ['perspicacious', 'having keen insight; mentally sharp'],
  ['nefarious', 'wicked or criminal'],
  ['bucolic', 'relating to pleasant aspects of the countryside'],
  ['crepuscular', 'relating to twilight; active at dusk and dawn'],
  ['numinous', 'having a strong spiritual quality'],
  ['recalcitrant', 'stubbornly uncooperative'],
  ['saudade', 'a deep nostalgic longing for something absent'],
  ['borborygmus', 'the rumbling sound of a hungry stomach'],
  ['tintinnabulation', 'the ringing or sound of bells'],
  ['lagniappe', 'a small unexpected gift or bonus'],
  ['fernweh', 'an ache for distant places; the opposite of homesickness'],
  ['komorebi', 'sunlight filtering through leaves'],
  ['hiraeth', 'a homesickness for a place you cannot return to'],
  ['ameliorate', 'to make something bad better'],
  ['antediluvian', 'ridiculously old-fashioned; literally, before the flood'],
  ['brobdingnagian', 'gigantic; enormous'],
  ['collywobbles', 'butterflies or unease in the stomach'],
];
const dayIndex = () => {
  const now = new Date(), start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400e3);
};
NOVA.registerSkill({
  name: 'word of the day',
  hint: '"word of the day" / "give me a fancy word"',
  match: t => /\bword of the day\b/i.test(t) ? { daily: 1 }
           : /\b(give me a |teach me a )?(fancy|new|big) word\b/i.test(t) ? { rand: 1 } : null,
  async run(m, ctx){
    const [w, def] = m.daily ? WORDS[dayIndex() % WORDS.length]
                             : WORDS[Math.floor(Math.random() * WORDS.length)];
    ctx.reply(`${m.daily ? "Today's word is" : 'Here is one:'} ${w} — ${def}. Try dropping that into a conversation today.`);
  }
});
})();
