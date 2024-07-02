import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../utils/axios';


const Likes = ({ post }) => {
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const [likedBy, setLikedBy] = useState(post.likedBy);
    const [liked, setLiked] = useState('');
console.log(likedBy)
    const toggleLike = async () => {
        const res = await axiosInstance.get(`/Posts/${post._id}/${post.userid}/toggle`);
        setLikeCount(res.data.likeCount);
        setLiked(res.data.liked);
        setLiked(!liked);
        if (liked) {
            setLikedBy(likedBy.filter(userLike => userLike._id !== post.userid));
        } else {
            setLikedBy([...likedBy, { _id: post.userid }]);
        }
    };


    return (<div>
        <button onClick={toggleLike}>
            {liked ? 'Unlike' : 'Like'} ({likeCount})
        </button>
    </div>);
}

export default Likes;