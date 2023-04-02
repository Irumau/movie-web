import { API_KEY } from "./src/secrets.js";
import { eventMenuHamburguesa } from "./src/menuHamburguesa.js";
import { navigator, getPaginated, homePage } from './src/navigation.js';

// Data


const languageObject = {
    'en': {
        topRated: 'Top Rated',
        recommendation: 'Recommendation',
        favoriteMovies: 'Favorite Movies',
        emptyFavoriteMovies: `You haven't favorite Movies yet.`,
    },
    'es': {
        topRated: 'Mejor valoradas',
        recommendation: 'Recomendaciones',
        favoriteMovies: 'Películas Favoritas',
        emptyFavoriteMovies: 'Aún no tienes películas favoritas',

    },
    'pt_br': {
        topRated: 'Mais votado',
        recommendation: 'Recomendação',
        favoriteMovies: 'Gilmes favoritos',
        emptyFavoriteMovies: 'Você ainda não tem filmes favoritos.',

    },
    'fr': {
        topRated: 'Les mieux notés',
        recommendation: 'Recommandation',
        favoriteMovies: 'Films préférés',
        emptyFavoriteMovies: `Vous n'avez pas encore de films favoris.`,
    },
    'de': {
        topRated: 'Best bewertet',
        recommendation: 'Empfehlung',
        favoriteMovies: 'Lieblingsfilme',
        emptyFavoriteMovies: 'Sie haben noch keine Lieblingsfilme.',
        },
}

function changeLanguage(language) {

    const titleTopRated = document.querySelector('.movieList__topRated');
    const titleRecommendation = document.querySelector('.movieList__recommendation');
    const titleFavoriteMovies = document.querySelector('.movieList__likedMovies');
    const emptyFavoriteMovies = document.querySelector('.emptyFavoriteList');


    const languageObj =  languageObject[language];

    titleTopRated.textContent = languageObj.topRated;
    titleRecommendation.textContent = languageObj.recommendation;
    titleFavoriteMovies.textContent = languageObj.favoriteMovies;
    emptyFavoriteMovies.textContent = languageObj.emptyFavoriteMovies;
}

const language = document.getElementById('selectLanguage');

let lang = navigator.language;

language.addEventListener('change', (event) => {
    lang = event.target.value;

    if (lang === 'es') changeLanguage('es');
    if (lang === 'pt-BR') changeLanguage('pt_br');
    if(lang === 'fr')changeLanguage('fr');     
    if(lang === 'de') changeLanguage('de');  
    if(lang == 'en') changeLanguage('en');  
    
    homePage();
})


const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});

function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;
    if (item) {
        movies = item
    } else {
        movies = {};
    }

    return movies;
}

function likeMovie(movie) {
    //movie.id
    const likedMovies = likedMoviesList();

    //si la pelicula esta en localStorage
    if (likedMovies[movie.id]) {
        //removerla del localStorage
        likedMovies[movie.id] = undefined;
    } else {
        //agregar a local storage
        likedMovies[movie.id] = movie;
    }


    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));

}




// Utils

// function to see the width admitted for the API

// const configuration = async () => {
//     const { data } = await api(`configuration`)


//     console.log(data)
// }

const observador = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);

            observador.unobserve(entry.target);
        }
    })
});



function createMovies(movies, container, { clean = true }) {
    if (clean) {
        container.innerHTML = '';
    }


    movies.forEach(movie => {
        const movieListContainerInfo = document.createElement('div');
        const movieImg = document.createElement('img');
        const titleMovie = document.createElement('h3');
        const textTitleMovie = document.createTextNode(`${movie.title}`)
        const figureContainerImg = document.createElement('figure');

        movieImg.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        })

        movieListContainerInfo.classList.add('movieList__container-info');
        movieImg.classList.add('movieList__img');
        titleMovie.classList.add('movieList__title-movie');
        figureContainerImg.classList.add('figureContainerImg')
        figureContainerImg.classList.add('skeleton');
        titleMovie.classList.add('skeleton');

        titleMovie.setAttribute('title', movie.title)
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('data-img', 'http://image.tmdb.org/t/p/w342' + movie.poster_path);


        const movieBtn = document.createElement('button');

        movieBtn.classList.add('liked__btn');
        const movieBtnHeart = document.createElement('i');

        movieBtnHeart.classList.add('fa-solid');
        movieBtnHeart.classList.add('fa-heart');
        movieBtn.appendChild(movieBtnHeart);

        likedMoviesList()[movie.id] && movieBtn.classList.toggle('fa-heart--like');
        movieBtn.addEventListener('click', () => {
            console.log('me agregaste a favoritos');
            movieBtn.classList.toggle('fa-heart--like');
            //save in LS
            likeMovie(movie);
            //I called getLikedMovies to refresh the liked movie section at the moment you press a likedBtn;
            getLikedMovies();
        })

        observador.observe(movieImg);

        if (movie.poster_path != null) {
            titleMovie.appendChild(textTitleMovie);
            container.appendChild(movieListContainerInfo)
            figureContainerImg.appendChild(movieImg);
            movieListContainerInfo.appendChild(figureContainerImg)
            movieListContainerInfo.appendChild(titleMovie);
            figureContainerImg.appendChild(movieBtn)
        }

        movieImg.addEventListener('load', () => {
            figureContainerImg.classList.remove('skeleton');
            titleMovie.classList.remove('skeleton');
        })

    });
}


// LLamados a la API

async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day', {
        params: {
            language: lang
        }
    });
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

        movie.addEventListener('click', () => {
            trendingPreview.style.background = `linear-gradient(0deg, rgba(0,0,0,0.3),rgba(0,0,0,0.3)), url(https://image.tmdb.org/t/p/original${movies[index].backdrop_path}) no-repeat`;
            trendingPreview.style.backgroundSize = 'cover';
            movieTitleTrending.textContent = movies[index].title;
        })
    })
}

const getRecommendationPreview = async () => {
    const { data } = await api(`movie/13/recommendations`, {
        params: {
            language: lang
        }
    })
    const movies = data.results;
    const movieListContainer = document.getElementById('containerRecommendation');
    createMovies(movies, movieListContainer, { clean: true });
    movieListContainer.scrollTo(0, 0);
}

const getTopRatedPreview = async () => {
    const { data } = await api(`movie/top_rated?page=1`, {
        params: {
            language: lang,
        }
    });
    const movies = data.results;
    const topRatedMoviesContainer = document.getElementById('topRatedMovies');
    createMovies(movies, topRatedMoviesContainer, { clean: true });

    topRatedMoviesContainer.scrollTo(0, 0);
}

const getMoviesByGenres = async (id) => {
    const { data } = await api(`discover/movie`, {
        params: {
            with_genres: id,
            language: lang,
        }
    });
    const movies = data.results;
    const genericList = document.getElementById('genericList');

    createMovies(movies, genericList, { clean: true });
}

const getMoviesBySearch = async (query) => {
    const { data } = await api(`search/movie`, {
        params: {
            query: query,
            language: lang,
        }
    });

    const moviesAndSeries = data.results;
    const genericList = document.getElementById('genericList');
    if (data.results.length === 0) {
        const genericListSearchError = document.querySelector('.genericListError');
        genericListSearchError.innerHTML = '';


        const h2Error = document.createElement('h2');
        const imgError = document.createElement('img');

        genericListSearchError.classList.remove('inactive');
        imgError.classList.add('genericListImgError');
        h2Error.classList.add('genericListErrorTitle');

        h2Error.textContent = `We don't find the Movie`;
        imgError.setAttribute('src', './src/img/Untitled design.jpg');

        genericListSearchError.appendChild(imgError);
        genericListSearchError.appendChild(h2Error);
    }

    createMovies(moviesAndSeries, genericList, { clean: true });
    genericListTitle.textContent = '';
}

const getTrendingMovies = async () => {
    const { data } = await api(`trending/movie/day`, {
        params: {
            language: lang,
        }
    });
    const movies = data.results;
    const genericList = document.getElementById('genericList');


    createMovies(movies, genericList, { clean: true });
}

const getMovieById = async (id) => {
    const { data: movie } = await api(`movie/${id}`, {
        params: {
            language: lang,
        }
    });

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


        li.addEventListener('click', () => {
            location.hash = `#category=${genres.id}-${genres.name}`;
        })
    });

    getRelatedMoviesId(id);

}

const ulMovieList = document.createElement('ul');
const getRelatedMoviesId = async (id) => {
    const { data } = await api(`movie/${id}/recommendations`, {
        params: {
            language: lang,
        }
    });
    const movieRecommendations = data.results;

    const movieInfoContainer = document.querySelector('.movie-info__container');
    movieInfoContainer.appendChild(ulMovieList);
    ulMovieList.innerHTML = '';

    if (movieRecommendations.length === 0) {
        ulMovieList.remove();

    }

    movieRecommendations.forEach((movie) => {
        const liMovieList = document.createElement('li');
        const imgMovieList = document.createElement('img');

        liMovieList.classList.add('movie-info__recommendations-item');
        imgMovieList.classList.add('movie-info__img');
        liMovieList.classList.add('skeleton');

        imgMovieList.setAttribute('data-img', 'http://image.tmdb.org/t/p/w342' + movie.poster_path);
        imgMovieList.setAttribute('alt', movie.title);

        imgMovieList.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        })

        const movieBtn = document.createElement('button');

        movieBtn.classList.add('liked__btn');
        const movieBtnHeart = document.createElement('i');

        movieBtnHeart.classList.add('fa-solid');
        movieBtnHeart.classList.add('fa-heart');
        movieBtn.appendChild(movieBtnHeart);

        likedMoviesList()[movie.id] && movieBtn.classList.toggle('fa-heart--like');
        movieBtn.addEventListener('click', () => {
            console.log('me agregaste a favoritos');
            movieBtn.classList.toggle('fa-heart--like');
            //save in LS
            likeMovie(movie);

            //I called getLikedMovies to refresh the liked movie section at the moment you press a likedBtn;
            getLikedMovies();
        })

        observador.observe(imgMovieList)

        if (movie.poster_path != null) {
            ulMovieList.appendChild(liMovieList);
            liMovieList.appendChild(imgMovieList);
            ulMovieList.classList.add('movie-info__recommendations-list');
            ulMovieList.classList.add('scrollStyle');
            liMovieList.appendChild(movieBtn)
        }


        imgMovieList.addEventListener('load', () => {
            liMovieList.classList.remove('skeleton');
        })
    })
};

const getPaginatedGenres = async () => {

    const [_, genresData] = location.hash.split('='); // => ['#category', 'id-name'];
    const [genresId] = genresData.split('-');


    getPaginated(`discover/movie`, { genresId })
}

const getPaginatedSearch = async () => {

    const [_, query] = location.hash.split('='); // => ['#search', 'buscador'];

    getPaginated(`search/movie`, { query })
}


const h2EmptyList = document.createElement('h2');

h2EmptyList.classList.add('emptyFavoriteList');
h2EmptyList.textContent = `You haven't favorite movies yet.`;
function getLikedMovies() {

    const likedMovies = likedMoviesList();


    const likedMoviesContainer = document.getElementById('LikedMovies');
    likedMoviesContainer.innerHTML = '';
    const likedMoviesArray = Object.values(likedMovies);

    if (likedMoviesArray.length === 0) {
        likedMoviesContainer.appendChild(h2EmptyList);
    } else {
        createMovies(likedMoviesArray, likedMoviesContainer, { clean: true });
    }

}

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
    getPaginatedGenres,
    api,
    createMovies,
    getPaginatedSearch,
    getLikedMovies,
}





