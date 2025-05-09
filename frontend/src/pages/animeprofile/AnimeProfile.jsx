import React from 'react'
import { useAnimeHomeQuery, useRecommendationQuery, useAnimeProfileQuery } from '../../services/userAuthApi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';



const AnimeProfile = () => {
    const { data, error, isLoading } = useAnimeHomeQuery();

    // const anime_id = useSelector((state) => state.animeProfile.anime_id);
    const anime_id = localStorage.getItem('anime_id');
    const { data: animeProfileData, error: animeProfileError, isLoading: animeProfileIsLoading } = useAnimeProfileQuery(anime_id);
    console.log("anime_id:", anime_id, "type:", typeof (anime_id))

    console.log(animeProfileData?.anime1[0], animeProfileError, animeProfileIsLoading)

    const animeName = animeProfileData?.anime1[0]?.Name;

    console.log(String(animeName));

    const {
        data: recommendData,
        error: recommendError,
        isLoading: recommendLoading,
    } = useRecommendationQuery(animeName);

    console.log({
        animeData: data,
        animeError: error,
        animeLoading: isLoading,
        recommendData,
        recommendError,
        recommendLoading
    });

    if (isLoading || recommendLoading || animeProfileIsLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl font-semibold animate-pulse">Loading...</p>
            </div>
        );
    }

    if (error || recommendError || animeProfileError) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-600 text-xl font-semibold">
                    Error: {error?.message || recommendError?.message || "Something went wrong"}
                </p>
            </div>
        );
    }

    return (
        <div className='mt-20 h-[100vh] w-[100%]'>
            <div className="max-w-7xl mx-auto px-8 py-16">
                {/* Header with Image and Title */}
                <div className="flex flex-col md:flex-row items-start gap-10 mb-16">
                    <div className="md:w-2/5 w-full max-w-xl">
                        <img
                            className="w-full h-auto max-h-[500px] rounded-xl shadow-2xl border-4 border-blue-200 object-cover"
                            src={animeProfileData?.anime1[0]?.Img_url}
                            alt={animeProfileData?.anime1[0]?.Eng_name || animeProfileData?.anime1[0]?.Name}
                        />
                    </div>
                    <div className="flex-1 mt-4 md:mt-0">
                        <h1 className="text-5xl font-bold text-gray-100 mb-6 border-b-2 border-indigo-400 pb-3">
                            {animeProfileData?.anime1[0]?.Eng_name !== 'UNKNOWN' ? animeProfileData?.anime1[0]?.Eng_name : animeProfileData?.anime1[0]?.Name}
                        </h1>

                        {/* Stats Row */}
                        <div className="flex flex-wrap gap-5 mb-8">
                            <div className="px-6 py-3 rounded-lg">
                                <p className="text-2xl underline text-white">Score</p>
                                <p className="text-4xl text-indigo-300 font-bold">{animeProfileData?.anime1[0]?.Score}</p>
                            </div>
                            <div className="px-6 py-3 rounded-lg">
                                <p className="text-2xl underline text-white">Rank</p>
                                <p className="text-4xl text-indigo-300 font-bold">#{animeProfileData?.anime1[0]?.Rank}</p>
                            </div>
                            <div className="px-6 py-3 rounded-lg">
                                <p className="text-2xl underline text-white">Popularity</p>
                                <p className="text-4xl text-indigo-300 font-bold">#{animeProfileData?.anime1[0]?.Popularity}</p>
                            </div>
                            <div className="px-6 py-3 rounded-lg">
                                <p className="text-2xl underline text-white">Episodes</p>
                                <p className="text-4xl text-indigo-300 font-bold">{animeProfileData?.anime1[0]?.Episodes}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left Column - Details */}
                    <div className="lg:w-1/3 bg-[#000000] p-8 rounded-2xl border border-gray-700">
                        <h2 className="text-3xl font-semibold mb-8 text-white decoration-indigo-400">Details</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-lg text-gray-400">Type:</p>
                                <p className="text-xl text-gray-200">{animeProfileData?.anime1[0]?.Type}</p>
                            </div>
                            <div>
                                <p className="text-lg text-gray-400">Anime Id:</p>
                                <p className="text-xl text-gray-200">{animeProfileData?.anime1[0]?.anime_id}</p>
                            </div>
                            <div>
                                <p className="text-lg text-gray-400">Aired:</p>
                                <p className="text-xl text-gray-200">{animeProfileData?.anime1[0]?.Start_Year}</p>
                            </div>
                            <div>
                                <p className="text-lg text-gray-400">Rating:</p>
                                <p className="text-xl text-gray-200">{animeProfileData?.anime1[0]?.Rating}</p>
                            </div>
                            <div>
                                <p className="text-lg text-gray-400">Genres:</p>
                                <p className="text-xl text-gray-200">{animeProfileData?.anime1[0]?.Genres}</p>
                            </div>
                            <div>
                                <p className="text-lg text-gray-400">Members:</p>
                                <p className="text-xl text-gray-200">{animeProfileData?.anime1[0]?.Members?.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-lg text-gray-400">Favorites:</p>
                                <p className="text-xl text-gray-200">{animeProfileData?.anime1[0]?.Favorites?.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Synopsis */}
                    <div className="flex-1">
                        <div className="bg-[#314191] p-8 rounded-2xl shadow-lg border border-gray-800">
                            <h2 className="text-3xl font-semibold mb-6 text-white underline decoration-indigo-400">Synopsis</h2>
                            <p className="text-xl text-gray-300 leading-relaxed tracking-wide">
                                {animeProfileData?.anime1[0]?.Synopsis}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col min-h-[400px] max-h-[90vh] bg-black p-4 rounded-lg'>
                <h3 className='text-3xl md:text-6xl font-bold text-left mb-6 text-blue-100'>Recommendations⭐</h3>
                <div className='flex flex-row space-x-6 overflow-x-auto pb-4'>
                    {recommendData.map((data, index) => {
                        const cleanName = data.Name.toLowerCase().replace(/\s+/g, "-");
                        const cleanEng = data.Eng_name.toLowerCase().replace(/\s+/g, "-");

                        return (
                            <div
                                key={index}
                                className="flex-none w-[300px] min-w-[300px] max-w-[300px] min-h-[400px] max-h-[50vh] bg-[#000000] rounded-lg shadow-xl text-blue-50 p-3 hover:bg-blue-900 transition-colors duration-200"
                            >
                                <a
                                    href={`/animeprofile/${cleanEng ? cleanEng : cleanName}`}
                                    onClick={() => {
                                        localStorage.removeItem('anime_id');
                                        localStorage.setItem('anime_id', data.anime_id);
                                    }}
                                    className="block h-full"
                                >
                                    <div className="h-[70%] min-h-[180px] max-h-[40vh] overflow-hidden rounded-md mb-2">
                                        <img
                                            src={data?.Img_url}
                                            alt=""
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    <p className="text-sm font-semibold mb-1 line-clamp-2">
                                        {data.Eng_name !== "UNKNOWN" ? data.Eng_name : data.Name}
                                    </p>
                                    <p className="text-xs text-blue-200"><b>Score:</b> {data.Score} ({data.Scored_By})</p>
                                    <p className="text-xs text-blue-200 line-clamp-1"><b>Genre:</b> {data.Genres}</p>
                                </a>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default AnimeProfile