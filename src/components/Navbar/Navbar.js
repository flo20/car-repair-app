import React from "react";
import { Link } from "react-router-dom";

import styles from "./Navbar.module.scss";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.contentWrap}>
        <Link to="/">
          <img className={styles.img} src="/logo192.png" alt="logo" />
        </Link>
        <ul className={styles.menu}>
          <li className={styles.menuItem}>
            <Link to="/">Home</Link>
          </li>
          <li className={styles.menuItem}>
            <a href="https://druid.fi" target="_blank" rel="noopener noreferrer">Druid</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
