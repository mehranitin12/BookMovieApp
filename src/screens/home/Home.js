import React, { useEffect, useState } from "react";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import "./Home.css";
import {
  Card,
  GridList,
  GridListTile,
  GridListTileBar,
  Typography,
  CardContent,
  FormControl,
  Button,
  InputLabel,
  Input,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

const theme = createMuiTheme;
({
  palette: {
    primary: { light: "#42a5f5" },
  },
});

const Home = (props) => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [movieName, setMovieName] = useState("");
  const [genreList, setGenreList] = useState([]);
  const [artistsNameList, setArtistNameList] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [releaseDateStart, setReleaseDateStart] = useState("");
  const [releaseDateEnd, setReleaseDateEnd] = useState("");
  const [releasedMovies, setReleasedMovies] = useState([]);

  useEffect(() => {
    async function checkTheResponse() {
      //  Fetching upcoming movies
      const upcomingMoviesUrl = props.baseUrl + "movies?status=PUBLISHED";
      const rawResponseUpcomingMovies = await fetch(upcomingMoviesUrl, {
        method: "GET",
        headers: {
          Accept: "application/json;charset=UTF-8",
        },
      });
      const responseUpcomingMovies = await rawResponseUpcomingMovies.json();
      setUpcomingMovies((arr) => [...arr, ...responseUpcomingMovies.movies]);
      //console.log(`Movie List: ${responseUpcomingMovies.movies}`);

      // fetch released movies
      const releasedMoviesUrl = props.baseUrl + "movies?status=RELEASED";
      const rawResponseReleasedMovies = await fetch(releasedMoviesUrl, {
        method: "GET",
        headers: {
          Accept: "application/json;charset=UTF-8",
        },
      });
      const responseReleasedMovies = await rawResponseReleasedMovies.json();
      setReleasedMovies((arr) => [...arr, ...responseReleasedMovies.movies]);
      //console.log(`Movie List: ${responseReleasedMovies.movies}`);

      // Fetching movies by genre
      const movieByGenreUrl = "http://localhost:8085/api/v1/genres";
      const rawResponseMovieByGenre = await fetch(movieByGenreUrl, {
        method: "GET",
        headers: {
          Accept: "application/json;charset=UTF-8",
        },
      });
      const responseMovieByGenre = await rawResponseMovieByGenre.json();
      const genreNameArray = responseMovieByGenre.genres.map((option) => {
        return option.genre;
      });
      setGenreList((checker) => [...checker, ...genreNameArray]);
      //console.log(`Movie By Genre: ${genreNameArray}`);

      // Fetching movies by artist
      const movieByArtistUrl = "http://localhost:8085/api/v1/artists";
      const rawResponseMovieByArtist = await fetch(movieByArtistUrl, {
        method: "GET",
        headers: {
          Accept: "application/json;charset=UTF-8",
        },
      });
      const responseMovieByArtist = await rawResponseMovieByArtist.json();
      const artistNameArray = responseMovieByArtist.artists.map((option) => {
        return option.first_name + " " + option.last_name;
      });
      setArtistNameList((arr) => [...arr, ...artistNameArray]);
      //console.log(`Movie By Artist: ${artistNameArray}`);
    }

    checkTheResponse();
  }, []);

  //filter results - Find Movie By
  const handleFilter = async () => {
    let initialResponse = "?status=RELEASED";

    if (movieName !== "") {
      initialResponse += "&title=" + movieName;
    }
    if (selectedGenre.length > 0) {
      initialResponse += "&genres=" + selectedGenre.toString();
    }
    if (selectedArtist.length > 0) {
      initialResponse += "&artists=" + selectedArtist.toString();
    }
    if (releaseDateStart !== "") {
      initialResponse += "&start_date=" + releaseDateStart;
    }
    if (releaseDateEnd !== "") {
      initialResponse += "&end_date=" + releaseDateEnd;
    }

    const rawResponse = await fetch(
      props.baseUrl + "movies" + encodeURI(initialResponse),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );

    const response = await rawResponse.json();
    //console.log(response.movies);
    setReleasedMovies(response.movies);
  };

  //handle changes in artist selection
  const handleChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelectedArtist(
        selectedArtist.length === artistsNameList.length ? [] : artistsNameList
      );
      return;
    }
    setSelectedArtist(value);
  };

  //handle changes in genre selection
  const handleGenreChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelectedGenre(
        selectedArtist.length === genreList.length ? [] : genreList
      );
      return;
    }
    setSelectedGenre(value);
  };

  return (
    <div>
      <div className="home-container">
        <Header baseUrl={props.baseUrl} />

        <div className="upcoming-movies-header">Upcoming Movies</div>

        {/* Grid of upcoming movies starts */}
        <GridList className="custom-grid" cols={6} cellHeight={250}>
          {upcomingMovies.map((tile) => (
            <GridListTile key={tile.poster_url}>
              <img src={tile.poster_url} alt={tile.title} />
              <GridListTileBar title={tile.title} />
            </GridListTile>
          ))}
        </GridList>
        {/* Grid of upcoming movies ends */}

        {/* Grid of released movies starts */}
        <div className="home-details">
          <div className="movie-display">
            <GridList cols={4} className="movie-home-grid" cellHeight={350}>
              {releasedMovies.map((movie) => (
                <GridListTile
                  key={movie.poster_url}
                  rows={1}
                  onClick={() => props.history.push("/movie/" + movie.id)}
                  key={"grid" + movie.id}
                >
                  {/* <Link to={`/movie/${movie.id}`}> */}
                  <img
                    className="movie-image"
                    src={movie.poster_url}
                    alt={movie.title}
                    width="100%"
                    height="100%"
                  />
                  <GridListTileBar
                    title={movie.title}
                    subtitle={
                      <span>
                        Release Date:{" "}
                        {new Date(movie.release_date).toDateString()}
                      </span>
                    }
                  />
                  {/* </Link> */}
                </GridListTile>
              ))}
            </GridList>
          </div>
          {/* Grid of released movies ends */}

          {/* Right side - Find movies by search starts */}
          <div className="movie-filter">
            <Card sx={{ minWidth: 240 }}>
              <CardContent>
                {/* <MuiThemeProvider theme={theme}> */}
                <Typography variant="subheading" color="primary">
                  {" "}
                  FIND MOVIES BY:
                </Typography>
                {/* </MuiThemeProvider> */}
                <div>
                  <FormControl className="filter-forms">
                    <FormControl>
                      <InputLabel htmlFor="moviesName">Movie Name</InputLabel>
                      <Input
                        id="movieName"
                        value={movieName}
                        onChange={(e) => setMovieName(e.target.value)}
                      />
                    </FormControl>
                    <FormControl>
                      <InputLabel id="multiple-genre">Genres</InputLabel>
                      <Select
                        value={selectedGenre}
                        multiple
                        onChange={handleGenreChange}
                        renderValue={(selectedGenre) =>
                          selectedGenre.join(" , ")
                        }
                      >
                        {genreList.map((option) => (
                          <MenuItem key={option} value={option}>
                            <ListItemIcon>
                              <Checkbox
                                checked={selectedGenre.indexOf(option) > -1}
                              />
                            </ListItemIcon>
                            <ListItemText primary={option} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <InputLabel id="mutiple-select-label">Artists</InputLabel>
                      <Select
                        multiple
                        value={selectedArtist}
                        onChange={handleChange}
                        renderValue={(selected) => selected.join(", ")}
                      >
                        {artistsNameList.map((option) => (
                          <MenuItem key={option} value={option}>
                            <ListItemIcon>
                              <Checkbox
                                checked={selectedArtist.indexOf(option) > -1}
                              />
                            </ListItemIcon>
                            <ListItemText primary={option} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <br />
                    <TextField
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={releaseDateStart}
                      label="Release Date Start"
                      placeholder="dd-mm-yyyy"
                      onChange={(e) => setReleaseDateStart(e.target.value)}
                    />{" "}
                    <br />
                    <TextField
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={releaseDateEnd}
                      label="Release Date End"
                      placeholder="dd-mm-yyyy"
                      onChange={(e) => setReleaseDateEnd(e.target.value)}
                    />
                    <br />
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleFilter}
                    >
                      APPLY
                    </Button>
                  </FormControl>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Right side search filter ends */}
        </div>
      </div>
    </div>
  );
};

export default Home;
