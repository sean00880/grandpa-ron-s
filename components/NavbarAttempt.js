import { useState } from "react";
import style from "../styles/Navbar.module.css";
import Link from "next/link";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import Hamburger from 'hamburger-react';
import { motion } from "framer-motion";
import Image from 'next/image'

const Navbar = () => {
  const [open, setOpen] = useState(false);



  return (
    <div className={style.container}>
      
      <div className={style.wrapper}>
      <Link href={`${process.env.NEXT_PUBLIC_URL}/`}><Image
                className={style.logo3}
                src={`${process.env.NEXT_PUBLIC_URL}/img/logo.jpg`}
                width="260"
                height="120"
                objectfit="cover"
                alt=""
              /></Link>

              <h5>Licensed & Insured</h5>
      <img
                className={style.logo4}
                src='/img/stars.png'
                width="14%"
                height="14%"
                objectfit="cover"
                alt=""
              />
      
      <ul className={style.list}>
        <li className={style.listItem}>
          <Link href={`${process.env.NEXT_PUBLIC_URL}/#about`} passHref>ABOUT</Link>
        </li>
        <DropdownMenu.Root className={style.services}>
        <DropdownMenu.Trigger className={style.listItem}>
          <Link href="/services/">SERVICES </Link>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className={style.content}>
          <DropdownMenu.Item className={style.text}><Link href="/allservices" passHref>All Services</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/services/mulching" passHref>Mulching</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/services/mowing" passHref>Mowing</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/services/patio" passHref>Patios/Retaining Walls</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/services/pruning" passHref>Pruning</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/services/tree-removal" passHref>Tree Removal</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/services/leaf-and-junk-removal" passHref>Leaf/Junk Removal</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/services/demo">Demo/Installations</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/services/ice-and-snow-management" passHref>Ice/Snow Management</Link></DropdownMenu.Item><hr/>
        </DropdownMenu.Content>
        </DropdownMenu.Root>

        <li className={style.listItem}>
        
          <Link href={`${process.env.NEXT_PUBLIC_URL}/#testimonials`} passHref>TESTIMONIALS</Link>
        </li>
        <li className={style.listItem}>
          <Link href={`${process.env.NEXT_PUBLIC_URL}/#faq`} passHref>FAQ</Link>
        </li>
        <li className={style.listItem}>
          <Link href="/contact" passHref>CONTACT</Link>
        </li>
      </ul>
      <div className={style.hamburger} onClick={() => setOpen(!open)}>
        <Hamburger direction="left" size={10} className={style.hamburger}/>
        </div>
      
      <ul onClick={()=>setOpen(false)} className={style.menu} style={{ right: open ? "0px" : "-50vw", display: open? "flex" : "none" }}>
      <li className={style.menuItem}>
      <Link href={`${process.env.NEXT_PUBLIC_URL}/#about`} passHref>ABOUT</Link>
        </li>
        <Link href={`${process.env.NEXT_PUBLIC_URL}/#services`} passHref>SERVICES</Link>
        <li className={style.menuItem}>
          <Link href={`${process.env.NEXT_PUBLIC_URL}/#testimonials`} passHref>TESTIMONIALS</Link>
        </li>
        <li className={style.menuItem} >
          <Link href="/services/photography" passHref>FAQ</Link>
        </li>
        <li className={style.menuItem}>
          <Link href="/contact" passHref>CONTACT</Link>
        </li>
      </ul>
      </div>
    </div>
  );
};

export default Navbar;
