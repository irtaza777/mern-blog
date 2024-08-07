import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';


const Likes = ({ post }) => {
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const [liked, setLiked] = useState('');
    const auth = localStorage.getItem('user');
    const id = auth && JSON.parse(auth)._id

    // liked status of that user liked post
    // Memoize the id and post._id to avoid unnecessary re-renders
    
    useEffect(() => {
        console.log('useEffect triggered');
        if (id) {
            axiosInstance.get(`/Posts/${post._id}/${id}/likeStatus`)
                .then((res) => {
                    setLiked(res.data.liked);
                })
                .catch((error) => {
                    console.error('Error fetching like status:', error);
                })
               
        }
    }, [id,post._id]);

    //api to enter state of toogle in db

    const toggleLike = async () => {
        const res = await axiosInstance.post(`/Posts/${post._id}/${id}/toggle`);

        setLikeCount(res.data.likeCount);
        setLiked(res.data.liked);
        console.log("ok")
        
    };


    return (<div>
        <button onClick={toggleLike} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
        <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} color={liked ? 'red' : 'gray'} size="2x" />
            {likeCount}
        </button>
    </div>);
}

export default Likes;