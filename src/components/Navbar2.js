import React, { useState } from 'react';
import Link from 'next/link';
import "../styles/Navbar.module.css";
import Dropdown from './Dropdown';

function Navbar() {
  const [click, setClick] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const onMouseEnter = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(true);
    }
  };

  const onMouseLeave = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(false);
    }
  };

  return (
    <>
      <nav className='navbar'>

        <div className='menu-icon' onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className='nav-item'>
            <Link href='/about' className='nav-links' onClick={closeMobileMenu}>
            About
            </Link>
          </li>
          <li
            className='nav-item'
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <Link
              href='/services'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              DESIGN <i className='fas fa-caret-down' />
            </Link>
            {dropdown && <Dropdown />}
          </li>
          <li className='nav-item'>
            <Link
              href='/products'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              DEVELOPMENT
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              href='/contact-us'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              PRODUCTION
            </Link>
          </li>
          <li>
            <Link
              href='/sign-up'
              className='nav-links-mobile'
              onClick={closeMobileMenu}
            >
              PHOTOGRAPHY
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;