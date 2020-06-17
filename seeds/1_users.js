const { randUser, chainPromises } = require('../mockData');

const tblUser = 'tbl_user';

exports.seed = function(knex) {
  return knex(tblUser).del()
    .then(async () => {
      const slots = [...Array(100)].map((_, i) => i);
      return chainPromises(slots, async () => {
        const user = await randUser();
        return knex(tblUser).insert(user);
      });
    });
};
