const ERRORS = {
  PASSWORDS_NOT_SAME: 'passwords are not same',
  EMAIL_VERIFICATION: 'email verification failed',
  REGISTRATION_FAILED: 'registration failed',
  INVALID_CREDENTIALS: 'invalid credentials',
  RECORD_NOT_FOUND: 'record not found',
  RECORD_NOT_CREATED: 'failed to create record',
  RECORD_NOT_UPDATED: 'failed to update record',
  RECORD_NOT_DELETED: 'failed to delete record',
  DB_TRANS_START_ERR: 'failed to start db transaction',
  DB_TRANS_COMMIT_ERR: 'failed to commit db transaction',
  DB_TRANS_ROLLBACK_ERR: 'failed to rollback db transaction',
};

const tables = {
  entity: { name: 'entity', pkey: ['id'] },
  asset: { name: 'asset', pkey: ['id'] },
  entityAsset: { name: 'entity_asset', pkey: ['parent_entity_id', 'asset_id'] },
  secret: { name: 'secret', pkey: ['id'] },
  user: { name: 'user', pkey: ['id'], sensitive: ['password_hash'], },
  userAchievement: { name: 'user_achievement', pkey: ['id'] },
  userLanguage: { name: 'user_language', pkey: ['id'] },
  userPost: { name: 'user_post', pkey: ['id'] },
  userProfile: { name: 'user_profile', pkey: ['id'] },
  userProject: { name: 'user_project', pkey: ['id'] },
  userSkill: { name: 'user_skill', pkey: ['id'] },
  sysLookup: { name: 'sys_lookup', pkey: ['category', 'id' ]},
};

module.exports = {
  ERRORS,
  tables,
};
