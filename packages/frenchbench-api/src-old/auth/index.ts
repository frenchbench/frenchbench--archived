import { newGithub } from './github';
import { newLinkedIn } from './linkedin';
import { newUuid } from 'frenchbench-common';
import { IAuthProvider, IAuthProviderManager } from '../lib/authTypes';
import { getAuthProviderConfig } from '../serverConfig';

export default function (db: any, config: any): IAuthProviderManager {
  const githubConfig = getAuthProviderConfig(config, 'github');
  const github = newGithub(githubConfig);

  const linkedinConfig = getAuthProviderConfig(config, 'linkedin');
  const linkedin = newLinkedIn(linkedinConfig);

  const authProviders = {
    github,
    linkedin,
  };

  function authProvider(key: string): IAuthProvider {
    if (key === 'github') return github;
    if (key === 'linkedin') return linkedin;
    throw new Error('unknown auth provider')
  }

  return {
    //authProviders,
    getAuthorizeUrl: async (providerId, params = {}) => {
      const providerConfig = getAuthProviderConfig(config, providerId);
      const provider = authProvider(providerId);
      const state = newUuid();
      const { scope } = providerConfig;
      const { response_type = 'code' } = params;
      const result = await db.authConsentRepo.create({
        id: state,
        scope,
        provider_id: providerId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      console.log('Api.getAuthUrl authConsentRepo.create', result);
      const url = provider.getAuthorizeUrl({ state, scope, response_type });
      return Promise.resolve(url);
    },

    createAccessToken: async (providerId, params) => {
      const provider = authProvider(providerId);

      const { state, code } = params;
      const options = { where: 'id = ?', params: [state] };
      const modifications = {
        updated_at: new Date().toISOString(),
        auth_code: code,
      };
      const result = await db.authConsentRepo.update(modifications, options);
      console.log('Api.createAccessToken db.authConsentRepo.update', result);

      const { access_token, token_type } = await provider.createAccessToken({ state, code });

      const modifications2 = {
        updated_at: new Date().toISOString(),
        token_type,
        access_token,
      };
      const result2 = await db.authConsentRepo.update(modifications2, options);
      console.log('Api.createAccessToken db.authConsentRepo.update', result2);

      return { access_token, token_type };
    },

    getUserDetails: async (providerId, params) => {
      const provider = authProvider(providerId);
      return provider.getUserDetails(params);
    },
  }
}