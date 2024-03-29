import React, { useState } from 'react';
import { Container, Grow, Grid, AppBar, TextField, Button, Paper, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';
import Map from '../Map/Map';
import { getPostsBySearch } from '../../actions/posts';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import Pagination from '../Pagination';
import useStyles from './styles';
import { useEffect } from 'react';
import { getPostsByLocation } from '../../actions/posts';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const PostsLanding = () => {
  const classes = useStyles();
  const query = useQuery();
  const searchQuery = query?.get('searchQuery');
  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();
  const lat = query?.get('lat');
  const lng = query?.get('lng');
  const placeId = query?.get('placeId');
  const page = query?.get('page');
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]);
  const history = useNavigate();

  useEffect(() => {
    // When lat and lng change, update the posts based on location
    if (lat && lng && placeId && !page) {
      dispatch(getPostsByLocation({ lat, lng, placeId }));
      history(`/posts?lat=${lat}&lng=${lng}&placeId=${placeId}`);
    }
  }, [lat, lng, placeId, dispatch]);


  const searchPost = () => {
    if (search.trim() || tags) {
      dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
      history(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
    } else {
      history(`/`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPost();
    }
  };

  const handleAddChip = (tag) => setTags([...tags, tag]);

  const handleDeleteChip = (chipToDelete) => setTags(tags.filter((tag) => tag !== chipToDelete));
  const [searchParams, setSearchParams] = useSearchParams();
  const queryPlaceId = searchParams.get("placeId") 
  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid container justify="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
          <Grid item xs={12} sm={6} md={9}>
            <Posts setCurrentId={setCurrentId} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBar className={classes.appBarSearch} position="static" color="inherit">
              <TextField onKeyDown={handleKeyPress} name="search" variant="outlined" label="Search Memories" fullWidth value={search} onChange={(e) => setSearch(e.target.value)} />
              <ChipInput
                style={{ margin: '10px 0' }}
                value={tags}
                onAdd={(chip) => handleAddChip(chip)}
                onDelete={(chip) => handleDeleteChip(chip)}
                label="Search Tags"
                variant="outlined"
              />
              <Button onClick={searchPost} className={classes.searchButton} variant="contained" color="primary">Search</Button>
            </AppBar>
           {queryPlaceId ? <Form currentId={currentId} setCurrentId={setCurrentId} /> :
           <Paper className={classes.paper} elevation={6}>
           <Typography variant="h6" align="center">
           Choose your favorite spot on the map, where memories come alive—create or relive your own story right there
           </Typography>
         </Paper>
           } 
            
            {(!searchQuery && !tags.length) && (
              <Paper className={classes.pagination} elevation={6}>
                <Pagination page={page} />
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default PostsLanding;
