import Document, { Html, Head, Main, NextScript } from 'next/document'
import { useRouter } from "next/router";

const CANONICAL_DOMAIN = 'https://yoursite.com';

const router = useRouter();
const _pathSliceLength = Math.min.apply(Math, [
    router.asPath.indexOf('?') > 0 ? router.asPath.indexOf('?') : router.asPath.length,
    router.asPath.indexOf('#') > 0 ? router.asPath.indexOf('#') : router.asPath.length
]);
const canonicalURL= CANONICAL_DOMAIN + router.asPath.substring(0, _pathSliceLength);

<Head>
  
</Head>

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
        <title>Grandpa Rons | Lawns and Landscape LLC </title>
        <link rel="canonical" href={ canonicalURL } />
        <meta
          name="description"
          content="Landscaping Services | Canal Winchester, Ohio | Experience the high quality landscaping services by the most preferred landscapers in Canal Winchester, OH. | Serving Canal Winchester & Columbus, OH and surrounding regions.| Family owned & operated | Licensed & Insured. "
        />
      </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
