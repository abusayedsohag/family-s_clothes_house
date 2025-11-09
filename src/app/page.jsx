import React from 'react';
import Image from 'next/image';


const Home = () => {
  return (
    <div>
      <h1>Hello, <br /> This is Family's Group Industris</h1>
      <Image
        src="/logo.png"
        alt="Company Logo"
        width={200}
        height={200}
      />
    </div>
  );
};

export default Home;