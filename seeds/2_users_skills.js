const lib = require('../src/common/lib');
const { tables } = require('../src/server/constants');
const { randUserSkill } = require('../mockData');

exports.seed = function(knex) {

  async function insertUserSkill({ userSkillEntity, userSkill }) {
    await knex(tables.entity.name).insert(userSkillEntity);
    return knex(tables.userSkill.name).insert(userSkill);
  }

  return knex(tables.entity.name).del()
    .then(async () => {
      const users = await knex(tables.user.name).select();
      return lib.forEachPromise(users, async (user) => {
        const L = lib.randIdx(10, 5);
        const slots = [...Array(L)].map((_, i) => i);
        const skills = slots.map((_, order_idx) => {
          return randUserSkill(user, { order_idx });
        });
        return lib.forEachPromise(skills, insertUserSkill);
      });
    });
};