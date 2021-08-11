// Initial Values
const API_KEY = 'dcbc19d464f35318a77eff826c3de670';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500'

const url = 'https://api.themoviedb.org/3/search/movie?api_key=dcbc19d464f35318a77eff826c3de670';

// Selecting elements from Dom

const buttonElement = document.querySelector('#search');
const inputElement = document.querySelector('#inputValue');
const movieSearchable = document.querySelector('#movies-searchable');
const movieContainer = document.querySelector('#movies-container');
// const imgElement = document.querySelector('#movies-searchable');

function generateUrl(path)
{
    const url = `https://api.themoviedb.org/3${path}?api_key=dcbc19d464f35318a77eff826c3de670`;
    return url;
}


function requestMovies(url, onComplete, onError) {
    fetch(url)
         .then((res) => res.json())
         .then(onComplete)
         .catch(onError)
        
}



function movieSection(movies) {

    const section = document.createElement('section');
    section.classList = 'section';

    movies.map((movie) => {
       if(movie.poster_path)
       {
           const img = document.createElement('img');
           img.src = IMAGE_URL + movie.poster_path; 
           img.setAttribute('data-movie-id', movie.id);

           section.appendChild(img);
       }
    })

    return section;
}


function createMovieContainer(movies, title = ' ') {
    const movieElement = document.createElement('div');
    movieElement.setAttribute('class', 'movie');

    const header = document.createElement('h2');
    header.innerHTML = title;

    const content = document.createElement('div');
    content.classList = 'content';

    const contentClose = `<p id="content-close">X</p>`

    content.innerHTML = contentClose;


    const section = movieSection(movies);

    movieElement.appendChild(header);
    movieElement.appendChild(section);
    movieElement.appendChild(content);
    return movieElement;
}


function renderSearchMovies(data){
    movieSearchable.innerHTML = ' ';
    const movies = data.results;
    const movieBlock = createMovieContainer(movies);
    movieSearchable.appendChild(movieBlock);
}

function renderMovies(data){
    const movies = data.results;
    const movieBlock = createMovieContainer(movies, this.title);
    movieContainer.appendChild(movieBlock);
}

function searchMovie(value){
    const path = '/search/movie';
    const url = generateUrl(path) + '&query=' + value;
    requestMovies(url, renderSearchMovies, handleError)
}

function getUpcomingMovie(){
    const path = '/movie/upcoming';
    const url = generateUrl(path);
    const render = renderMovies.bind({title: 'Upcoming Movies'});
    requestMovies(url, render, handleError)
}

function getTopRatedMovies(){
    const path = '/movie/top_rated';
    const url = generateUrl(path);
    const render = renderMovies.bind({title: 'Top Rated Movies'});
    requestMovies(url, render, handleError)
}


function getPopularMovies(){
    const path = '/movie/popular';
    const url = generateUrl(path);
    const render = renderMovies.bind({title: 'Popular Movies'});
    requestMovies(url, render, handleError)
}

function handleError(error)
{
    console.log('Error', error);
}

buttonElement.onclick = function(event) {
    event.preventDefault(); 
    const value = inputElement.value;
    searchMovie(value);
    
    inputElement.value = '';  
    console.log('Value: ', value);
}

function createIframe(video)
{
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${video.key}`
    iframe.width = 360;
    iframe.height = 315;
    iframe.allowFullscreen = true;

    return iframe;
}


function createVideoTemplate(data, content)
{
    // TODO LIST
    // Display Movie Video
    content.innerHTML = '<p id="content-close">X</p>'
    console.log('Videos: ', data);
    const videos = data.results;
    const length = videos.length > 4 ? 4 : videos.length;
    const iframeContainer = document.createElement('div');

    for(let i=0; i<length; i++){
        const video = videos[i];
        const iframe = createIframe(video);
        iframeContainer.appendChild(iframe);
        content.appendChild(iframeContainer);
    }
}

// Event Delegation
document.onclick = function(event) {

    const target = event.target;

    if(target.tagName.toLowerCase() === 'img')
    {
        const movieId = target.dataset.movieId;
        console.log('Movie ID: ', movieId);
        const section = event.target.parentElement;
        const content = section.nextElementSibling;
        content.classList.add('content-display');

        const path = `/movie/${movieId}/videos`;
        const url = generateUrl(path);
        // fetch movie videos
        fetch(url)
            .then((res) => res.json())
            .then((data) => createVideoTemplate(data, content))
                

            .catch((error) => {
                    console.log('Error: ', error);

            });
    }

    if(target.id === 'content-close')
    {
        const content = target.parentElement;
        content.classList.remove('content-display');
    }
    
}

searchMovie('Breaking Bad')
getUpcomingMovie();
getTopRatedMovies();
getPopularMovies();