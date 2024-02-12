import type {NextApiRequest, NextApiResponse} from 'next';
import * as path from 'path';
import sharp from 'sharp';
import fetch from 'node-fetch';
import {v2 as cloudinary} from 'cloudinary';
import * as fs from "fs";

/*
 TODO
 - kvs読み取り
   - アカウントとプロフ画面読み取り
 - pagination
 - 画像結合
 */
// Cloudinaryの設定
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.method);
  console.log(req.body);
  const host = process.env.HOST;
  res.status(200).send(`
        <!DOCTYPE html>
      <html>
        <head>
        <meta property="og:title" content="Welcome this">
        <meta name="fc:frame" content="vNext">
        <meta name="fc:frame:button:1" content="Join">
        <meta name="fc:frame:button:2" content="<">
        <meta name="fc:frame:button:3" content=">">
        <meta name="fc:frame:button:4" content="<<">
        <meta property="fc:frame:image" content="${host}/api/image?name=ok" >
        <meta property="og:image" content="${host}/api/image?name=ok" >
        <meta name="fc:frame:post_url" content="${host}/api/join">
        </head>
        <body>
        </body>
      </html>
`);
}
