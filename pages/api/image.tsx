import type {NextApiRequest, NextApiResponse} from 'next';
import sharp from 'sharp';
import {join} from 'path';
import * as fs from "fs";
import {kv} from "@vercel/kv";
import {getKVKey} from "@/const";
import satori from "satori";

const fontPath = join(process.cwd(), 'Roboto-Regular.ttf')
let fontData = fs.readFileSync(fontPath)

const visitorSize = 7;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query.channel) {
    return res.status(400).send('Missing channel');
  }

  const channel: string = Array.isArray(req.query.channel) ? req.query.channel[0] : req.query.channel;

  const key = getKVKey(channel);
  const visitorIds: string[] = await kv.zrange(key, 0, visitorSize - 1, {rev: true, withScores: true});
  const visitors: { name: string, time: number }[] = [];
  for (let i = 0; i < visitorIds.length; i += 2) {
    visitors.push({name: visitorIds[i], time: parseInt(visitorIds[i + 1])});
  }

  const svg = await satori(
    <div style={{
      justifyContent: 'flex-start',
      flexDirection: 'column',
      display: 'flex',
      width: '100%',
      height: '100%',
      backgroundColor: '#424242',
      top: 50,
      lineHeight: '0.001em',
      fontSize: 18,
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        left: 20,
        top: 20,
      }}>
        <p style={{color: "white"}}>Last Login: {channel}</p>
        {
          visitors.map((visitor, index) => {
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  lineHeight: '0.001em'
                }}>
                  <p style={{color: "white"}}>~/frames % gm $guest</p>
                  <p style={{color: "darkgray"}}>{getFormattedDate(visitor.time)}</p> {/* 現在時刻を表示 */}
                </div>
                <p style={{color: 'mediumseagreen'}}>
                  @{visitor.name}
                </p>
              </div>
            )
          })
        }
      </div>
    </div>
    ,
    {
      width: 500, height: 500, fonts: [{
        data: fontData,
        name: 'Roboto',
        style: 'normal',
        weight: 400
      }]
    }
  );

  const pngBuffer = await sharp(Buffer.from(svg))
    .toFormat('png')
    .toBuffer();

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'max-age=0');
  res.send(pngBuffer);
}

function getFormattedDate(time: number): string {
  let date = new Date(time);
  return `${date.getUTCFullYear()}/${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${(date.getUTCDate()).toString().padStart(2, '0')} ${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')} UTC`;
}
