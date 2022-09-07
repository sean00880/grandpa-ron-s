import Circle from "../components/Circle";
import style from "../styles/Contact.module.css";
import emailjs from '@emailjs/browser';
import React, { useRef } from 'react';
import { useState } from 'react';
import Popup from "../components/Popup";

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
  
  const [buttonPopup, setButtonPopup] = useState(false);

  return (
    <div className={style.container} id={`contact`}>
      <h1 className={style.title}>Submit a Quote Request/Connect with Us</h1>
        <Circle backgroundColor="green" left="-40vh" top="-20vh" className={style.circle}/>
        <Circle backgroundColor="yellow" right="-30vh" bottom="-60vh" className={style.circle}/>
      <form ref={form} onSubmit={sendEmail} className={style.form}>

        <input className={style.inpuL} type="text" placeholder="Name" name="name"/>
        <input className={style.inputL} type="text" placeholder="Phone" name="contact" />
        <input className={style.inputL} type="email" placeholder="Email" name="email" />
        <input className={style.inputL} type="text" placeholder="Subject" name="subject"/>
        <textarea
          className={style.textArea}
          type="text"
          rows={6}
          placeholder="Message"
          name="message"
        />
        <button className={style.button} onClick={()=>setButtonPopup(true)}>SUBMIT</button>
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
          <h3>Your message has been sent. We will reach out to you shortly.</h3>
        </Popup>
        </form>
    </div>
  );
};

export default Contact;
