import axios from 'axios';
import { IAuthProvider, IAuthToken, IUser } from '../authTypes';

export function newLinkedIn(config: any): IAuthProvider {
  return {
    // step 1: direct user to github
    getAuthorizeUrl: (params) => {
      const {state, scope = 'r_basicprofile', response_type = 'code'} = params;
      // TODO: our app does not permission to request consent for any scopes! :(
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
      return axios.post<IAuthToken>(
        config.accessTokenUrl,
        {
          client_id: config.clientId,
          client_secret: config.clientSecret,
          redirect_uri: config.redirectUri,
          state,
          code,
        }
      );
    },

    // step 5: get user details using access token
    getUserDetails: async ({access_token, token_type = 'bearer'}) => {
      const response = await axios.get<IUser>(
        config.apiBaseUrl + '/me',
        {
          headers: {
            authorization: token_type + ' ' + access_token,
          }
        }
      )
      return response.data;
    },
  }
}