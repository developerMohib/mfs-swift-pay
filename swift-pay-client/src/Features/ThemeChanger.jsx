import { useEffect, useState } from "react";
import { IoMdSunny, IoMdMoon } from "react-icons/io";

const ThemeChanger = () => {
    const [dark,setDark] = useState(false);
    const [isRotating, setIsRotating] = useState(false);
    
    // animation 
    const themeAnimation = () =>{
        setIsRotating(true)

        setTimeout(()=>setIsRotating(false),1000)
    }

    // theme changer 
    const handleThemeChanger = () =>{
        setDark(!dark)
        if(dark){            
            document.documentElement.setAttribute("data-theme", "light")
            localStorage.setItem("theme", "light")
        }else{            
            document.documentElement.setAttribute("data-theme", "dark")
            localStorage.setItem("theme", "dark")            
        }
        themeAnimation()      
    }

     // save theme data in local storage 
     useEffect(()=>{
        const savedTheme = localStorage.getItem("theme");
        if(savedTheme === "dark"){
            setDark(true)
            document.documentElement.setAttribute("data-theme", "dark")
        }else{
            
            document.documentElement.setAttribute("data-theme", "light")
        }
    },[])

    return (
        <button onClick={handleThemeChanger} className={`${isRotating ? "animate-spin" : " " } `} >
            {dark ? <IoMdMoon className="text-2xl text-white" /> : <IoMdSunny className="text-2xl" /> }
        </button>
    );
};

export default ThemeChanger;