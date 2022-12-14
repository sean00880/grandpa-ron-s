import Document, { Html, Head, Main, NextScript } from 'next/document'
import { useRouter } from "next/router";

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
        <link
          rel="canonical"
          href="https://grandparonsllc.com"
          key="canonical"
        />
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
