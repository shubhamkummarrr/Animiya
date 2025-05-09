import './home.css';
import MediaCard from '../../components/Card';
import MediaCard2 from '../../components/Card2';
import Box from '@mui/material/Box';
import Masonry from '@mui/lab/Masonry';
import { useAnimeNewsQuery, useCSVDataQuery, useGETImgDataBaseQuery } from '../../services/userAuthApi';
import { getToken } from '../../services/localStorage';
import { useEffect, useMemo } from 'react';

const Home = () => {
    const { access_token } = getToken();

    const { data, error, isLoading } = useCSVDataQuery();
    const { data: newsData, error: newsError, isLoading: newsLoading } = useAnimeNewsQuery();
    const { data: GETprofileData, error: GETprofileError, isLoading: GETprofileLoading } = useGETImgDataBaseQuery();

    // Combine and shuffle the cards
    const shuffledCards = useMemo(() => {
        if (!GETprofileData || !data) return [];
        
        // Create an array with both types of cards marked with their type
        const combined = [
            ...GETprofileData.map(item => ({ ...item, type: 'MediaCard2' })),
            ...data.map(item => ({ ...item, type: 'MediaCard' }))
        ];
        
        // Shuffle the array
        return combined.sort(() => Math.random() - 0.5);
    }, [GETprofileData, data]);

    if (isLoading || newsLoading) return (
        <div className="flex justify-center items-center h-screen bg-black">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
        </div>
    );

    if (error || newsError)
        return <div className="text-center text-red-500 py-10">Error: {error?.message || newsError?.message}</div>;

    return (
        <div className="home-background">
            <div className="home-content">
                <div className="home-container">
                    <Box
                        sx={{
                            maxWidth: '100%',
                            mx: 'auto',
                            px: 2,
                        }}
                    >
                        <Masonry columns={{ sm: 1, md: 2, lg: 3 }} spacing={2}>
                            {shuffledCards.map((anime, index) => {
                                if (anime.type === 'MediaCard2') {
                                    return (
                                        <MediaCard2
                                            key={index}
                                            id={anime.id}
                                            image={anime.char_img_url}
                                            sx={{ width: 300, height: 190 }}
                                            title={anime.anime_name}
                                            English_name={anime.anime_name}
                                            Character={anime.char_name}
                                            opinion={anime.opinion || "No description available"}
                                        />
                                    );
                                } else {
                                    return (
                                        <MediaCard
                                            key={index}
                                            image={anime.img_url}
                                            sx={{ width: 300, height: 190 }}
                                            title={anime.name}
                                            English_name={anime.English_name}
                                            Character={anime.character_name}
                                            description={anime.Description || "No description available"}
                                        />
                                    );
                                }
                            })}
                        </Masonry>
                    </Box>
                </div>

                <div className="home-news hidden lg:block">
                    <h1 className="text-3xl font-bold">🎉Anime News🎉</h1>
                    <br />
                    {newsData.map((news, index) => (
                        <div key={index}>
                            <span className="news-title">{news.title}</span>
                            <a href={news.url} target="_blank" rel="noopener noreferrer">
                                <img src={news.image} />
                            </a>
                            <span>{news.excerpt}</span>
                            <div>
                                __________________________________
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;