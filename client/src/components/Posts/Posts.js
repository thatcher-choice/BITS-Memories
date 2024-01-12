import React, {useEffect} from 'react';
import { Grid, CircularProgress } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts, getPostsByLocation } from "../../actions/posts";
import { useNavigate, useSearchParams } from 'react-router-dom';
import Post from './Post/Post';
import useStyles from './styles';


const Posts = ({ setCurrentId }) => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { posts, isLoading } =  useSelector((state)  => state.posts);
  const classes = useStyles();
  const history = useNavigate();
  const fetchPostsByLocation = async () => {
    const location = JSON.parse(sessionStorage.getItem('selectedLocation'));
    const queryPlaceId = searchParams.get("placeId") // Rename it to avoid shadowing
    if (queryPlaceId) {
      const { lat, lng, placeId } = location;
    dispatch(getPostsByLocation({ lat, lng, placeId: queryPlaceId }));     
    }
    else{
      console.log(queryPlaceId, 'placeID client')
      dispatch(getPosts(1));
    }
    console.log(queryPlaceId, 'placeID client out');
  };
  useEffect(() => {
    // Fetch posts when the component mounts or refreshes
    fetchPostsByLocation();
  }, [dispatch]);
  console.log(posts.length, 'postlen');

  if (!posts.length && !isLoading) return 'No posts';
  return (
    isLoading ? <CircularProgress /> : (
      <Grid className={classes.container} container alignItems="stretch" spacing={3}>
        {posts?.map((post) => (
          <Grid key={post._id} item xs={12} sm={12} md={6} lg={3}>
            <Post post={post} setCurrentId={setCurrentId} />
          </Grid>
        ))}
      </Grid>
    )
  );
};

export default Posts;
