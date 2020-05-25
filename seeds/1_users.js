const lib = require('../src/common/lib');
const { tables } = require('../src/server/constants');
const { randUser } = require('../mockData');

exports.seed = function(knex) {

  async function insertUser({ userEntity, user }) {
    await knex(tables.entity.name).insert(userEntity);
    return knex(tables.user.name).insert(user);
  }

  return knex(tables.entity.name).del()
    .then(async () => {
      const L = lib.randIdx(100, 50);
      const slots = [...Array(L)].map((_, i) => i);
      return lib.forEachPromise(slots, async () => {
        const user = await randUser();
        return insertUser(user);
      });
    });
};
