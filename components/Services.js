import style from "../styles/Services.module.css";
import Image from "next/image";
import Link from "next/link";

const Services = ({ services }) => {
  return (
    
    <div className={style.container} exit={{opacity:0}} id={`services`}>
      <h1 className={style.title}>Services</h1> <hr/>
      <div className={style.info}>
        <div className={style.services}>
          {services.map((service) => (
            <Link key={service.id} href={`/services/${service.name}`} passHref>
              <div className={style.service}>
                <div className={style.catInfo}><Image
                      src={`${process.env.NEXT_PUBLIC_URL}/img/${service.desc}`}
                      width="80%"
                      height="80%"
                      layout="responsive"
                      objectfit="contain"
                      alt=""
                    /></div>
                <span className={style.cat}>{service.title}</span>
                <div className={style.media}>
                  {service.video ? (
                    <Image
                    src={`${process.env.NEXT_PUBLIC_URL}/img/${service.photo}`}
                    width="40%"
                    height="40%"
                    layout="responsive"
                    objectfit="cover"
                    position="center"
                    alt=""
                    priority={true}
                  />
                  ) : (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_URL}/img/${service.photo}`}
                      width="40%"
                      height="40%"
                      layout="responsive"
                      objectfit="cover"
                      position="center"
                      alt=""
                      priority={true}
                    />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
