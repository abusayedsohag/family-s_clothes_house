import React from 'react';
import Banner from '@/Component/Banner';
import Navbar from '@/Component/Navbar';
import Products from '@/Component/Products';


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