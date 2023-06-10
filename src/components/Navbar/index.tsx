import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';
const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role')
    window.location.reload();
  };
  const [navActive , setNavActive] = useState('')
  useEffect(()=>{
    const url = window.location.href;
    const urlArray = Array.from(url);
    const removedPart = urlArray.splice(url.lastIndexOf("/")).join("");
    setNavActive(removedPart)
  },[])
  return (
    <nav className={styles.navbar}>
      <h1>Car Directory</h1>
      <h4 style={{color:'white'}}>Role: {localStorage.getItem('role') === 'admin' ? "Admin" : 'Customer'} </h4>
      <div className={styles.nav_items}>
        <p className={navActive === '/categories' ? styles.list_inverse : styles.list} onClick={()=> navigate('/categories')}>Categories</p>
        <p className={navActive === '/' ? styles.list_inverse : styles.list} onClick={()=> navigate('/')}>Home</p>
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
