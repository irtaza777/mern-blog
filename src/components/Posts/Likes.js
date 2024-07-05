import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';


const Likes = ({ post,likes }) => {
console.log('likes.liked', likes.liked)
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const [liked, setLiked] = useState('');
    const auth = localStorage.getItem('user');
    const id =  auth && JSON.parse(auth)._id
    useEffect(() => {
       

        if (id ) {
            axiosInstance.get(`/Posts/${post._id}/${id }/likeStatus`).then((res) => {
                setLiked(res.data.liked);
            }).catch((error) => {
                console.error('Error fetching like status:', error);
            });
        }
    }, [post._id]);
    const toggleLike = async () => {
        

       

        const res = await axiosInstance.post(`/Posts/${post._id}/${id}/toggle`);

        setLikeCount(res.data.likeCount);
        setLiked(res.data.liked);
       // if (liked) {
       //     setLiked(likes.filter(userLike => userLike.liked ===false));
       // } else {
       //     setLiked(likes.filter(userLike => userLike.liked ===true));
        //}
    };
  

    return (<div>
        <button onClick={toggleLike} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            {liked ? 'unlike' : 'like'} Total Likes : ({likeCount})
        </button>
    </div>);
}

export default Likes;