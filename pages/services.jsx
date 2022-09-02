import Head from "next/head";
import Image from "next/image";
import Intro from "../components/Intro";
import Services from "../components/Services";
import styles from "../styles/Home.module.css";
import { data } from "../data";

export default function services({ services }) {
  return (
    <div>
      <Head>
        <title>Grandpa Ron's | Lawns and Landscape LLC</title>
        <meta
          name="description"
          content="Landscaping Services | Columbus, Ohio"
        />
      </Head>
      <Services services={services} />
    </div>
  );
}

export const getStaticProps = () => {
  const services = data;
  return {
    props: { services },
  };
};
