const FID_ZLIST_KEY: string = "fid_zlist";

export function getKVKey(channel: string) {
  return channel + "_" + FID_ZLIST_KEY;
}

