export type IUser = Record<string, any>;

export interface IGetAuthorizeUrlInput {
  state: string;
  scope: string; // 'user'
  response_type: string; // 'code'
}

export interface ICreateAccessTokenInput {
  state: string;
  code: string;
}

export interface IAuthToken {
  access_token: string;
  token_type: string; // 'bearer'
}

export interface IAuthProvider {
  getAuthorizeUrl: (params: IGetAuthorizeUrlInput) => string;
  createAccessToken: (params: ICreateAccessTokenInput) => Promise<IAuthToken>;
  getUserDetails: (params: IAuthToken) => Promise<IUser>;
}

export interface IAuthProviderManager {
  getAuthorizeUrl: (providerId: string, params: IGetAuthorizeUrlInput) => string;
  createAccessToken: (providerId: string, params: ICreateAccessTokenInput) => Promise<IAuthToken>;
  getUserDetails: (providerId: string, params: IAuthToken) => Promise<IUser>;
}
