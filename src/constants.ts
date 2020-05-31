export const ERRORS = {
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

export const tables = {
  secret:           { name: 'tbl_secret', pkey: ['id'] },
  user:             { name: 'tbl_user', pkey: ['id'], sensitive: ['password_hash'], },
  userAchievement:  { name: 'tbl_user_achievement', pkey: ['id'] },
  userLanguage:     { name: 'tbl_user_language', pkey: ['id'] },
  userPost:         { name: 'tbl_user_post', pkey: ['id'] },
  userProfile:      { name: 'tbl_user_profile', pkey: ['id'] },
  userProject:      { name: 'tbl_user_project', pkey: ['id'] },
  userSkill:        { name: 'tbl_user_skill', pkey: ['id'] },
  asset:            { name: 'tbl_asset', pkey: ['id'] },
  entityAsset:      { name: 'tbl_entity_asset', pkey: ['parent_entity_id', 'asset_id'] },
  sysLookup:        { name: 'tbl_sys_lookup', pkey: ['category', 'id' ]},
};
