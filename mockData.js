const faker = require('faker');
const lib = require('./src/common/lib');
const { tables } = require('./src/server/constants');
const { passwordHash } = require('./src/server/utils');

const skills = [
  'Application Development',
  'Architecture',
  'Artificial Intelligence',
  'Cloud Computing',

  'HTML',
  'CSS',
  'C',
  'C++',
  'C#',
  'PHP',
  'UX',
  'UX Design',
  'Python',
  'JavaScript',
  'Java',
  'Ruby',

  'Team Building',
  'Teamwork',
  'Leadership',
  'Collaboration',
  'Communication',
  'Written Communication',
  'Oral Communication',
  'Active Listening',

  'Cyber Security',
  'Information Management',
  'Cloud Systems Administration',

  'Scheduling',
  'Goal Oriented',
  'Digital Communications',
  'Manage Remote Working Teams',
  'Continually Review Processes for Improvement',
  'Multitasking',
  'Meeting Deadlines',

  'Analytical',
  'Analyze and Recommend Database Improvements',
  'Analyze Impact of Database Changes to the Business',
  'Audit Database Access and Requests',
  'APIs',
  'Application and Server Monitoring Tools',
  'Attention to Detail',
  'AutoCAD',
  'Azure',
  'Configure Database Software',
  'Configuration Management',
  'Critical Thinking',
  'Database Administration',
  'Deploying Applications in a Cloud Environment',
  'Develop and Secure Network Structures',
  'Develop and Test Methods to Synchronize Data',
  'Emerging Technologies',
  'File Systems',
  'Implement Backup and Recovery Plan',
  'Implementation',
  'Information Systems',
  'Interaction Design',
  'Interaction Flows',
  'Install, Maintain, and Merge Databases',
  'Integrated Technologies',
  'Integrating Security Protocols with Cloud Design',
  'Internet',
  'Optimization',
  'IT Soft Skills',
  'Logical Thinking',
  'Leadership',
  'Operating Systems',
  'Migrating Existing Workloads into Cloud Systems',
  'Mobile Applications',
  'Open Source Technology Integration',
  'Optimizing Website Performance',
  'Problem Solving',
  'Project Management',
  'Software Engineering',
  'Software Quality Assurance (QA)',
  'TensorFlow',
  'User-Centered Design',
  'UI / UX',
  'Web Development',
  'Web Design',

];
const skillCount = skills.length;

const stars = [1, 2, 3, 4, 5];
const starCount = stars.length;

function newEntity(kind, extras = {}){
  const { created_by = null, updated_by = null } = extras;
  const id = faker.random.uuid();
  return {
    id,
    kind,
    created_at: lib.nowStr(),
    updated_at: lib.nowStr(),
    created_by,
    updated_by,
  }
}

function randUserSkill(user, { order_idx }){
  const userSkillEntity = newEntity(tables.userSkill.name);
  userSkillEntity.created_by = user.id;
  userSkillEntity.updated_by = user.id;
  const userSkill = {
    id: userSkillEntity.id,
    user_id: user.id,
    skill: skills[lib.randIdx(skillCount)],
    stars: stars[lib.randIdx(starCount)],
    order_idx,
  }
  return {
    userSkillEntity,
    userSkill,
  }
}

async function randUser(){
  const userEntity = newEntity(tables.user.name, {});
  userEntity.created_by = userEntity.id;
  userEntity.updated_by = userEntity.id;
  const username = faker.internet.userName().toLowerCase();
  const password_hash = await passwordHash(faker.internet.password());
  const user = {
    id: userEntity.id,
    email: faker.internet.email(),
    username,
    password_hash,
  };
  //const userSkills = [...Array(lib.randIdx(20, 5))].map((_, order_idx) => {
  //  return randUserSkill(user, { order_idx });
  //});

  return {
    userEntity,
    user,
    //userSkills,
  };
}

module.exports = {
  skills,
  stars,
  newEntity,
  randUserSkill,
  randUser,
};
