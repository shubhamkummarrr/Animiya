import './AnimeHome.css';
import AnimationCard from './AnimationCard';
import { useAnimeHomeQuery } from '../../services/userAuthApi';
import { Link } from 'react-router-dom';

const AnimeHome = () => {

    const videos = [
        'Untitled video - Made with Clipchamp.mp4',
        'Untitled video - Made with Clipchamp (1).mp4',
        'Untitled video - Made with Clipchamp (2).mp4',
        'Untitled video - Made with Clipchamp (3).mp4',
    ];

    const { data, error, isLoading } = useAnimeHomeQuery();
    console.log(data)
    console.log(data?.popular_anime)
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl font-semibold animate-pulse">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-600 text-xl font-semibold">
                    Error: {error?.message || recommendError?.message || "Something went wrong"}
                </p>
            </div>
        );
    }
    const allAnime = [
        ...(data?.this_season || []),
    ];

    // Randomly pick 9 unique anime
    const randomAnime = [...allAnime]
        .sort(() => 0.5 - Math.random())
        .slice(0, 9);

    console.log(typeof (data?.anime[0]?.anime_id), data?.anime[0]?.anime_id)
    console.log(data?.anime?.anime_id)

    return (
        <div className="main">
            {/* Your existing content */}
            <div className="container">
                <div className="carousel">
                    {randomAnime.map((anime, index) => (
                        <div
                            key={index}
                            className="carousel__face border-blue-900 rounded-b-md shadow-lg shadow-blue-500/20"
                            style={{ backgroundImage: `url(${anime.Img_url})` }}
                        >
                            {/* span hata diya, sirf image dikhegi */}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white h-80 mt-10 w-full flex justify-center items-center"></div>

            <h1 className="text-center mr-auto mt-50 mb-10 text-5xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold">
                Trending Anime
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {data?.trending_anime.map((anime, i) => {
                    const cleanName = anime.Name.toLowerCase().replace(/\s+/g, "-");
                    const cleanEng = anime.Eng_name.toLowerCase().replace(/\s+/g, "-");

                    return (
                        <div key={i} className="flex flex-col items-center mx-10">
                            <Link to={`/animeprofile/${cleanEng ? cleanEng : cleanName}`}>
                                <img
                                    className="w-full h-full object-cover rounded-md"
                                    src={anime.Img_url}
                                    alt={`Anime ${i}`}
                                    onClick={() => {
                                        localStorage.removeItem('anime_id');
                                        localStorage.setItem('anime_id', anime.anime_id);
                                    }}
                                />
                            </Link>
                            <div className="flex flex-row gap-2 items-center mt-2">
                                <span className="text-xs font-bold">{i + 1}</span>
                                <h2 className="text-center text-sm font-semibold">{anime.Name}</h2>
                            </div>
                        </div>
                    );
                })}


            </div>


            {/* Video sections */}
            <div className="video-container mt-[100vh]">
                {videos.map((video, index) => (
                    <div key={index} className="video-section sticky top-0 h-screen w-full">
                        <video
                            className="h-full w-full object-cover"
                            src={video}
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    </div>
                ))}
            </div>


            <div className="anime1 bg-black h-auto w-full flex justify-center items-center gap-5 flex-col">
                <div id="favorates" className="bg-black mt-[10rem] text-white h-[auto] w-[100%] flex justify-center items-center"></div>
                
                
                <div className='bg-black text-white h-[auto] w-[100%] flex flex-col justify-center mt-100 items-center'>
                    <h1 className='text-left mr-auto text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold'>Top Anime</h1>
                    <AnimationCard data={data?.popular_anime} />
                </div>


                <div className='bg-black text-white h-[auto] w-[100%] flex flex-col mt-100 justify-center items-center'>
                    <h1 className="text-left mr-auto text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold">Favorites This Year</h1>
                    <AnimationCard data={data?.top_score} />
                </div>


                <div className='w-full mt-50'>
                    <img className='w-[50vh] left' src="image.png" alt="" />
                </div>


                <div className='bg-black text-white h-[auto] w-[100%] flex flex-col my-60 justify-center items-center'>
                    <h1 className='text-left mr-auto text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold'>This Season</h1>
                    <AnimationCard data={data?.this_season} />
                </div>

                
                <div className='bg-black text-white h-[auto] w-[100%] flex flex-col my-60 justify-center items-center'>
                    <h1 className='text-left mr-auto text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold'>Previous Year</h1>
                    <AnimationCard data={data?.previos_year} />
                </div>
            </div>
        </div>
    );
};

export default AnimeHome;