import React from "react";
import Slider from "react-slick";
import "./ProductCarousel.css";

const ProductCarousel = () => {
  const products = [
    { id: 1, img: "https://picsum.photos/200/200?1", title: "Camera" },
    { id: 2, img: "https://picsum.photos/200/200?2", title: "Headphones" },
    { id: 3, img: "https://picsum.photos/200/200?3", title: "Watch" },
    { id: 4, img: "https://picsum.photos/200/200?4", title: "Laptop" },
    { id: 5, img: "https://picsum.photos/200/200?5", title: "Shoes" },
    { id: 6, img: "https://picsum.photos/200/200?6", title: "Perfume" },
  ];

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 900, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div className="product-carousel">
      <h2>Featured Products</h2>
      <Slider {...settings}>
        {products.map((item) => (
          <div key={item.id} className="product-card">
            <img src={item.img} alt={item.title} />
            <p>{item.title}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
