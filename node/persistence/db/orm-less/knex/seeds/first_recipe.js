exports.seed = function(knex, Promise) {
  return knex('recipe').del()
  .then(function () {
    // Inserts seed entries
    return knex('recipe').insert([
      {
        name: 'chicken-sofrito',
        serving: 8,
        source: 'http://www.domesticdaddy.net/2015/01/19/chicken-sofrito-with-a-shortcut/'
      },
      {
        name: 'saag-feta',
        serving: 4,
        source: 'https://owiowifouettemoi.com/2019/05/08/saag-feta/'
      }
    ]);
  });
};
