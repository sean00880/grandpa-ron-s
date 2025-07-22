import React from 'react'
import style from "../styles/Popup.module.css";

function Popup(props) {
  return ( props.trigger)? (
    <div className={style.popup}>
        <div className={style.popupinner}>
            <div className={style.closebtn} onClick={() => props.setTrigger(false)}>close</div>
            {props.children}
        </div>
    </div>
  ) : "";
}

export default Popup