import { makeGenericFilter } from './lib/dbFilters';

// table names in the database
// protected
export const TBL_AUTH_CONSENT     = 'tbl_auth_consent';
export const TBL_AUTH_IDENTITY    = 'tbl_auth_identity';
export const TBL_SECRET           = 'tbl_secret';
export const TBL_USER             = 'tbl_user';

// public
export const TBL_ASSET            = 'tbl_asset';
export const TBL_ENTITY_ASSET     = 'tbl_entity_asset';
export const TBL_LOOKUP           = 'tbl_sys_lookup';
export const TBL_USER_ACHIEVEMENT = 'tbl_user_achievement';
export const TBL_USER_EMAIL       = 'tbl_user_email';
export const TBL_USER_LANGUAGE    = 'tbl_user_language';
export const TBL_USER_POST        = 'tbl_user_post';
export const TBL_USER_PROFILE     = 'tbl_user_profile';
export const TBL_USER_PROJECT     = 'tbl_user_project';
export const TBL_USER_SKILL       = 'tbl_user_skill';

export const fields = {
  [TBL_ASSET]:            ['id', 'asset_type', 'media_type', 'label', 'url', 'meta', 'created_at', 'updated_at', 'created_by', 'updated_by'],
  [TBL_AUTH_CONSENT]:     ['id', 'provider_id', 'scope', 'auth_code', 'grant_type', 'access_token', 'refresh_token', 'expires_at', 'created_at', 'updated_at'],
  [TBL_AUTH_IDENTITY]:    ['id', 'provider_id', 'external_username', 'meta', 'created_by', 'updated_by'],
  [TBL_ENTITY_ASSET]:     ['id', 'parent_entity_kind', 'parent_entity_id', 'asset_id', 'meta', 'created_at', 'updated_at', 'created_by', 'updated_by'],
  [TBL_LOOKUP]:           ['id', 'category', 'value', 'label', 'meta', 'created_at', 'updated_at', 'created_by', 'updated_by'],
  [TBL_SECRET]:           ['id', 'secret', 'email', 'meta', 'created_at'],
  [TBL_USER]:             ['id', 'username', 'password_hash', 'created_at', 'updated_at', 'created_by', 'updated_by'],
  [TBL_USER_ACHIEVEMENT]: ['id', 'user_id', 'achievement', 'organisation', 'date_from', 'date_to', 'info', 'order_idx', 'created_at', 'updated_at', 'created_by', 'updated_by'],
  [TBL_USER_EMAIL]:       ['id', 'user_id', 'email', 'created_at', 'updated_at', 'created_by', 'updated_by'],
  [TBL_USER_LANGUAGE]:    ['id', 'user_id', 'language', 'stars', 'order_idx', 'created_at', 'updated_at', 'created_by', 'updated_by'],
  [TBL_USER_POST]:        ['id', 'user_id', 'post_ref', 'title', 'summary', 'tags', 'content', 'created_at', 'updated_at', 'created_by', 'updated_by'],
  [TBL_USER_PROFILE]:     ['id', 'user_id', 'first_name', 'middle_name', 'last_name', 'job_title', 'organisation', 'industry', 'city', 'country', 'dob_year', 'min_salary', 'summary', 'created_at', 'updated_at', 'created_by', 'updated_by'],
  [TBL_USER_PROJECT]:     ['id', 'user_id', 'summary', 'organisation', 'date_from', 'date_to', 'info', 'skills', 'order_idx', 'created_at', 'updated_at', 'created_by', 'updated_by'],
  [TBL_USER_SKILL]:       ['id', 'user_id', 'skill', 'stars', 'order_idx', 'created_at', 'updated_at', 'created_by', 'updated_by'],
};

// applicable for public controllers
export const filters = {
  [TBL_ENTITY_ASSET]: [
    makeGenericFilter('parent_entity_id'),
    makeGenericFilter('asset_id'),
  ],
  [TBL_LOOKUP]: [
    makeGenericFilter('category'),
    makeGenericFilter('value'),
    makeGenericFilter('label'),
  ],
  [TBL_USER_ACHIEVEMENT]: [
    makeGenericFilter('user_id'),
  ],
  [TBL_USER_LANGUAGE]: [
    makeGenericFilter('user_id'),
  ],
  [TBL_USER_PROFILE]: [
    makeGenericFilter('user_id'),
  ],
  [TBL_USER_PROJECT]: [
    makeGenericFilter('user_id'),
  ],
  [TBL_USER_SKILL]: [
    makeGenericFilter('user_id'),
    makeGenericFilter('skill'),
  ],
  [TBL_USER_POST]: [
    makeGenericFilter('user_id'),
    makeGenericFilter('tags'), // TODO special filter needed
  ],
};

// standard http routes
export const RUT_ASSETS        = '/assets'; // file upload/download is needed
export const RUT_ENTITY_ASSETS = '/entity-assets';
export const RUT_LOOKUPS       = '/lookups';
export const RUT_USERS         = '/users';

// child routes
export const RUT_USERS_ACHIEVEMENTS = '/users/:userId/achievements';
export const RUT_USERS_LANGUAGES    = '/users/:userId/languages';
export const RUT_USERS_POSTS        = '/users/:userId/posts';
export const RUT_USERS_PROFILE      = '/users/:userId/profile';
export const RUT_USERS_PROJECTS     = '/users/:userId/projects';
export const RUT_USERS_SKILLS       = '/users/:userId/skills';

// special http routes
export const RUT_AUTH                       = '/auth';
export const RUT_AUTH_LOGIN                 = '/auth/login';
export const RUT_AUTH_LOGOUT                = '/auth/logout';
export const RUT_AUTH_PROVIDER_AUTHENTICATE = '/auth/:provider/authenticate';
export const RUT_AUTH_PROVIDER_ME           = '/auth/:provider/me';
export const RUT_AUTH_PROVIDER_REGISTER     = '/auth/:provider/register';
export const RUT_AUTH_PROVIDER_AUTHORIZE    = '/auth/:provider/authorize';
export const RUT_ENTITIES_KIND_ID           = '/entities/:kind/:id';
export const RUT_ENTITIES_KIND_ID_ASSETS    = '/entities/:kind/:id/assets';

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
