import style from "../styles/Mission.module.css";
import Image from "next/image";
import { users2 } from "../data";

const Mission = () => {
  return (
    <div className={style.container} id='about'>
      <h1 className={style.title}>About Us</h1><hr/>
      <div className={style.wrapper}>
        <div className={style.content}>
          <img
                className={style.image}
                src='/img/Joshua.jpg'
                style={{ objectFit: 'cover' }}
                alt="Grandpa Ron's Landscaping | Joshua mowing"
                width='50%'
                height='auto'
                priority
              />
          <div className={style.textdiv}>

          <div >
            
          <h3 className={style.text}>
          <blockquote> Grandpa Ron's Lawns and Landscape was founded in 2021 by Joshua Reichley with Grandpa Ron's vision and values in mind. This company is locally owned and operated. We service Canal Winchester Ohio and surrounding areas. Our goal is to create a customer expierence and relationship that lasts generations. </blockquote>
          </h3>
          </div>
          <div>
          
          <h1 className={style.teamtext}>What We Offer</h1><hr/>
          <h3 className={style.text}>

          
          <blockquote>We are experts in commercial and residential landscaping. We provide services such as, mowing, mulching, paver patios, retaining walls, view enhancement pruning, structural pruning, tree removal, fall cleanup, snow and ice management, junk removal, gutter cleaning and more! In order to provide the best service we collaborate closely with our customers to prioritize and deliver the highest quality work.</blockquote></h3>
          
          </div>
          </div>



        </div>
      </div>
    </div>
  );
};

export default Mission;
