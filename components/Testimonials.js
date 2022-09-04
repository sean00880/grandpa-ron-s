import style from "../styles/Testimonials.module.css";
import Image from "next/image";
import { users } from "../data";
import Link from 'next/link'

const Testimonials = () => {
  return (
    <div className={style.container} id="testimonials">
      <h1 className={style.title}>Testimonials</h1><hr/>
      <div className={style.wrapper}>
        {users.map((user) => (
          <div className={style.card} key={user.id}>
            <Image src={`${process.env.NEXT_PUBLIC_URL}/img/${user.logo}`} width="30" height="30" alt="" />
            
            <p className={style.comment}>
              &ldquo;{user.comment}&rdquo;
              <img
                className={style.stars}
                src='/img/stars.png'
                width="70%"
                height="70%"
                objectfit="cover"
                alt=""
              />
            </p>
            <div className={style.person}>
              <Image
                className={style.avatar}
                src={`${process.env.NEXT_PUBLIC_URL}/img/${user.avatar}`}
                width="45"
                height="45"
                objectFit="cover"
                alt=""
              />
              <div className={style.info}>
                <span className={style.username}>{user.name}</span>
                <span className={style.jobTitle}>{user.title}</span>
              </div>
              
            </div>
          </div>
        ))}
        
      </div>
      <button className={style.button}><Link href={`${process.env.NEXT_PUBLIC_URL}/testimonials`} passHfref>All Testimonials</Link></button>
      
    </div>
  );
};

export default Testimonials;
