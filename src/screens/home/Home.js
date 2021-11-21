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

const Home = (props) => {
  const [movieList, setMovieList] = useState([]);
  const [movieName, setMovieName] = useState("");
  const [genreList, setGenreList] = useState([]);
  const [artistsNameList, setArtistNameList] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [releaseDateStart, setReleaseDateStart] = useState("");
  const [releaseDateEnd, setReleaseDateEnd] = useState("");
  const [filteredMovie, setFilteredMovie] = useState([]);

  useEffect(() => {
    async function checkTheResponse() {
      //  Fetching movie list
      const movieListUrl =
        "http://localhost:8085/api/v1/movies/?page=1&limit=10";
      const rawResponseMovieList = await fetch(movieListUrl, {
        method: "GET",
        headers: {
          Accept: "application/json;charset=UTF-8",
        },
      });
      const responseMovieList = await rawResponseMovieList.json();
      setMovieList((arr) => [...arr, ...responseMovieList.movies]);
      setFilteredMovie((arr) => [...arr, ...responseMovieList.movies]);
      console.log(`Movie List: ${responseMovieList.movies}`);

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
      console.log(`Movie By Genre: ${genreNameArray}`);

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
      console.log(`Movie By Artist: ${artistNameArray}`);
    }

    checkTheResponse();
  }, []);

  //filter handling
  const handleFilter = async () => {
    setFilteredMovie(
      movieList
        .filter((movie) => movie.title.startsWith(movieName))
        .filter((movie) => {
          if (selectedGenre.length > 0)
            return movie.genres.some((x) => selectedGenre.indexOf(x) > -1);
          else return movie;
        })
        .filter((movie) => {
          if (selectedArtist.length > 0 && movie.artists) {
            return movie.artists.some(
              (x) =>
                selectedArtist.indexOf(x.first_name + " " + x.last_name) > -1
            );
          } else {
            return movie;
          }
        })
        .filter((movie) => {
          let givenDate = new Date(releaseDateStart);
          let movieDate = new Date(movie.release_date);
          if (releaseDateStart.length > 0) {
            if (givenDate < movieDate) {
              return movie;
            } else {
              return null;
            }
          } else {
            return movie;
          }
        })
        .filter((movie) => {
          let movieDate = new Date(movie.release_date);
          let givenDate = new Date(releaseDateEnd);
          if (releaseDateEnd.length > 0) {
            if (givenDate > movieDate) {
              return movie;
            } else {
              return null;
            }
          } else {
            return movie;
          }
        })
    );
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
        <Header />

        <div className="homePageHeader">Upcoming Movies</div>

        {/* Grid of upcoming movie starts */}
        <GridList className="custom-grid" cols={6} cellHeight={250}>
          {movieList.map((tile) => (
            <GridListTile key={tile.poster_url}>
              <img src={tile.poster_url} alt={tile.title} />
              <GridListTileBar title={tile.title} />
            </GridListTile>
          ))}
        </GridList>
        {/* Grid of upcoming movie ends */}

        {/* Grid of movies display starts */}
        <div className="home-details">
          <div className="movie-display">
            <GridList cols={4} className="movie-home-grid" cellHeight={350}>
              {filteredMovie.map((movie) => (
                <GridListTile key={movie.poster_url} rows={1}>
                  <Link to={`/movie/${movie.id}`}>
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      width="100%"
                      height="100%"
                    />
                    <GridListTileBar title={movie.title} />
                  </Link>
                </GridListTile>
              ))}
            </GridList>
          </div>
          {/* Grid of movies display starts */}

          {/* Right side search filter starts */}
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
                      <InputLabel id="multiple-genre">Genre</InputLabel>
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
                    <TextField
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={releaseDateStart}
                      label="Release date start"
                      placeholder="dd-mm-yyyy"
                      onChange={(e) => setReleaseDateStart(e.target.value)}
                    />
                    <TextField
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={releaseDateEnd}
                      label="Release date end"
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
