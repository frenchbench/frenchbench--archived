const { randNum, randUserEmail, chainPromises } = require('../mockData');

const tblUser = 'tbl_user';
const tblUserEmail = 'tbl_user_email';

exports.seed = function(knex) {

  async function insertUserEmail(post) {
    return knex(tblUserEmail).insert(post);
  }

  async function insertEmailsForUser(user) {
    const L = randNum(2, 1);
    const slots = [...Array(L)].map((_, i) => i);
    // generate emails
    const skills = slots.map((_, order_idx) => {
      return randUserEmail(user, { order_idx });
    });
    return chainPromises(skills, insertUserEmail);
  }

  return knex(tblUserEmail).del()
    .then(async () => {
      const users = await knex(tblUser).select();
      return chainPromises(users, insertEmailsForUser);
    });
};
