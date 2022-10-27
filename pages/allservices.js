import Head from "next/head";
import Services from "../components/Services";
import { data } from "../data";
import {motion} from "framer-motion";

export default function Home({ services }) {
  return (
    <motion.div exit={{opacity:0}}>
      <Head>
        <title>Grandpa Ron's | Lawns and Landscape LLC</title>
        <meta
          name="description"
          content="Landscaping Services | Canal Winchester, Ohio | Experience the best landscaping services all-year-round by the most preferred landscapers in Canal Winchester, OH. | Serving Canal Winchester & Columbus, OH and surrounding regions.| Family owned & operated | Licensed & Insured."
        />
      </Head>
      <Services services={services} />
    </motion.div>
  );
}

export const getStaticProps = () => {
  const services = data;
  return {
    props: { services },
  };
};
