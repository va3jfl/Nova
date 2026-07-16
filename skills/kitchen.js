/* Kitchen helper — ingredient substitutions and safe cooking temperatures.
   All local data, no network. */

(() => {
const SUBS = {
  buttermilk: 'one cup of milk plus a tablespoon of lemon juice or vinegar — let it sit five minutes',
  egg: 'a quarter cup of applesauce, a mashed half banana, or a tablespoon of ground flax with three tablespoons of water',
  'baking powder': 'a quarter teaspoon of baking soda plus half a teaspoon of cream of tartar per teaspoon needed',
  'baking soda': 'triple the amount of baking powder — and cut back any salt',
  'brown sugar': 'one cup of white sugar plus a tablespoon of molasses',
  'sour cream': 'plain Greek yogurt, one for one',
  'heavy cream': 'three quarters cup of milk plus a quarter cup of melted butter — works for cooking, not whipping',
  'white wine': 'chicken broth with a splash of vinegar or lemon juice',
  'red wine': 'beef broth with a splash of balsamic vinegar',
  breadcrumbs: 'crushed crackers, oats, or crushed cornflakes',
  butter: 'equal parts coconut oil, or three quarters the amount of vegetable oil',
  'cake flour': 'one cup of all purpose flour minus two tablespoons, plus two tablespoons of cornstarch',
  cornstarch: 'twice the amount of all purpose flour, or equal amount of arrowroot',
  honey: 'equal parts maple syrup or agave nectar',
  'tomato sauce': 'tomato paste thinned with equal parts water',
  shallot: 'a mix of onion and a little garlic',
  'fresh herbs': 'one third the amount of dried herbs',
  mayonnaise: 'plain Greek yogurt or sour cream',
  'vanilla extract': 'equal amount of maple syrup or almond extract at half strength',
};
const TEMPS = {
  chicken: '165 degrees Fahrenheit, 74 Celsius', turkey: '165 degrees Fahrenheit, 74 Celsius',
  poultry: '165 degrees Fahrenheit, 74 Celsius', 'ground beef': '160 degrees Fahrenheit, 71 Celsius',
  'ground meat': '160 degrees Fahrenheit, 71 Celsius', burger: '160 degrees Fahrenheit, 71 Celsius',
  beef: '135 Fahrenheit for medium rare, 145 for medium — rest it three minutes',
  steak: '130 to 135 Fahrenheit for medium rare, 140 to 145 for medium — rest it three minutes',
  pork: '145 degrees Fahrenheit, 63 Celsius, with a three minute rest',
  fish: '145 degrees Fahrenheit, 63 Celsius — or until it flakes',
  salmon: '125 to 130 Fahrenheit for medium — 145 to be fully safe',
  lamb: '145 degrees Fahrenheit for medium rare, with a rest',
  eggs: 'cook until whites and yolks are firm — 160 Fahrenheit for dishes with egg',
};
NOVA.registerSkill({
  name: 'kitchen helper',
  hint: '"substitute for buttermilk" / "what temperature is chicken done"',
  match: t => {
    let m;
    if ((m = t.match(/(?:substitute|substitution|replacement) for ([a-z ]+?)[?.]?$/i)) ||
        (m = t.match(/what can i use instead of ([a-z ]+?)[?.]?$/i)))
      return { sub: m[1].trim().toLowerCase() };
    if ((m = t.match(/what temp(?:erature)? (?:is|should) ([a-z ]+?) (?:done|be|cooked(?: to)?)[?.]?$/i)) ||
        (m = t.match(/(?:safe|internal) temp(?:erature)? for ([a-z ]+?)[?.]?$/i)))
      return { temp: m[1].trim().toLowerCase() };
    return null;
  },
  async run(m, ctx){
    if (m.sub){
      const key = SUBS[m.sub] ? m.sub : Object.keys(SUBS).find(k => m.sub.includes(k) || k.includes(m.sub));
      return key ? ctx.reply(`Instead of ${key}, use ${SUBS[key]}.`)
                 : ctx.reply(`I don't have a substitution for ${m.sub} — want me to think of one? Just ask normally and my brain will take a shot.`);
    }
    const key = TEMPS[m.temp] ? m.temp : Object.keys(TEMPS).find(k => m.temp.includes(k) || k.includes(m.temp));
    return key ? ctx.reply(`${key.replace(/\b\w/g, c => c.toUpperCase())} is done at ${TEMPS[key]}.`)
               : ctx.reply(`I don't have a temperature for ${m.temp}. I know: chicken, turkey, beef, steak, pork, fish, salmon, lamb, and eggs.`);
  }
});
})();
