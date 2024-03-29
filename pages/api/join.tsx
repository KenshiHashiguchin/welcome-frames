import type {NextApiRequest, NextApiResponse} from 'next';
import {HubRestAPIClient} from "@standard-crypto/farcaster-js-hub-rest";
import {
  UserDataType
} from '@standard-crypto/farcaster-js-hub-rest';
import {kv} from "@vercel/kv";
import {getKVKey} from "@/const";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query.channel) {
    return res.status(400).send('Missing channel');
  }
  const channel: string = Array.isArray(req.query.channel) ? req.query.channel[0] : req.query.channel;
  const client = new HubRestAPIClient({hubUrl: "https://hub.farcaster.standardcrypto.vc:2281"});

  if (req.body.untrustedData.buttonIndex == 1) {
    const fid: number = req.body.untrustedData.fid;
    const userName = await client.getSpecificUserDataByFid(fid, UserDataType.Username);
    const displayName = await client.getSpecificUserDataByFid(fid, UserDataType.Username);

    if (userName == null || displayName == null) {
      res.status(500);
      return;
    }

    const key = getKVKey(channel);
    await kv.zadd(
      key,
      {score: new Date().getTime(), member: userName.data.userDataBody.value}
    );
  } else {
    return res.status(400).send('Missing channel');
  }

  const host = process.env.HOST;
  res.status(200).send(`
        <!DOCTYPE html>
      <html>
        <head>
        <meta property="og:title" content="GM">
        <meta name="fc:frame" content="vNext">
        <meta name="fc:frame:button:1" content="GM">
        <meta property="fc:frame:image" content="${host}/api/image?channel=${channel}&time=${new Date().getTime()}" >
        <meta property="og:image" content="${host}/api/image?channel=${channel}&time=${new Date().getTime()}" >
        <meta name="fc:frame:post_url" content="${host}/api/join?channel=${channel}">
        <meta name="fc:frame:image:aspect_ratio" content="1:1">
        </head>
        <body>
        </body>
      </html>
`);
}
