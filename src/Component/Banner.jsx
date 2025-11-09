"use client"
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Banner = () => {

    const bannerInfo = [
        {
            title: "Banner 11111"
        },
        {
            title: "Banner 22222"
        },
        {
            title: "Banner 33333"
        },
        {
            title: "Banner 44444"
        },
        {
            title: "Banner 55555"
        }
    ];


    return (
        <div className="my-6">
            <Carousel
                autoPlay
                infiniteLoop
                interval={4000}
                showThumbs={false}
                showStatus={false}
                showIndicators={true}
                swipeable
                dynamicHeight={false}
            >
                {
                    bannerInfo?.map((data, Idx) => (
                        <div key={Idx} className='bg-black rounded-2xl w-11/12 mx-auto h-48 md:h-64 lg:h-80 flex items-center justify-center' >
                            <h1 className='text-2xl text-white'>{data.title}</h1>
                        </div>
                    ))
                }

            </Carousel>
        </div>
    );
};

export default Banner;