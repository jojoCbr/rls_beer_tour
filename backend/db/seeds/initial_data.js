
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('beer_logs').del();
  await knex('beers').del();
  await knex('bars').del();

  const [beer1] = await knex('beers').insert([
    { name: 'Heineken', brewery: 'Heineken N.V.', style: 'Lager' },
    { name: 'Guinness Draught', brewery: 'Guinness', style: 'Stout' },
    { name: 'Punk IPA', brewery: 'BrewDog', style: 'IPA' }
  ]).returning('*');

  const [bar1] = await knex('bars').insert([
    { name: 'The Old Tavern', location: 'Downtown' },
    { name: 'Beer Garden', location: 'Uptown' }
  ]).returning('*');

  console.log('Seed data inserted');
};
