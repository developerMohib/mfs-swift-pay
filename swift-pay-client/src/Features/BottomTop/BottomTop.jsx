import { useEffect, useState } from "react";
const BottomTop = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };
    window.addEventListener("scroll", handleScroll);
    return () =>{
        window.removeEventListener("scroll",handleScroll)
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({top : 0,behavior: "smooth"})
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-4 right-4 w-12 bg-blue-500 text-white rounded-full shadow-lg flex justify-center items-center"
      style={{
        height: `${scrollProgress}%`,
      }}
    >
      ↑
    </button>
  );
};

export default BottomTop;
