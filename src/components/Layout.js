import styles from "../styles/Layout.module.css";
import Footer from "./Footer";
import Navbar from "./NavbarAttempt";

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <>
        <Navbar />
        {children}
        <Footer/>
      </>
    </div>
  );
};

export default Layout;

