"use client";

import { useState } from "react";
import style from "../styles/Navbar.module.css";
import Link from "next/link";
import Hamburger from 'hamburger-react';
import { motion } from "framer-motion";
import Image from 'next/image'

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <div className={style.container}>
      
      <div className={style.wrapper}>
      <Link href="/"><Image
                className={style.logo3}
                src="/img/logo.jpg"
                width={260}
                height={120}
                style={{ objectFit: 'cover' }}
                alt="Grandpa Ron's Landscaping Logo"
              /></Link>
      
      <ul className={style.list}>
        <li className={style.listItem}>
          <Link href="/#about">ABOUT</Link>
        </li>
        <li
          className={`${style.listItem} ${style.services}`}
          onMouseEnter={() => setServicesOpen(true)}
          onMouseLeave={() => setServicesOpen(false)}
        >
          <Link href="/services/">SERVICES</Link>
          <div className={`${style.content} ${servicesOpen ? style.contentOpen : ''}`}>
            <Link href="/allservices" className={style.text}>All Services</Link>
            <hr/>
            <Link href="/services/mulching" className={style.text}>Mulching</Link>
            <hr/>
            <Link href="/services/mowing" className={style.text}>Mowing</Link>
            <hr/>
            <Link href="/services/patio" className={style.text}>Patios/Retaining Walls</Link>
            <hr/>
            <Link href="/services/tree-removal-and-pruning" className={style.text}>Tree Removal/Pruning</Link>
            <hr/>
            <Link href="/services/leaf-and-junk-removal" className={style.text}>Leaf/Junk Removal</Link>
            <hr/>
            <Link href="/services/demo" className={style.text}>Demo/Installations</Link>
            <hr/>
            <Link href="/services/ice-and-snow-management" className={style.text}>Ice/Snow Management</Link>
            <hr/>
            <Link href="/services/emergency-storm-damage" className={style.text}>Emergency Storm Damage</Link>
          </div>
        </li>

        <li className={style.listItem}>
          <Link href="/#testimonials">TESTIMONIALS</Link>
        </li>
        <li className={style.listItem}>
          <Link href="/#faq">FAQ</Link>
        </li>
        <li className={style.listItem}>
          <Link href="/contact">CONTACT</Link>
        </li>
      </ul>
      <div className={style.hamburger} onClick={() => setOpen(!open)}>
        <Hamburger direction="left" size={10} className={style.hamburger}/>
        </div>
      
      <ul onClick={()=>setOpen(false)} className={style.menu} style={{ right: open ? "0px" : "-50vw", display: open? "flex" : "none" }}>
      <li className={style.menuItem}>
      <Link href="/#about">ABOUT</Link>
        </li>
        <Link href="/#services">SERVICES</Link>
        <li className={style.menuItem}>
          <Link href="/#testimonials">TESTIMONIALS</Link>
        </li>
        <li className={style.menuItem} >
          <Link href="/#faq">FAQ</Link>
        </li>
        <li className={style.menuItem}>
          <Link href="/contact">CONTACT</Link>
        </li>
      </ul>
      </div>
    </div>
  );
};

export default Navbar;
