import style from "../styles/Intro.module.css";
import Image from "next/image";
import Aos from "aos";
import React,{ useEffect} from "react";
import Link from "next/link";

const Intro = () => {
  useEffect(() => {
    Aos.init({duration: 2000});
  }, []);


  return (
    <div className={style.container} id='home'>
      {/* <div className={`${style.circle} ${style.circle1}`} />
      <div className={`${style.circle} ${style.circle2}`} /> */}
      {/*<Circle backgroundColor="#01c686" top="-45vh" left="-45vh" />}
      {/* <Circle backgroundColor="#01c686" right="-40vh" /> */}
      <div className={style.card} data-scroll data-scroll-speed="7" data-scroll-delay="0.07">
        <div className={style.content}>
        <h1 className={style.title}>
          <span className={style.brandName}>Professional</span> Landscaping For All Needs
          <hr />
        </h1>

        
        <p className={style.desc}>
          
          <Image
                className={style.image}
                src={`${process.env.NEXT_PUBLIC_URL}/img/GrandpaRon.png`}
                width="500"
                height="500"
                priority={true}
                objectFit="cover"
                alt=""
              />
          Grandpa Ron and Joshua mowing the lawn [2004]
        </p>
        <h2 className={style.subtitle}>Serving Columbus, Ohio</h2>
        <button className={style.button}><Link href={`${process.env.NEXT_PUBLIC_URL}/#services`} passHref>DISCOVER</Link></button>
        </div>
      </div>
      <div className={style.card2}>
      <div className={style.content2}>
        <h1 className={style.title2}>
          <span className={style.brandName2}>Three</span> Simple Steps:
          <hr />
        </h1>
        
        <p className={style.desc2}>
          1) Contact us with a description of your needs and we will respond with an estimate quote. <br/><br/> 
          2) Schedule physical consultation. (Optional)<br/> <br/> 
          3) Initiate contract.
        </p>
        <button className={style.button2}><Link href={`${process.env.NEXT_PUBLIC_URL}/#contact`}>Request a Quote</Link></button>
        </div>
      </div>
    </div>
  );
};

export default Intro;
