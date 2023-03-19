import { API_KEY } from "./src/secrets.js";
import { eventMenuHamburguesa } from "./src/menuHamburguesa.js";
import { navigator } from './src/navigation.js';

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});


// Utils

// function to see the width admitted for the API

// const configuration = async () => {
//     const { data } = await api(`configuration`)


//     console.log(data)
// }

function createMovies(movies, container) {
    container.innerHTML = '';
    movies.forEach(movie => {
        const movieListContainerInfo = document.createElement('div');
        const movieImg = document.createElement('img');
        const titleMovie = document.createElement('h3');
        const textTitleMovie = document.createTextNode(`${movie.title || movie.name}`)

        movieListContainerInfo.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        })

        movieListContainerInfo.classList.add('movieList__container-info');
        movieImg.classList.add('movieList__img');
        titleMovie.classList.add('movieList__title-movie');


        titleMovie.setAttribute('title', movie.title || movie.name)
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'http://image.tmdb.org/t/p/w342' + movie.poster_path || 'http://image.tmdb.org/t/p/original' + movie.backdrop_path);


        titleMovie.appendChild(textTitleMovie);
        container.appendChild(movieListContainerInfo)
        movieListContainerInfo.appendChild(movieImg);
        movieListContainerInfo.appendChild(titleMovie);
    });
}


// LLamados a la API

async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;

    const trendingPreview = document.getElementById('trendingPreview');
    const movieTitleTrending = document.querySelector('.trendingPreview__title');
    const trendingPreviewMoviesSlide = document.querySelectorAll('.trendingPreview__movies-trending');
    const trendingPreviewMoviesSlideArray = [...trendingPreviewMoviesSlide];

    trendingPreview.style.background = ''

    trendingPreview.style.background = `linear-gradient(0deg, rgba(0,0,0,0.3),rgba(0,0,0,0.3)), url(https://image.tmdb.org/t/p/original${movies[0].backdrop_path}) no-repeat`;
    trendingPreview.style.backgroundSize = 'cover';
    movieTitleTrending.innerHTML = movies[0].title;


    trendingPreviewMoviesSlideArray.map((movie, index) => {
        movie.style.background = `linear-gradient(0deg, rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url(https://image.tmdb.org/t/p/w342${movies[index].poster_path}) no-repeat`;
        movie.style.backgroundSize = 'cover'

        const intervalId = setInterval(changeImage, 5000);



        let count = 0;

        function changeImage() {
            if (count < 4) {
                movieTitleTrending.textContent = movies[count].title;
                trendingPreview.style.background = `linear-gradient(0deg, rgba(0,0,0,0.3),rgba(0,0,0,0.3)), url(https://image.tmdb.org/t/p/original${movies[count++].backdrop_path}) no-repeat`;
                trendingPreview.style.backgroundSize = 'cover';
            } else {
                count = 0;
            }
        };

        movie.addEventListener('click', () => {
            trendingPreview.style.background = `linear-gradient(0deg, rgba(0,0,0,0.3),rgba(0,0,0,0.3)), url(https://image.tmdb.org/t/p/original${movies[index].backdrop_path}) no-repeat`;
            trendingPreview.style.backgroundSize = 'cover';
            movieTitleTrending.textContent = movies[index].title;
            clearInterval(intervalId);
        })
    })
}



const getRecommendationPreview = async () => {
    const { data } = await api(`movie/13/recommendations`)
    const movies = data.results;
    const movieListContainer = document.getElementById('containerRecommendation');
    createMovies(movies, movieListContainer);
    movieListContainer.scrollTo(0, 0);
}

const getTopRatedPreview = async () => {
    const { data } = await api(`movie/top_rated?page=1`);
    const movies = data.results;
    const topRatedMoviesContainer = document.getElementById('topRatedMovies');
    createMovies(movies, topRatedMoviesContainer)

    topRatedMoviesContainer.scrollTo(0, 0);
}


const getMoviesByGenres = async (id) => {
    const { data } = await api(`discover/movie`, {
        params: {
            with_genres: id,
        }
    });
    const movies = data.results;
    const genericList = document.getElementById('genericList');
    createMovies(movies, genericList);
}

const getMoviesBySearch = async (query) => {
    const { data } = await api(`search/movie`, {
        params: {
            query: query,
        }
    });

    const moviesAndSeries = data.results;
    const genericList = document.getElementById('genericList');
    createMovies(moviesAndSeries, genericList);
}

const getTrendingMovies = async () => {
    const { data } = await api(`trending/movie/day`);

    const movies = data.results;
    const genericList = document.getElementById('genericList');

    createMovies(movies, genericList);
}

const getMovieById = async (id) => {
    const { data: movie } = await api(`movie/${id}`);

    const getGenresInfo = movie.genres;

    const movieInfoTitle = document.querySelector('.movie-info__movieTitle');
    const movieInfoPoints = document.querySelector('.fa-star');
    const movieInfoParagraph = document.querySelector('.movie-info__paragraph');
    const movieInfoList = document.querySelector('.movie-info__lista-generes');
    const movieInfoSection = document.getElementById('movieInfoSection');

    const Img_URL = `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    movieInfoSection.style.background = `linear-gradient(0deg,rgba(0,0,0,0.2),rgba(0,0,0,0.2)),url('${Img_URL}') no-repeat`;
    movieInfoSection.style.backgroundSize = 'cover'
    movieInfoTitle.textContent = movie.title;
    movieInfoPoints.textContent = movie.vote_average;
    movieInfoParagraph.textContent = movie.overview;



    movieInfoList.innerHTML = '';

    getGenresInfo.forEach((genres) => {
        const li = document.createElement('li');
        const liGenre = document.createTextNode(genres.name)
        li.classList.add('movie-info__generes');

        movieInfoList.appendChild(li);
        li.appendChild(liGenre);
    });

    getRelatedMoviesId(id);

}



const getRelatedMoviesId = async (id) => {
    const { data } = await api(`movie/${id}/recommendations`);
    const movieRecommendations = data.results;

    const movieInfoContainer = document.querySelector('.movie-info__container');
    const ulMovieList = document.createElement('ul');
    ulMovieList.classList.add('movie-info__recommendations-list');
    ulMovieList.classList.add('scrollStyle');
    movieInfoContainer.appendChild(ulMovieList);

    movieRecommendations.forEach((movie) => {
        const liMovieList = document.createElement('li');
        const imgMovieList = document.createElement('img');

        liMovieList.classList.add('movie-info__recommendations-item');
        imgMovieList.classList.add('movie-info__img');

        imgMovieList.setAttribute('src', 'http://image.tmdb.org/t/p/w342' + movie.poster_path || 'http://image.tmdb.org/t/p/w300' + movie.backdrop_path);
        imgMovieList.setAttribute('alt', movie.title);

        liMovieList.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        })

        ulMovieList.appendChild(liMovieList);
        liMovieList.appendChild(imgMovieList);
    })
};




eventMenuHamburguesa();

navigator();


export {
    getTrendingMoviesPreview,
    getRecommendationPreview,
    getTopRatedPreview,
    getMoviesByGenres,
    getMoviesBySearch,
    getTrendingMovies,
    getMovieById,
}