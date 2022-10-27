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
          <span className={style.brandName}>Professional</span> Landscaping Services in Canal Winchester, OH
          <hr />
        </h1>

        
        <p className={style.desc}>
          
          <img
                className={style.image}
                src='/img/grandpaRon.jpeg'
                width="100%"
                height="100%"
                alt="Grandpa Ron's Landscaping"
                priority={true}
              />
          Landscaping Services for all needs.
           <hr/>
          Grandpa Ron and Joshua mowing the lawn [2000].
        </p>
        <h2 className={style.subtitle}>Serving Canal Winchester & Columbus, Ohio<br></br>(220) 666 2520</h2>
        <button className={style.button}><Link href={`${process.env.NEXT_PUBLIC_URL}/#services`} passHref>Services</Link></button>
        </div>
      </div>
      <div className={style.card2}>
      <div className={style.content2}>
        <h2 className={style.title2}>
          <span className={style.brandName2}>Three</span> Simple Steps:
          <hr />
        </h2>
        
        <p className={style.desc2}>
          1) Contact us with a description of your needs and we will provide a free estimate. <br/><br/> 
          2) Schedule physical consultation. <br/> <br/> 
          3) Initiate contract.
        </p>
        <button className={style.button2}><Link href={`${process.env.NEXT_PUBLIC_URL}/#contact`} passHfref>Request a Quote</Link></button>
        </div>
      </div>
    </div>
  );
};

export default Intro;
