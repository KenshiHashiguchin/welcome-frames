import Image from "next/image";
import {Inter} from "next/font/google";
import Head from 'next/head';
import {GetServerSideProps} from "next";

const inter = Inter({subsets: ["latin"]});
export const getServerSideProps: GetServerSideProps = async (context) => {
  const host = process.env.HOST;
  const channel = context.query.channel ?? "error";
  return {
    props: {
      host,
      channel
    },
  };
};

type Props = {
  host: string;
  channel: string;
};

const IndexPage = ({host, channel}: Props) => {
  return (
    <>
      <Head>
        <meta property="og:title" content="Welcome this"/>
        <meta name="fc:frame" content="vNext"/>
        <meta name="fc:frame:button:1" content="GM"/>
        <meta property="fc:frame:image" content={`${host}/api/image?channel=${channel}`} />
        <meta property="og:image" content={`${host}/api/image?channel=${channel}`} />
        <meta name="fc:frame:post_url" content={`${host}/api/join?channel=${channel}`}/>
      </Head>
      <main>
      </main>
    </>
  );
}
export default IndexPage;