import Head from "next/head";
import Image from "next/image";
import Intro from "../components/Intro";
import Mission from "../components/Mission";
import Services from "../components/Services";
import styles from "../styles/Home.module.css";
import { data } from "../data";
import Testimonials from "../components/Testimonials";
import {AnimatePresence} from 'framer-motion';
import Faq  from "../components/Faq";
import Contact from "./contact";

export default function Home({ services }) {
  return (
      <>
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
      <Intro />
      <Mission />
      <Services services={services} />
      <Testimonials />
      <Faq />
      <Contact />
      </>
  );
}

export const getStaticProps = () => {
  const services = data;
  return {
    props: { services },
  };
};
