import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AnimationCard = ({ data }) => {
    const [visibleCount, setVisibleCount] = useState(10);

    const showMore = () => {
        setVisibleCount((prev) => prev + 10);
    };

    return (
        <div className="min-h-[95vh] bg-[#2926268e] flex flex-col justify-center items-center flex-wrap">
            <div className="w-full h-full flex justify-center items-center">
                <div className="w-full mt-40 flex flex-wrap justify-around items-center">
                    {data.slice(0, visibleCount).map((character, index) => {
                        const cleanName = character.Name.toLowerCase().replace(/\s+/g, "-");
                        const cleanEng = character.Eng_name?.toLowerCase().replace(/\s+/g, "-");

                        return (
                            <Link
                                key={index}
                                to={`/animeprofile/${cleanEng || cleanName}`}
                                onClick={() => {
                                    localStorage.removeItem('anime_id');
                                    localStorage.setItem('anime_id', character.anime_id);
                                }}
                                className="relative w-[300px] h-[300px] rounded-[50px] overflow-hidden text-center bg-cover bg-center bg-no-repeat group transition-all duration-700 shadow-[4px_4px_5px_#4153b94f] m-8"
                                style={{ backgroundImage: `url(${character.Img_url})` }}
                            >
                                {/* Black overlay for hover */}
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-all duration-700"></div>

                                {/* Zoom on hover */}
                                <div
                                    className="absolute inset-0 transition-all duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${character.Img_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                ></div>

                                {/* Top color element */}
                                <div className="absolute w-full h-[15%] bg-gradient-to-br from-[#1f1f1fbd] to-[#ffffff7d] right-[120px] top-[40px] -rotate-45 -translate-y-[90px] group-hover:translate-y-0 transition-all duration-700">
                                    <div className="absolute w-full h-full bottom-[40px] bg-gray-400 -translate-x-[145px]"></div>
                                </div>

                                {/* Card text */}
                                <div className="bg-[#000000b9] py-[1vh] flex justify-center align-middle flex-col opacity-0 group-hover:opacity-100 relative top-[80px] text-[120%] transition-opacity duration-700 z-10">
                                    <h1 className="text-xl">
                                        {character.Eng_name ? character.Eng_name : character.Name}
                                    </h1>
                                    <p dangerouslySetInnerHTML={{ __html: character.Genres }}></p>
                                </div>

                                {/* Bottom color element */}
                                <div className="absolute w-full h-[15%] bg-[#ffffff43] left-[140px] top-[245px] -rotate-45 translate-y-[95px] group-hover:translate-y-0 transition-all duration-700">
                                    <div className="absolute w-full h-full bottom-[40px] bg-gradient-to-br from-[#201453c2] to-[#ffffffc6] -translate-x-[147px]"></div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Show More Button */}
            {visibleCount < data.length && (
                <button
                    onClick={showMore}
                    className="mt-8 px-6 py-3 bg-gradient-to-br from-[#233a9f] to-[#7559cb] text-white rounded-full hover:scale-110 transition-all duration-300"
                >
                    Show More
                </button>
            )}
        </div>
    );
};

export default AnimationCard;
