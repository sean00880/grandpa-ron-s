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
            <Link key={service.id} href={`/services/${service.name}`}>
              <div className={style.service}>
                <div className={style.catInfo}>
                  <Image
                    src={`/img/${service.desc}`}
                    width={400}
                    height={300}
                    style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
                    alt={service.title || 'Service image'}
                  />
                </div>
                <span className={style.cat}>{service.title}</span>
                <div className={style.media}>
                  <Image
                    src={`/img/${service.photo}`}
                    width={300}
                    height={200}
                    style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                    alt={service.title || 'Service photo'}
                    priority
                  />
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
