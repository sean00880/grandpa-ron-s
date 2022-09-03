import Circle from "../components/Circle";
import style from "../styles/Contact.module.css";
import emailjs from '@emailjs/browser';
import React, { useRef } from 'react';

const Contact = () => {
    const form = useRef();
  
    const sendEmail = (e) => {
      e.preventDefault();
  
      emailjs.sendForm('service_it2ab1j', 'template_3cs9fmt', form.current, 'jUn1z-vodKfQLijZ7')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
    };
  

  return (
    <div className={style.container} id={`contact`}>
      <h1 className={style.title}>Submit a Quote Request/Connect with Us</h1>
        <Circle backgroundColor="green" left="-40vh" top="-20vh" className={style.circle}/>
        <Circle backgroundColor="yellow" right="-30vh" bottom="-60vh" className={style.circle}/>
      <form ref={form} onSubmit={sendEmail} className={style.form}>
        <input className={style.inputS} type="text" placeholder="Name" name="name"/>
        <input className={style.inputS} type="text" placeholder="Phone" name="contact" />
        <input className={style.inputL} type="email" placeholder="Email" name="email" />
        <input className={style.inputL} type="text" placeholder="Subject" name="subject"/>
        <textarea
          className={style.textArea}
          type="text"
          rows={6}
          placeholder="Message"
          name="message"
        />
        <button className={style.button}>SUBMIT</button>
        </form>
    </div>
  );
};

export default Contact;
