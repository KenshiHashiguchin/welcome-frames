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
  const fileName=req.query.name;
  const filePath = path.resolve('.', `public/${fileName}`);
  // ファイルの内容を同期的に読み込む
  const imageBuffer = fs.readFileSync(filePath);

  // Content-Typeを設定してファイルを送信
  res.setHeader('Content-Type', 'image/png');
  res.send(imageBuffer);
}
