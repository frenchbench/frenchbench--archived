import axios from 'axios';
import { IAuthProvider, IAuthToken, IUser } from '../lib/authTypes';

export function newGithub(config: any): IAuthProvider {
  return {
    // step 1: direct user to github
    getAuthorizeUrl: (params) => {
      const { state, scope = 'user', response_type = 'code' } = params;
      return config.authUrl
        + '?client_id=' + config.clientId
        + '&state=' + state
        + '&response_type=' + response_type
        + '&scope=' + encodeURIComponent(scope)
        + '&redirect_uri=' + encodeURIComponent(config.redirectUri);
    },

    // step 2: authentication on github

    // step 3: authorization on github

    // step 4: exchange authorization code with access token
    createAccessToken: async (params) => {
      const { state, code } = params;
      const response = await axios.post<IAuthToken>(
        config.accessTokenUrl,
        {
          client_id: config.clientId,
          client_secret: config.clientSecret,
          redirect_uri: config.redirectUri,
          state,
          code,
        },
        {
          headers: {
            accept: 'application/json',
          }
        }
      );
      return response.data;
    },

    // step 5: get user details using access token
    getUserDetails: async (params) => {
      const { token_type = 'bearer', access_token } = params;
      const response = await axios.get<IUser>(
        config.apiBaseUrl + '/user',
        {
          headers: {
            authorization: token_type + ' ' + access_token,
          }
        }
      )
      return response.data;
    }
  };
}