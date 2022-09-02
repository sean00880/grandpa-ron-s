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
                objectFit="cover"
                alt=""
              /></Link>
      
      
      <ul className={style.list}>
        <li className={style.listItem}>
          <Link href={`${process.env.NEXT_PUBLIC_URL}/#about`} passHref>ABOUT</Link>
        </li>
        <DropdownMenu.Root className={style.services}>
        <DropdownMenu.Trigger className={style.listItem}>
          <Link href="/products/development">SERVICES </Link>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className={style.content}>
          <DropdownMenu.Item className={style.text}><Link href="/allservices">All Services</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/products/mulching">Mulching</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/products/mowing">Mowing</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/products/patio">Patios/Retaining Walls</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/products/pruning">Pruning</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/products/tree-removal">Tree Removal</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/products/leaf-and-junk-removal">Leaf/Junk Removal</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/products/demo">Demo/Installations</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/products/ice-and-snow-management">Ice/Snow Management</Link></DropdownMenu.Item><hr/>
        </DropdownMenu.Content>
        </DropdownMenu.Root>

        <li className={style.listItem}>
        
          <Link href={`${process.env.NEXT_PUBLIC_URL}/#testimonials`}>TESTIMONIALS</Link>
        </li>
        <li className={style.listItem}>
          <Link href={`${process.env.NEXT_PUBLIC_URL}/#faq`}>FAQ</Link>
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
          <Link href="/products/design">ABOUT</Link>
        </li>
        <DropdownMenu.Root className={style.services}>
        <DropdownMenu.Trigger className={style.menuItem}>
          <Link href="/products/development"> :) SERVICES</Link>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content className={style.content}>
        <DropdownMenu.Item className={style.text}><Link href="/allservices">All Services</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/products/mulching">Mulching</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/products/mowing">Mowing</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/products/patio">Patios/Retaining Walls</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/products/pruning">Pruning</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/products/tree-removal">Tree Removal</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/products/leaf-and-junk-removal">Leaf/Junk Removal</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/products/demo">Demo/Installations</Link></DropdownMenu.Item><hr/>
          <DropdownMenu.Item className={style.text}><Link href="/products/ice-and-snow-management">Ice/Snow Management</Link></DropdownMenu.Item><hr/>
        </DropdownMenu.Content>
        </DropdownMenu.Root>

        <li className={style.menuItem}>
          <Link href="/products/production">TESTIMONIALS</Link>
        </li>
        <li className={style.menuItem}>
          <Link href="/products/photography">FAQ</Link>
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
