import React, { useState } from 'react';
import { Data } from "../data";
import styled from 'styled-components';
import { IconContext } from 'react-icons';
import { FiPlus, FiMinus } from 'react-icons/fi';
import style from "../styles/Faq.module.css";


const Accordion = () => {
  const [clicked, setClicked] = useState(false);

  const toggle = index => {
    if (clicked === index) {
      //if clicked question is already active, then close it
      return setClicked(null);
    }

    setClicked(index);
  };

  return (
    <IconContext.Provider value={{ color: '#00FFB9', size: '25px' }}>
        <div className={style.container} id="faq">
      <h1 className={style.title}>FAQ</h1>
      <div className={style.wrapper}>
          {Data.map((item, index) => {
            return (
              <>
                <div className={style.wrap} onClick={() => toggle(index)} key={index}>
                  <h1>{item.question}</h1>
                  <span>{clicked === index ? <FiMinus /> : <FiPlus />}</span>
                </div>
                {clicked === index ? (
                  <div className={style.dropdown}>
                    <p>{item.answer}</p>
                    </div>
                ) : null}
              </>
            );
          })}
      </div>
      </div>
    </IconContext.Provider>
  );
};

export default Accordion;