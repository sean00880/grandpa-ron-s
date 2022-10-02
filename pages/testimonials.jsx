import Head from "next/head";
import style from "../styles/Testimonials.module.css";
import Image from "next/image";
import { allusers } from "../data";

const Testimonials = () => {
  return (
    <div className={style.container}>
          <Head>
        <title>Grandpa Ron's | Lawns and Landscape LLC</title>
        <meta
          name="description"
          content="Landscaping Services | Canal Winchester, Ohio"
        />
      </Head>
      <h1 className={style.title}>Testimonials</h1><hr/>
        <h3 className={style.subtitle}>Best Landscaping Services in Canal Winchester, OH</h3>
      <div className={style.wrapper}>
        {allusers.map((user) => (
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
    </div>
  );
};

export default Testimonials;
