import React from "react";
import Slider from "react-slick";
import "./HeroSlider.css";

const HeroSlider = () => {
  const images = [
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    "https://images.unsplash.com/photo-1503602642458-232111445657",
  ];

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="hero-slider">
      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index}>
            <img src={src} alt="banner" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSlider;
