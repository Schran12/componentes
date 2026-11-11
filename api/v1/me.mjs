import { runApi } from '../_lib.mjs'

export default async function handler(req, res) {
  await runApi(req, res, '/api/v1/me')
}

export const config = {
  api: { bodyParser: false },
}
