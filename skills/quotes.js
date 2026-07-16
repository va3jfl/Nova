/* Quote of the day — curated list, rotates daily; "inspire me" for a random one. */

(() => {
const QUOTES = [
  ['The best way to predict the future is to invent it.', 'Alan Kay'],
  ['Simplicity is the ultimate sophistication.', 'Leonardo da Vinci'],
  ['Whether you think you can or you think you can’t, you’re right.', 'Henry Ford'],
  ['It always seems impossible until it’s done.', 'Nelson Mandela'],
  ['The only way to do great work is to love what you do.', 'Steve Jobs'],
  ['In the middle of difficulty lies opportunity.', 'Albert Einstein'],
  ['What we know is a drop, what we don’t know is an ocean.', 'Isaac Newton'],
  ['Do what you can, with what you have, where you are.', 'Theodore Roosevelt'],
  ['Everything should be made as simple as possible, but not simpler.', 'Albert Einstein'],
  ['The future belongs to those who believe in the beauty of their dreams.', 'Eleanor Roosevelt'],
  ['If I have seen further it is by standing on the shoulders of giants.', 'Isaac Newton'],
  ['Well done is better than well said.', 'Benjamin Franklin'],
  ['The journey of a thousand miles begins with a single step.', 'Lao Tzu'],
  ['Fall seven times, stand up eight.', 'Japanese proverb'],
  ['He who has a why to live can bear almost any how.', 'Friedrich Nietzsche'],
  ['No wind favors he who has no destined port.', 'Michel de Montaigne'],
  ['Knowing yourself is the beginning of all wisdom.', 'Aristotle'],
  ['The unexamined life is not worth living.', 'Socrates'],
  ['Imagination is more important than knowledge.', 'Albert Einstein'],
  ['A person who never made a mistake never tried anything new.', 'Albert Einstein'],
  ['Courage is not the absence of fear, but the triumph over it.', 'Nelson Mandela'],
  ['We are what we repeatedly do. Excellence, then, is not an act, but a habit.', 'Will Durant'],
  ['The obstacle is the way.', 'Marcus Aurelius'],
  ['You miss one hundred percent of the shots you don’t take.', 'Wayne Gretzky'],
  ['Stay hungry, stay foolish.', 'Stewart Brand'],
  ['Any sufficiently advanced technology is indistinguishable from magic.', 'Arthur C. Clarke'],
  ['The real problem is not whether machines think but whether men do.', 'B. F. Skinner'],
  ['Real artists ship.', 'Steve Jobs'],
  ['Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.', 'Antoine de Saint-Exupéry'],
  ['A ship in harbor is safe, but that is not what ships are built for.', 'John A. Shedd'],
];
const dayIndex = () => {
  const now = new Date(), start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400e3);
};
NOVA.registerSkill({
  name: 'quotes',
  hint: '"quote of the day" / "inspire me"',
  match: t => /\bquote of the day\b/i.test(t) ? { daily: 1 }
           : /\b(inspire me|motivate me|give me a quote|motivational quote)\b/i.test(t) ? { rand: 1 } : null,
  async run(m, ctx){
    const [q, by] = m.daily ? QUOTES[dayIndex() % QUOTES.length]
                            : QUOTES[Math.floor(Math.random() * QUOTES.length)];
    ctx.reply(`"${q}" — ${by}.`);
  }
});
})();
