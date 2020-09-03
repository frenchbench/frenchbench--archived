// for public controllers
import { makeGenericFilter } from './index';
import {
  TBL_ENTITY_ASSET,
  TBL_LOOKUP,
  TBL_USER_ACHIEVEMENT,
  TBL_USER_LANGUAGE,
  TBL_USER_POST,
  TBL_USER_PROFILE,
  TBL_USER_PROJECT,
  TBL_USER_SKILL
} from '../constants';

export const tablesFilters = {
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
  [TBL_USER_PROFILE]:     [
    makeGenericFilter('user_id'),
  ],
  [TBL_USER_PROJECT]:     [
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