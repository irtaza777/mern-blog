import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { useQuery } from 'react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';


const Likes = React.memo(({ post }) => {
    const [likeCount, setLikeCount] = useState(post.likeCount);

    const auth = localStorage.getItem('user');
    const id = auth && JSON.parse(auth)._id

    // liked status of that user liked post
 // Fetch like status using useQuery
 const { data:liked, isLoading, isError, refetch: refetchLiked } = useQuery(['likeStatus', post._id, id], async () => {
    const res = await axiosInstance.get(`/Posts/${post._id}/${id}/likeStatus`);
    return res.data.liked;
    
});

    //api to enter state of toogle in db

    const toggleLike = async () => {
        const res = await axiosInstance.post(`/Posts/${post._id}/${id}/toggle`);
        setLikeCount(res.data.likeCount);
        await Promise.all([refetchLiked()]);

    };

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error fetching like status.</p>;

    return (<div>
        <button onClick={toggleLike} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
        <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} color={liked ? 'red' : 'gray'} size="2x" />
            {likeCount}
        </button>
    </div>);
})

export default Likes;