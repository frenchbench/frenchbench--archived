import { newGithub } from './github';
import { newLinkedIn } from './linkedin';
import { newUuid } from 'frenchbench-common';
import {IAuthProvider, IAuthProviderManager} from '../authTypes';

export default function (db: any, config: any) {
  const github   = newGithub(config.security.authProviders.github);
  const linkedin = newLinkedIn(config.security.authProviders.linkedin);

  const authProviders = {
    github,
    linkedin,
  };

  function authProvider(key: string): IAuthProvider {
    if (key === 'github') return github;
    if (key === 'linkedin') return linkedin;
    throw new Error('unknown auth provider')
  }

  const auth: IAuthProviderManager = {
    // authProviders,
    getAuthUrl: async (providerId: string) => {
      const providerConfig = config.security.authProviders[providerId];
      const provider = authProvider(providerId);
      const state = newUuid();
      const scope = providerConfig.scope;
      const response_type = 'code';
      const result = await db.authConsentRepo.create({
        id: state,
        scope,
        provider_id: providerId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      console.log('Api.getAuthUrl authConsentRepo.create', result);
      return provider.getAuthorizeUrl({ state, scope, response_type });
    },
    createAccessToken: async(providerId: string, { state, code }) => {
      const options = { where: 'id = ?', params: [state] };
      const modifications = {
        updated_at: new Date().toISOString(),
        auth_code: code,
      };
      const result = await db.authConsentRepo.update(modifications, options);
      console.log('Api.createAccessToken db.authConsentRepo.update', result);
      const providerConfig = config.security.authProviders[providerId];
      const provider = authProviders[providerId];
      const { access_token, token_type } = provider.createAccessToken({ state, code });

      const modifications2 = {
        updated_at: new Date().toISOString(),
        token_type,
        access_token,
      };
      const result2 = await db.authConsentRepo.update(modifications2, options);
      console.log('Api.createAccessToken db.authConsentRepo.update', result2);

      return { access_token, token_type };
    }
  }

  return auth;
}