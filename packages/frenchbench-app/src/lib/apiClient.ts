import axios from 'axios';

export function newApiClient(config = {}) {

  const _httpClient = axios.create({
    baseURL: '/api', // config.baseURL
    timeout: 15 * 1000,
  });

  const authProviders = [
    { id: 'frenchbench' },
  ];

  const _apiPaths = {
    register: '/auth/frenchbench/register',
    login: '/auth/frenchbench/login',
    me: '/auth/frenchbench/me',
    logout: '/auth/logout',
    users: '/auth/users',
  }

  async function register(data: any, options = {}) {
    return _httpClient.post(_apiPaths.register, data, options);
  }

  async function login(data: any, options = {}) {
    return _httpClient.post(_apiPaths.login, data, options);
  }

  async function me(options = {}) {
    return _httpClient.get(_apiPaths.me, options);
  }

  async function userDetails(username, options = {}) {
    return _httpClient.get(_apiPaths.users + '/' + username, options);
  }

  // generic logout
  async function logout(options = {}) {
    return _httpClient.delete(_apiPaths.logout, options);
  }

  return {
    _httpClient,
    _apiPaths,
    register,
    me,
    login,
    logout,
    userDetails,
  }

}
