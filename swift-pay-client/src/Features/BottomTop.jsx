import { useState, useEffect } from "react";
import { MdOutlineArrowUpward } from "react-icons/md";

const BottomTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
  
    // Function to scroll to the top
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };
  
    // Track scroll position and calculate scroll progress
    const handleScroll = () => {
      const scrollTop = window.scrollY; 
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight; // Total scrollable area
      const scrolled = (scrollTop / docHeight) * 100; // Percentage scrolled
  
      setScrollProgress(scrolled);
  
      // Show the button when the user scrolls down 300px
      if (scrollTop > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
  
    useEffect(() => {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  
    return (
      <div>
        {/* Button will be visible when isVisible is true */}
        {isVisible && (
          <button
            onClick={scrollToTop}
            className="fixed md:bottom-10 bottom-3 md:right-10 right-3 z-50 md:w-16 w-10 md:h-16 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-lg border border-secondary bg-secondary"
            style={{
              background: `conic-gradient(rgb(14 165 233) ${scrollProgress}%, rgb(229 231 235) ${scrollProgress}%)`, // Progress bar as button border
            }}
          >
            <MdOutlineArrowUpward className="w-6 h-6 animate-bounce text-black " />            
          </button>
        )}
      </div>
    );
  };

export default BottomTop;