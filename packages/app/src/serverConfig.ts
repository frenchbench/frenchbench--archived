export interface IProcessEnv {
  NODE_ENV?: string;

  HTTP_PORT?: string;

  API_BASE_URL?: string;
}

export function newServerConfig(env: IProcessEnv) {

  const proxyConfig = {
    '/api': {
      target: env.API_BASE_URL || 'http://localhost:9090/api',
      pathRewrite: { '^/api': '/' },
      changeOrigin: true,
      onProxyReq(proxyReq, req, res) {
        // add custom header to request
        let authTokenFromCookie = '';
        if (authTokenFromCookie !== '') {
          proxyReq.setHeader('authorization', authTokenFromCookie);
        }
      }
    },
  }

  const nodeEnv = env.NODE_ENV || 'development';
  return {
    env: nodeEnv,
    isDevMode: nodeEnv !== 'production',
    port: parseInt(env.HTTP_PORT || '8080', 10) || 8080,
    api: {
      baseURL: '/api',
    },
    proxyConfig,
  }
}
