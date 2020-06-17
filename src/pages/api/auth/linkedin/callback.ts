import { NextApiRequest, NextApiResponse } from 'next';
import { newApi } from '../../../../server/api';

const api = newApi(process.env);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { state, code = null, error = null, error_description = null } = req.query;
  if (code && state) {
    const { access_token } = await api.auth.createAccessToken('linkedin', { state, code });
    res.status(200).json({ access_token });
  } else {
    res.status(200).json({ error: { code: error, message: error_description } });
  }
}
