import React, { useState, useEffect } from "react";
import "./Details.css";
import Header from "../../common/header/Header";
import {
  GridList,
  GridListTile,
  GridListTileBar,
  Typography,
} from "@material-ui/core";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import YouTube from "react-youtube";
import { Link } from "react-router-dom";

const Details = (props) => {
  const ratingObject = [
    {
      id: 1,
      color: "black",
    },
    {
      id: 2,
      color: "black",
    },
    {
      id: 3,
      color: "black",
    },
    {
      id: 4,
      color: "black",
    },
    {
      id: 5,
      color: "black",
    },
  ];

  const [Movie, setMovie] = useState({});
  const [ratings, setRatings] = useState(ratingObject);

  const youtubeVideo = {
    height: "300",
    width: "700",
    playerVars: {
      autoplay: 1,
    },
  };

  useEffect(() => {
    //Fetch single movie
    async function checkTheResponse() {
      const rawResponse = await fetch(
        props.baseUrl + "movies/" + props.match.params.id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        }
      );

      const response = await rawResponse.json();
      console.log(response);
      setMovie(response);
    }
    checkTheResponse();
  }, []);

  const ratingsHandler = (rating) => {
    let starsList = [];
    for (let rate of ratings) {
      let temp = rate;
      if (rate.id <= rating) {
        temp.color = "yellow";
      } else {
        temp.color = "black";
      }
      starsList.push(temp);
    }

    setRatings(starsList);
  };

  return (
    <div className="details">
      <Header
        id={props.match.params.id}
        baseUrl={props.baseUrl}
        showBookShowButton={true}
      />
      {/* Left part starts */}
      <div className="back-button">
        <Typography>
          <Link style={{ textDecoration: "none" }} to="/">
            &#60; Back to Home
          </Link>
        </Typography>
      </div>
      {Movie !== {} && (
        <div className="details-page-flex-view">
          <div className="details-page-flex-view-left">
            <img src={Movie.poster_url} alt={Movie.title} />
          </div>
          {/* Left part ends */}
          {/* Middle part starts */}
          <div className="details-page-flex-view-middle">
            <div>
              <Typography variant="h2">{Movie.title}</Typography>
            </div>
            <br />
            <div>
              <Typography>
                <span className="bold-text">Genres: </span>{" "}
                {Movie.genres && Movie.genres.join(", ")}
              </Typography>
            </div>
            <div>
              <Typography>
                <span className="bold-text">Duration:</span> {Movie.duration}
              </Typography>
            </div>
            <div>
              <Typography>
                <span className="bold-text">Release Date:</span>{" "}
                {new Date(Movie.release_date).toDateString()}
              </Typography>
            </div>
            <div>
              <Typography>
                <span className="bold-text"> Rating:</span>{" "}
                {Movie.critics_rating}{" "}
              </Typography>
            </div>
            <div className="margin-top-16">
              <Typography>
                <span className="bold-text">Plot:</span>{" "}
                <a href={Movie.wiki_url}>Wiki Link</a> {Movie.storyline}{" "}
              </Typography>
            </div>
            <div className="margin-top-16">
              <Typography>
                <span className="bold-text">Trailer:</span>
              </Typography>
              <YouTube
                videoId={Movie.trailer_url && Movie.trailer_url.split("?v=")[1]}
                opts={youtubeVideo}
              />
            </div>
          </div>
          {/* Middle part ends */}
          {/* Right part starts */}
          <div className="details-page-flex-view-right">
            <Typography>
              <span className="bold-text">Rate this movie: </span>
            </Typography>
            {ratings.map((star) => (
              <StarBorderIcon
                style={{ color: star.color }}
                key={"star" + star.id}
                onClick={() => ratingsHandler(star.id)}
              />
            ))}

            <div className="bold-text margin-bottom-16 margin-top-16">
              <Typography>
                <span className="bold-text">Artists:</span>
              </Typography>
            </div>
            <div>
              <GridList rowHeight={160} cols={2}>
                {Movie.artists &&
                  Movie.artists.map((artist) => (
                    <GridListTile key={artist.id}>
                      <img
                        src={artist.profile_url}
                        alt={artist.first_name + " " + artist.last_name}
                      />
                      <GridListTileBar
                        title={artist.first_name + " " + artist.last_name}
                      />
                    </GridListTile>
                  ))}
              </GridList>
            </div>
          </div>
          {/* Right part ends */}
        </div>
      )}
    </div>
  );
};

export default Details;
