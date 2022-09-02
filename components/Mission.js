import style from "../styles/Mission.module.css";
import Image from "next/image";
import { users2 } from "../data";

const Mission = () => {
  return (
    <div className={style.container} id='about'>
      <h1 className={style.title}>About Us</h1>
      <div className={style.wrapper}>
        <div className={style.content}>
          <Image
                className={style.image}
                src={`${process.env.NEXT_PUBLIC_URL}/img/joshua.jpg`}
                width="700"
                height="560"
                objectFit="cover"
                alt="Joshua"
                priority={true}
              />
          <div className={style.textdiv}>

          <div >
            
          <h1 className={style.teamtext}>Team</h1><hr/>
          <h3 className={style.text}>
          <blockquote>Grandpa Ron's Landscaping Services was founded in [2021] by Joshua [and ...] with Granda Ron's vision and values in mind. This company is locally owned and operated and serves Columbus, Ohio and surrounding regions. </blockquote>
          </h3>
          </div>
          <div>
          
          <h1 className={style.teamtext}>Mission</h1><hr/>
          <h3 className={style.text}>
          <blockquote>We are experts in residential as well as commercial landscaping and and provide a variety of services inclduing: Tree removal, mulching, mowing, leaf-removal, patio/retaining walls, tree removal services, ice/snow management and more.</blockquote> <br/><blockquote>In order to provide the best possible service, we underpromise and overdeliver. We collaborate closely with our clients and work hard while prioritizing and delivering the highest standards of quality.</blockquote></h3>
          
          </div>
          </div>



        </div>
      </div>
    </div>
  );
};

export default Mission;
