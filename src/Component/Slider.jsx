import React, { useEffect, useState } from 'react'
import '../Style/Slider.css'; 
import { ChevronLeft, ChevronRight } from 'lucide-react';
export default function Slider({images}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
      }, 5000);
  
      return () => clearInterval(interval);
    }, [images.length]);
  
    const goToNextImage = () => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };
  
    const goToPreviousImage = () => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };
  
    return (
      <div className="imageSlider">
        <button className="sliderButton" onClick={goToPreviousImage}>
          <ChevronLeft size={30} color="#654DC4" />
        </button>
        <img className="sliderImage" src={images[currentIndex]} alt={`Slide ${currentIndex}`} />
        <button className="sliderButton" onClick={goToNextImage}>
          <ChevronRight size={30} color="#654DC4" />
        </button>
      </div>
    );
}
