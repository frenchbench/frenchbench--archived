const { randNum, randUserPost, chainPromises } = require('../mockData');

const tblUser = 'tbl_user';
const tblUserPost = 'tbl_user_post';

exports.seed = function(knex) {

  async function insertUserPost(post) {
    return knex(tblUserPost).insert(post);
  }

  async function insertPostsForUser(user) {
    const L = randNum(5, 1);
    const slots = [...Array(L)].map((_, i) => i);
    // generate skills
    const skills = slots.map((_, order_idx) => {
      return randUserPost(user, { order_idx });
    });
    return chainPromises(skills, insertUserPost);
  }

  return knex(tblUserPost).del()
    .then(async () => {
      const users = await knex(tblUser).select();
      return chainPromises(users, insertPostsForUser);
    });
};
