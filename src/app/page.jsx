import React from 'react';
import Navbar from '@/Component/Navbar';
import Products from '@/Component/Products';
import Banner from '@/Component/Banner';


const Home = () => {
  return (
    <div>
      <Navbar />
      <Banner />
      <Products />
    </div>
  );
};

export default Home;