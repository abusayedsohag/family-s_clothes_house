"use client"
import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Banner = () => {

    const [bannerInfo, setBannerInfo] = useState([]);

    useEffect(() => {
        fetch('/api/bannerDB')
            .then(res => res.json())
            .then(data => {

                

                setBannerInfo(data.banners);
            })
    }, [])

    return (
        <div className="my-6">
            {
                bannerInfo?.length > 0 && (
                    <Carousel
                        autoPlay
                        infiniteLoop
                        interval={5000}
                        showThumbs={false}
                        showStatus={false}
                        showIndicators={true}
                        swipeable
                    >
                        {
                            bannerInfo?.map((data, Idx) => (
                                <div key={Idx} className='bg-black rounded-3xl max-w-5xl w-11/12 mx-auto flex items-center justify-center'  >
                                    <img
                                        src={data.image}
                                        alt={data.title}
                                        className='rounded-2xl'
                                        style={{ aspectRatio: "3/1" }}
                                    />
                                </div>
                            ))
                        }

                    </Carousel>
                )
            }
        </div>
    );
};

export default Banner;