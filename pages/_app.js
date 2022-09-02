import Layout from "../components/Layout";
import "../styles/globals.css";

import { AnimatePresence, motion } from 'framer-motion';

function MyApp({ Component, pageProps, router }) {
  return (
    <AnimatePresence exitBeforeEnter
    initial={false}
    onExitComplete={() => window.scrollTo(0, 0)}>
    <motion.div key={router.route}  initial="pageInitial" animate="pageAnimate" variants={{
      pageInitial: {
        opacity: .6,
        scale:.8
      },
      pageAnimate: {
        opacity: 1,
        scale: 1
      },
    }}>
      <Layout>
      <Component {...pageProps} />
      </Layout>
    </motion.div>
    </AnimatePresence>
  )
}

export default MyApp;
