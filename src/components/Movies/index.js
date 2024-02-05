import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import axios from 'axios';

class Movies extends React.Component {
    state = {
        movies: []
    };

    componentDidMount() {
        this.fetchMovies();
    }
    
    fetchMovies = async () => {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/movies/popular`);
        this.setState({ movies: response.data });
    }

    render() {
        return (
            <Grid container spacing={2} sx={{ p: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {this.state.movies.map(movie => (
                    <Card key={movie.id} sx={{ height: 500, width: 300, display: 'flex', flexDirection: 'column', margin: 2 }}>
                        <CardMedia
                            component="img"
                            sx={{ height: 400 }} // Set a specific height
                            image={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                            alt={movie.title}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography gutterBottom variant="h7" component="div">
                                {movie.title}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Grid>
        );
    }
}

export default Movies;