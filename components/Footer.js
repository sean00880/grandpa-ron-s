import style from "../styles/Footer.module.css";
import Image from "next/image";
import Link from "next/link";


const Footer = () => {
  return (
    <div className={style.container}>
      <div className={style.cardL}>
        <Image
                className={style.logo2}
                src={`${process.env.NEXT_PUBLIC_URL}/img/white.png`}
                width="325"
                height="150"
                objectFit="cover"
                alt=""
              />
        <h1 className={style.linkTitle}>
          <Link href="/contact" className={style.link} passHref>
            <>
              <span className={style.linkText}>APPLY TO WORK WITH US</span>
              <Image
                src={process.env.NEXT_PUBLIC_URL + "/img/link.png"}
                width="40px"
                height="40px"
                alt=""
              />
            </>
          </Link>
        </h1>
      </div>
      <div className={style.cardscontainer}>
      <div className={style.cardS}>
        <div className={style.cardItem}>
        322 MOHICAN ROAD,<br></br>CANAL WINCHESTER, OH <br></br>43110
          <br /> USA
        </div>
        <div className={style.cardItem}>
          fgreatful@gmail.com
          <br /> (220) 666-2520
        </div>
      </div>
      <div className={style.cardS}>
        <div className={style.cardItem}>
          FOLLOW US:
          <br /> __IN __BE __TW
        </div>
        <div className={style.cardItem}>
          © 2022 GRANDPA RON'S LAWN AND LANDSCAPE, LLC.
          <br />
          ALL RIGHTS RESERVED
        </div>
      </div>
      </div>
    </div>
  );
};

export default Footer;
