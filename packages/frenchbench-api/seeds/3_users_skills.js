const { randNum, randUserSkill, chainPromises } = require('../mockData');

const tblUser = 'tbl_user';
const tblUserSkill = 'tbl_user_skill';

exports.seed = function(knex) {

  async function insertUserSkill(skill) {
    return knex(tblUserSkill).insert(skill);
  }

  async function insertSkillsForUser(user) {
    const L = randNum(20, 5);
    const slots = [...Array(L)].map((_, i) => i);
    // generate skills
    const skills = slots.map((_, order_idx) => {
      return randUserSkill(user, { order_idx });
    });
    return chainPromises(skills, insertUserSkill);
  }

  return knex(tblUserSkill).del()
    .then(async () => {
      const users = await knex(tblUser).select();
      return chainPromises(users, insertSkillsForUser);
    });
};
