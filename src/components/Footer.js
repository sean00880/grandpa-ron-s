import style from "../styles/Footer.module.css";
import Image from "next/image";
import Link from "next/link";
import {FaFacebookF} from "react-icons/fa";
import {FcGoogle} from "react-icons/fc";

const Footer = () => {
  return (
    <div className={style.container}>
      <div className={style.cardL}>
        <Image
                className={style.logo2}
                src="/img/white.png"
                width={325}
                height={150}
                style={{ objectFit: 'cover' }}
                alt="Grandpa Ron's Landscaping Logo"
              />
        <h1 className={style.linkTitle}>
          <Link href="/contact" className={style.link}>
            <>
              <span className={style.linkText}>APPLY TO WORK WITH US</span>
              <Image
                src="/img/link.png"
                width={40}
                height={40}
                alt="Link arrow"
              />
            </>
          </Link>
        </h1>
      </div>
      <div className={style.cardscontainer}>
      <div className={style.cardS}>
       
        <div className={style.cardItem}>
          fgreatful@gmail.com
          <br /> (220) 666-2520
        </div>
      </div>
      <div className={style.cardS}>
        <div className={style.cardItem}>
          Find us online:
          <br /><a href="https://www.facebook.com/"><FaFacebookF/></a><a href="https://www.facebook.com/"><FcGoogle/></a><br></br>
          
        </div>
        <div className={style.cardItem}>
          © 2022 GRANDPA RON'S LAWN AND LANDSCAPE, LLC.
          <br />

          ALL RIGHTS RESERVED
          <br></br>
          <div className={style.devwrapper}>
          <a href="https://www.sitedominion.com/"><h4 className={style.developer}>Website Developed by: Site Dominion LLC<br></br>
          <span>https://www.sitedominion.com/</span></h4></a>
          </div>
        </div>
        
      </div>
      </div>
    </div>
  );
};

export default Footer;
