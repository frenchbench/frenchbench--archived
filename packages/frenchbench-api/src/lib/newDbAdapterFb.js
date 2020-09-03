import * as constants from '../constants';

// create new DbAdapter for FrenchBench
export function newDbAdapterFb({ expressApp, config, logger, dbAdapter }) {

  // selectors with explicit table names
  const assets            = () => dbAdapter.table(constants.TBL_ASSET);
  const authConsents      = () => dbAdapter.table(constants.TBL_AUTH_CONSENT);
  const authIdentities    = () => dbAdapter.table(constants.TBL_AUTH_IDENTITY);
  const entityAssets      = () => dbAdapter.table(constants.TBL_ENTITY_ASSET);
  const lookups           = () => dbAdapter.table(constants.TBL_LOOKUP);
  const secrets           = () => dbAdapter.table(constants.TBL_SECRET);
  const users             = () => dbAdapter.table(constants.TBL_USER);
  const usersAchievements = () => dbAdapter.table(constants.TBL_USER_ACHIEVEMENT);
  const usersEmails       = () => dbAdapter.table(constants.TBL_USER_EMAIL);
  const usersLanguages    = () => dbAdapter.table(constants.TBL_USER_LANGUAGE);
  const usersPosts        = () => dbAdapter.table(constants.TBL_USER_POST);
  const usersProfiles     = () => dbAdapter.table(constants.TBL_USER_PROFILE);
  const usersProjects     = () => dbAdapter.table(constants.TBL_USER_PROJECT);
  const usersSkills       = () => dbAdapter.table(constants.TBL_USER_SKILL);

  const dbAdapterFb = {
    ...dbAdapter,
    assets,
    authConsents,
    authIdentities,
    entityAssets,
    lookups,
    secrets,
    users,
    usersAchievements,
    usersEmails,
    usersLanguages,
    usersPosts,
    usersProfiles,
    usersProjects,
    usersSkills,
  };
  expressApp.set('dbAdapterFb', dbAdapterFb);
  return dbAdapterFb;
}
