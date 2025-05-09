import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { usePatchOpinionVoteMutation, useProfileQuery, useHomeOpinionsMutation } from '../services/userAuthApi'; // Update this import
import { getToken } from '../services/localStorage';
import { useUserProfileQuery } from '../services/userAuthApi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function MediaCard2(data) {
    const navigate = useNavigate();
    const { access_token } = getToken();
    const accessToken = useSelector((state) => state.auth.access_token);
    const { data: profileData } = useUserProfileQuery(accessToken);
    const [homeOpinions, { isLoading }] = useHomeOpinionsMutation();
    // console.log(homeOpinions)

    const [patchOpinionVote] = usePatchOpinionVoteMutation();
    const [agreeCount, setAgreeCount] = useState(data.agree || 0);
    const [disagreeCount, setDisagreeCount] = useState(data.disagree || 0);
    const [userVote, setUserVote] = useState(null); // Track user's current vote
    const [isUnderlined, setIsUnderlined] = useState(false); // CSS conditionally apply karega
    const [isUnderlined2, setIsUnderlined2] = useState(false); // CSS conditionally apply karega


    const handleVote = async (voteType) => {
        if (!access_token) {
            alert("Login to vote.");
            navigate('/login');
            return;
        }

        try {
            // Don't allow duplicate votes
            if (userVote === voteType) return;

            const payload = {
                id: data.id,
                action: voteType,
                previousVote: userVote
            };

            const response = await patchOpinionVote(payload).unwrap();

            // Update local state with the response
            setAgreeCount(response.agree);
            setDisagreeCount(response.disagree);
            setUserVote(voteType);

        } catch (error) {
            console.error('Error updating vote:', error);
        }
    };

    const handleAgreeClick = () => {
        handleVote('agree');
        console.log('Disagree clicked!');
        setIsUnderlined2(true);
        setIsUnderlined(false);

        const payload = {
            user: profileData.user,
            anime_name: data.title,
            char_name: data.Character,
            char_img_url: data.image,
            opinion: data.opinion,
            agree: 1,
            disagree: 0,
        };

        homeOpinions(payload)
            .unwrap()
            .then((response) => {
                console.log('Opinion posted successfully:', response);
                if (response.msg !== 'Opinion added successfully') {
                    alert(response.msg);
                }
            })
            .catch((error) => {
                console.error('Error posting opinion:', error);
            });
    };

    const handleDisagreeClick = () => {
        handleVote('disagree');
        console.log('Disagree clicked!');
        setIsUnderlined2(true);
        setIsUnderlined(false);

        const payload = {
            user: profileData.user,
            anime_name: data.title,
            char_name: data.Character,
            char_img_url: data.image,
            opinion: data.opinion,
            agree: 0,
            disagree: 1,
        };

        homeOpinions(payload)
            .unwrap()
            .then((response) => {
                console.log('Opinion posted successfully:', response);
            })
            .catch((error) => {
                console.error('Error posting opinion:', error);
            });
    };

    return (
        <Card sx={{ maxWidth: 500, backgroundColor: '#00000095', m: 0, p: 0 }}>
            <CardMedia
                sx={{ height: 400, width: '80%', m: 0, p: 0 }}
                image={data.image}
                title="anime image"
                style={{ borderRadius: '8px 8px 0 0', margin: "0 26px" }}
            />
            <CardContent sx={{ p: 0, m: 0 }}>
                <Typography variant="h5" component="div" sx={{ color: 'white', m: 0, p: '8px 8px 4px' }}>
                    {data.Character}
                </Typography>

                <Typography variant="body2" sx={{ color: 'white', m: 0, p: '0 8px 8px' }}>
                    -{data.English_name !== 'Unknown' ? data.English_name : data.title}
                </Typography>

                <div>
                    <Typography className='!text-white !text-xl'>
                        -------------------------------
                        <br />
                        {data.opinion}
                        <br />
                        -------------------------------
                    </Typography>

                    <CardActions sx={{ p: 0, m: 0, justifyContent: 'center' }} >
                        <Button
                            onClick={handleAgreeClick}
                            className='!text-white '
                            sx={{ p: '4px 8px', m: 0 }}
                            style={{
                                textDecoration: userVote === 'agree' ? 'underline' : 'none',
                            }}
                        >
                            {agreeCount !== 0 ? agreeCount : ''} Agree
                        </Button>
                        <p className='text-white'>|</p>
                        <Button
                            onClick={handleDisagreeClick}
                            className='!text-white'
                            sx={{ p: '4px 8px', m: 0 }}
                            style={{
                                textDecoration: userVote === 'disagree' ? 'underline' : 'none',
                            }}
                        >
                            {disagreeCount !== 0 ? disagreeCount : ''} Disagree
                        </Button>
                    </CardActions>
                </div>
            </CardContent>
        </Card>
    );
}