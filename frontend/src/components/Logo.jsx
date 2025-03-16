import React from "react";
// import { IoLogoYoutube } from "react-icons/io";
// import { GiFilmProjector } from "react-icons/gi";
import { RiBlazeFill } from "react-icons/ri";
import { Link } from "react-router-dom";

function Logo({ size = "40" }) {
    return (
        <>
            <Link to={'/'} className="flex gap-2 items-center">
                <RiBlazeFill
                    size={size}
                    color="#A855F7"
                    // color="#A855F7"
                />
                {/* <img src="/streamifyLogo.webp" alt="" className="w-[40px] h-[40px] rounded-xl"/> */}
                <span className="md:text-lg lg:text-xl font-bold text-white">StreamBlaze</span>
            </Link>
        </>
    );
}

export default Logo;
