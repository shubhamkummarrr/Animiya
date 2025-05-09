import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useHomeOpinionsMutation, useImgDataBaseMutation } from '../services/userAuthApi';
import { getToken } from '../services/localStorage';
import { useUserProfileQuery } from '../services/userAuthApi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


export default function MediaCard(data) {
    const [text, setText] = useState("");
    const [opinionVisible, setOpinionVisible] = useState(true);
    const [postDisabled, setPostDisabled] = useState(true);
    const [opinionSubmitted, setOpinionSubmitted] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [isUnderlined, setIsUnderlined] = useState(false); // CSS conditionally apply karega
    const [isUnderlined2, setIsUnderlined2] = useState(false); // CSS conditionally apply karega

    const navigate = useNavigate();


    const { access_token } = getToken();
    const accessToken = useSelector((state) => state.auth.access_token);
    const { data: profileData, isSuccess: profileSuccess, isLoading: profileLoading } = useUserProfileQuery(accessToken);
    const [homeOpinions, { isLoading }] = useHomeOpinionsMutation();
    const [ImgDataBase] = useImgDataBaseMutation();


    const handleOpinionClick = () => {
        setOpinionVisible(false);
        setPostDisabled(false);
    };


    const handlePostClick = () => {

        const payload = {
            anime_name: data.title,
            char_name: data.Character,
            char_img_url: data.image,
            opinion: text,
        };
    
        ImgDataBase(payload)
            .unwrap()
            .then((response) => {
                console.log('Opinion posted successfully:', response);
            })
            .catch((error) => {
                console.error('Error posting opinion:', error);
            });
        if (!access_token) {
            alert("Login to post your opinion.");
            navigate('/login');
            return;
        }
    
        if (text.trim() === "") {
            alert("Please write your opinion before posting.");
            return;
        }
    
        setOpinionSubmitted(true);
        setPostDisabled(true);
        // Ab yahan mutation call karo like homeOpinions({ text }) etc.
    };
    

    const handleAgreeClick = () => {
        console.log('Agree clicked!');
        setIsUnderlined(true);
        setIsUnderlined2(false);
    
        const payload = {
            user: profileData.user,
            anime_name: data.title,
            char_name: data.Character,
            char_img_url: data.image,
            opinion: text,
            agree: 1,
            disagree: 0,
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
    
    const handleDisagreeClick = () => {
        console.log('Disagree clicked!');
        setIsUnderlined2(true);
        setIsUnderlined(false);
    
        const payload = {
            user: profileData.user,
            anime_name: data.title,
            char_name: data.Character,
            char_img_url: data.image,
            opinion: text,
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
        <Card
            sx={{
                maxWidth: 500,
                backgroundColor: '#00000095',
                m: 0,
                p: 0
            }}
        >
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

                <Typography variant="body2" sx={{ color: 'white', m: 0, p: '0 8px 8px' }} className='!text-xl'>
                    -{data.English_name !== 'Unknown' ? data.English_name : data.title}
                </Typography>

                {!opinionSubmitted ? (
                    <div style={{ margin: 0, padding: 0 }}>
                        {opinionVisible ? (
                            <CardActions sx={{ p: 0, m: 0, justifyContent: 'center' }}>
                                <Button
                                    onClick={handleOpinionClick}
                                    className='!bg-blue-500 !text-white w-2xl'
                                    sx={{ p: '12px 0px', m: 0, minWidth: 'unset' }}
                                >
                                    Opinion
                                </Button>
                            </CardActions>
                        ) : (
                            <>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="bg-blue-200 text-black p-2 w-full resize-none rounded"
                                    rows={2}
                                    style={{ margin: 0, padding: 0, width: '100%', fontSize: '' }}
                                    placeholder="Write your opinion..."
                                />
                                <CardActions sx={{ p: 0, m: 0, justifyContent: 'center' }}>
                                    <Button
                                        onClick={handlePostClick}
                                        disabled={postDisabled}
                                        className='!text-white'
                                        sx={{ p: '4px 8px', m: 0 }}
                                    >
                                        Post
                                    </Button>
                                    <Button
                                        onClick={() => setOpinionVisible(true)}
                                        className='!text-white'
                                        sx={{ p: '4px 8px', m: 0 }}
                                    >
                                        Cancel
                                    </Button>
                                </CardActions>
                            </>
                        )}
                    </div>
                ) : (
                    <div style={{ margin: 0, padding: 0 }}>
                        <p style={{ margin: 0, padding: 0, color: 'white' }}>-----------------------------------------</p>
                        <p
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: expanded ? 'unset' : 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                cursor: 'pointer',
                                margin: 0,
                                padding: '0 8px',
                                color: 'white'
                            }}
                            onClick={() => setExpanded(!expanded)}
                        >
                            {text}
                        </p>
                        <p style={{ margin: 0, padding: 0, color: 'white' }}>-----------------------------------------</p>
                        <CardActions sx={{ p: 0, m: 0, justifyContent: 'center' }} >
                            <Button
                                onClick={handleAgreeClick}
                                className='!text-white bg-blue-500 !text-xl'
                                sx={{ p: '4px 8px', m: 0 }}
                                style={{textDecoration: isUnderlined ? 'underline' : 'none',}}
                            >
                                Agree
                            </Button>
                            <p className='text-white'>|</p>
                            <Button
                                onClick={handleDisagreeClick}
                                className='!text-white !text-xl'
                                sx={{ p: '4px 8px', m: 0 }}
                                style={{textDecoration: isUnderlined2 ? 'underline' : 'none',}}
                            >
                                Disagree
                            </Button>
                        </CardActions>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
