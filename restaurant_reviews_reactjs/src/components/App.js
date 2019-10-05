import "./App.css";
import React, { Component } from "react";
import { load_google_maps } from "../api/googlemaps";
import { getGoogleImage } from "../api/googlemaps";
import Sidebar from "./Sidebar";
import RatingsFilter from "./RatingsFilter";
import AddRestaurants from "./AddRestaurants";
import Header from "./Header";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: null,
      lon: null,
      places: [],
      placeReviews: {},
      localPlaceReviews: {},
      filteredPlaces: [],
      newReviewList: [],
      newMarkersArr: [],
      newReviews: [],
      newReviewsNewRestaurants: [],
      newRestaurantName: "",
      newRestaurantAddress: "",
      newRestaurantRating: "",
      newRestaurantFeedback: "",
      currentClickLocation: null,
      randomID: ""
    };
  }

  componentDidMount() {
    // Load Google maps API from api/googlemaps.js
    let get_google = load_google_maps();

    // Get the the local JSON data from api/restaurants.json
    let localJson = require("../api/restaurants.json");

    // Get the user coordinate
    window.navigator.geolocation.getCurrentPosition(
      position =>
        this.setState({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        }),
      err => console.log(err)
    );

    Promise.all([get_google])
      .then(values => {
        let google = values[0];
        this.google = google;
        this.places = [];
        this.markers = [];
        this.placeReviewsObj = {};
        this.localPlaceReviewsObj = {};
        this.currentPos = new google.maps.LatLng(
          this.state.lat,
          this.state.lon
        );
        this.infowindow = new google.maps.InfoWindow({
          maxWidth: 450
        });
        this.results = [];
        this.newMarkers = [];
        this.newMarkersObj = {};
        this.map = new google.maps.Map(document.getElementById("map"), {
          zoom: 18,
          center: {
            lat: this.state.lat,
            lng: this.state.lon
          },
          styles: [
            {
              featureType: "poi",
              stylers: [{ visibility: "off" }]
            }
          ]
        });

        // Google places library, place details Requests
        let service = new google.maps.places.PlacesService(this.map);

        // Icon for the restaurants marker
        let markerIcon = {
          url: "http://maps.google.com/mapfiles/kml/shapes/dining.png",
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        let showLocalJSON = locals => {
          // Push data from local JSON to this.places
          for (let i = 0; i < locals.length; i++) {
            this.places.push(locals[i]);
          }

          // Get the local place reviews
          locals.forEach(local => {
            let localPlaceID = local.place_id;
            let localPlaceReviews = local.reviews;

            /* Push the local place reviews that are associated with the place ID 
            to the localPlaceReviewsObj and set the localPlaceReviews state */
            for (let localPlaceDetail in local) {
              this.localPlaceReviewsObj[localPlaceID] = localPlaceReviews;
            }
            this.setState({ localPlaceReviews: this.localPlaceReviewsObj });
          });
        };

        showLocalJSON(localJson);

        /* Search the nearest restaurants from the Google places library
        based on the current user coordinate */
        service.nearbySearch(
          { location: this.currentPos, radius: "150", type: ["restaurant"] },
          (results, status) => {
            // console.log(results);
            if (status !== "OK") return;

            results.forEach(result => {
              if (result.rating !== undefined) {
                this.results.push(result);
              }
            });

            for (let i = 0; i < this.results.length; i++) {
              let places = this.results[i];
              let request = {
                placeId: places.place_id,
                fields: [
                  "geometry",
                  "name",
                  "place_id",
                  "rating",
                  "reviews",
                  "user_ratings_total",
                  "vicinity"
                ]
              };

              // Get the place details
              service.getDetails(request, (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                  console.log(place);

                  let placeID = place.place_id;
                  let placeReviews = place.reviews;

                  /* Push place reviews that are associated with the place ID to the placeReviewsObj 
                  and set the placeReviews state */
                  for (let placeDetail in place) {
                    this.placeReviewsObj[placeID] = placeReviews;
                  }
                  this.setState({ placeReviews: this.placeReviewsObj });
                }
              });
            }
            viewMarkers(this.results);
          }
        );

        // Event listener to add new markers
        google.maps.event.addListener(this.map, "click", event => {
          let addRestaurant = document.getElementById("addRestaurant");
          // Create random ID for the new restaurant
          let randomID = () => {
            return (
              "_" +
              Math.random()
                .toString(36)
                .substr(2, 9)
            );
          };
          this.setState({ randomID: randomID() }, () => {});

          if (
            addRestaurant.style.display === "" ||
            addRestaurant.style.display === "none"
          ) {
            addRestaurant.style.display = "block";
            addTempMarker(event.latLng);
            this.setState({ currentClickLocation: event.latLng }, () => {});
          } else {
            addRestaurant.style.display = "none";
          }
        });

        let contactFormBtn = document.querySelector(".contactForm__button");

        contactFormBtn.addEventListener("click", () => {
          if (
            this.state.newRestaurantName !== "" &&
            this.state.newRestaurantAddress !== "" &&
            this.state.newRestaurantRating >= 0 &&
            this.state.newRestaurantFeedback !== ""
          ) {
            addMarker();
          }
        });

        // Add new markers
        let addMarker = () => {
          let additionalMarkers = new google.maps.Marker({
            map: this.map,
            id: this.state.randomID,
            position: this.state.currentClickLocation,
            lat: this.state.currentClickLocation.lat(),
            lng: this.state.currentClickLocation.lng(),
            animation: google.maps.Animation.DROP,
            title: this.state.newRestaurantName,
            rating: parseInt(this.state.newRestaurantRating),
            icon: markerIcon
          });
          this.markers.push(additionalMarkers);

          // Event listener for the new markers
          google.maps.event.addListener(additionalMarkers, "click", () => {
            /* Get the right value from the add new restaurant form 
            to display on infowindow */
            let viewNewMarkers = position => {
              position = additionalMarkers.position;
              let filteredNewMarkerArr = [];

              this.state.newMarkersArr.forEach(additionalMarker => {
                if (additionalMarker.position === position) {
                  filteredNewMarkerArr.push(additionalMarker);
                }
              });

              return filteredNewMarkerArr;
            };
            let selectedNewMarker = viewNewMarkers();

            /* Get the right value from the newly added review of the new restaurant 
            to display on infowindow */
            let viewNewReviewsNewMarkers = position => {
              position = additionalMarkers.position;
              let filteredNewReviewsNewMarkerArr = [];

              this.state.newReviews.forEach(review => {
                if (review.position === position) {
                  filteredNewReviewsNewMarkerArr.push(review);
                }
              });
              return filteredNewReviewsNewMarkerArr;
            };
            let selectedNewReviewsNewMarker = viewNewReviewsNewMarkers();

            // Content for the infowindow of the new markers
            let newMarkerBox = `
              <div class="reviewBox">
              <h4>${additionalMarkers.title}</h4>
                <div class="reviewText">${selectedNewMarker
                  .map(marker => {
                    return (
                      "<p>Rating: " +
                      marker.reviews.rating +
                      "</p>" +
                      '<p class="text">Review: ' +
                      marker.reviews.text +
                      "</p>"
                    );
                  })
                  .join("")}
                  <div class="reviewNewText">${selectedNewReviewsNewMarker
                    .map(review => {
                      return (
                        "<p>Rating: " +
                        review.rating +
                        "</p>" +
                        '<p class="text">Review: ' +
                        review.feedback +
                        "</p>"
                      );
                    })
                    .join("")}
                </div>
                <img class="streetview" src=${getGoogleImage(
                  additionalMarkers
                )} alt="Streetview"/>
              </div>`;

            // Show infowindow when a new marker is clicked
            this.infowindow.setContent(newMarkerBox);
            this.infowindow.open(this.map, additionalMarkers);
          });
        };
        // End add new markers

        // Add new temporary marker
        let addTempMarker = location => {
          let newTempMarker = new google.maps.Marker({
            position: location,
            map: this.map,
            visible: false
          });

          this.newMarkers.push(newTempMarker);
        };

        // Create Markers from the Google places library
        let viewMarkers = places => {
          for (let place of places) {
            let restaurantsMarkers = new google.maps.Marker({
              map: this.map,
              id: place.place_id,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              position: place.geometry.location,
              icon: markerIcon,
              title: place.name,
              animation: google.maps.Animation.DROP,
              rating: place.rating
            });
            this.places.push(place);
            this.markers.push(restaurantsMarkers);
            this.setState({ places: this.places });
            this.setState({ filteredPlaces: this.places });

            restaurantsMarkers.addListener("click", () => {
              // Add a bounce effect when the restaurant marker is clicked
              if (restaurantsMarkers.getAnimation() !== null) {
                restaurantsMarkers.setAnimation(null);
              } else {
                restaurantsMarkers.setAnimation(google.maps.Animation.BOUNCE);
              }
              setTimeout(() => {
                restaurantsMarkers.setAnimation(null);
              }, 1500);
            });

            // Event listener for the existing restaurants
            google.maps.event.addListener(restaurantsMarkers, "click", () => {
              /* Get the right value from existing restaurants 
              to display on infowindow */
              let filterReviews = restaurantID => {
                restaurantID = restaurantsMarkers.id;
                let filteredReviews = {};

                for (let review in this.state.placeReviews) {
                  // Check if the ID exist
                  if (restaurantID.indexOf(review) > -1) {
                    filteredReviews[review] = this.state.placeReviews[review];
                    return filteredReviews;
                  }
                }
              };

              let selectedReviews = filterReviews();
              let selectedReviewsById = selectedReviews[restaurantsMarkers.id];

              /* Get the right value from the newly added review of existing restaurants 
              to display on infowindow */
              let filterNewReviews = restaurantID => {
                restaurantID = restaurantsMarkers.id;
                let filteredNewReviewsArr = [];

                this.state.newReviews.forEach(review => {
                  if (review.id === restaurantID) {
                    filteredNewReviewsArr.push(review);
                  }
                });
                return filteredNewReviewsArr;
              };

              let selectedNewReviews = filterNewReviews();

              // Content for the infowindow
              let reviewBox = `
                <div class="reviewBox">
                  <h4>${restaurantsMarkers.title}</h4>    
                  <div class="reviewText">${selectedReviewsById
                    .map(review => {
                      return (
                        "<h5>Name: " +
                        review.author_name +
                        "</h5>" +
                        "<p>Rating: " +
                        review.rating +
                        "</p>" +
                        '<p class="text">Review: ' +
                        review.text +
                        "</p>"
                      );
                    })
                    .join("")}
                  <div class="reviewNewText">${selectedNewReviews
                    .map(review => {
                      return (
                        "<p>Rating: " +
                        review.rating +
                        "</p>" +
                        '<p class="text">Review: ' +
                        review.feedback +
                        "</p>"
                      );
                    })
                    .join("")}
                  </div>  
                  </div>
                  <img class="streetview" src=${getGoogleImage(
                    restaurantsMarkers
                  )} alt="Streetview"/>
                </div>`;

              // Show infowindow when a marker is clicked
              this.infowindow.setContent(reviewBox);
              this.infowindow.open(this.map, restaurantsMarkers);
            });
          }
        };
        // End viewMarkers

        // Create markers from local JSON
        let localMarker = places => {
          for (let place of places) {
            let localMarkers = new google.maps.Marker({
              map: this.map,
              id: place.place_id,
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng,
              position: place.geometry.location,
              title: place.name,
              animation: google.maps.Animation.DROP,
              rating: place.rating,
              icon: markerIcon
            });
            this.markers.push(localMarkers);

            // Event listener for the local markers
            google.maps.event.addListener(localMarkers, "click", () => {
              // Get the right value to display on infowindow
              let filterLocalReviews = restaurantID => {
                restaurantID = localMarkers.id;
                let filteredLocalReviews = {};

                for (let review in this.state.localPlaceReviews) {
                  // Check if the ID exist
                  if (restaurantID.indexOf(review) > -1) {
                    filteredLocalReviews[review] = this.state.localPlaceReviews[
                      review
                    ];
                    return filteredLocalReviews;
                  }
                }
              };
              let selectedLocalReviews = filterLocalReviews();

              let selectedLocalReviewsById =
                selectedLocalReviews[localMarkers.id];

              /* Get the right value from the newly added review
              to display on infowindow */
              let filterNewReviews = restaurantID => {
                restaurantID = localMarkers.id;
                let filteredNewReviewsArr = [];

                this.state.newReviews.forEach(review => {
                  if (review.id === restaurantID) {
                    filteredNewReviewsArr.push(review);
                  }
                });
                return filteredNewReviewsArr;
              };

              let selectedNewReviews = filterNewReviews();

              let reviewLocalJsonBox = `
                <div class="reviewBox">
                  <h4>${localMarkers.title}</h4>
                  <div class="reviewText">${selectedLocalReviewsById
                    .map(review => {
                      return (
                        "<p>Rating: " +
                        review.rating +
                        "</p>" +
                        '<p class="text">Review: ' +
                        review.text +
                        "</p>"
                      );
                    })
                    .join("")}
                    <div class="reviewNewText">${selectedNewReviews
                      .map(review => {
                        return (
                          "<p>Rating: " +
                          review.rating +
                          "</p>" +
                          '<p class="text">Review: ' +
                          review.feedback +
                          "</p>"
                        );
                      })
                      .join("")}
                    </div>
                  </div>
                  <img class="streetview" src=${getGoogleImage(
                    localMarkers
                  )} alt="Streetview"/>
                </div>`;

              // Show infowindow when a marker is clicked
              this.infowindow.setContent(reviewLocalJsonBox);
              this.infowindow.open(this.map, localMarkers);
            });
          }
        };
        // End localMarker

        localMarker(localJson);

        // Create a marker for the user position
        let userPosition = { lat: this.state.lat, lng: this.state.lon };
        let currentPosition = new google.maps.Marker({
          map: this.map,
          position: userPosition,
          animation: google.maps.Animation.DROP
        });

        // Star ratings
        let starRatings = () => {
          const starsTotal = 5;
          let ratings = {};

          this.state.places.forEach(place => {
            let placeID = place.place_id;
            ratings[placeID] = place.rating;
          });

          for (let rating in ratings) {
            let starPercentage = (ratings[rating] / starsTotal) * 100;
            let starPercentageRounded = `${Math.round(starPercentage / 10) *
              10}%`;
            let innerDivs = document.querySelectorAll(
              `.${rating} .stars-inner`
            );

            innerDivs.forEach(innerDiv => {
              innerDiv.style.width = starPercentageRounded;
            });
          }
        };
        starRatings();
      })
      .catch(error => {
        console.log(error);
        alert("Error loading page...");
      });
  }

  // Filter marker and places
  onFormSubmit = ratings => {
    let ratingsNum = Number(ratings);

    // Filter places based on the ratings
    let updatedFilteredPlaces = this.state.places.filter(place => {
      return place.rating >= ratingsNum;
    });

    this.setState({ filteredPlaces: updatedFilteredPlaces });

    // Filter marker based on the ratings
    this.state.filteredPlaces.forEach(filteredPlace => {
      this.markers.forEach(marker => {
        if (filteredPlace.place_id === marker.id) {
          marker.rating = filteredPlace.rating;
        }
        if (marker.rating >= ratingsNum) {
          marker.setVisible(true);
        } else if (ratingsNum === 0) {
          marker.setVisible(true);
        } else {
          marker.setVisible(false);
        }
      });
    });
  };

  // Show the restaurant name when the restaurant name on the sidebar is clicked
  listItemClick = place => {
    // Get the marker id
    let marker = this.markers.filter(marker => marker.id === place.place_id)[0];

    this.infowindow.setContent(marker.title);
    this.infowindow.open(this.map, marker);
  };

  // Get the current name value from the Add a new restaurant form
  newRestaurantName = name => {
    this.setState({ newRestaurantName: name }, () => {});
  };

  // Get the current address value from the Add a new restaurant form
  newRestaurantAddress = name => {
    this.setState({ newRestaurantAddress: name }, () => {});
  };

  // Get the current rating value from the Add a new restaurant form
  newRestaurantRating = rating => {
    this.setState({ newRestaurantRating: rating }, () => {});
  };

  // Get the current address value from the Add a new restaurant form
  newRestaurantFeedback = name => {
    this.setState({ newRestaurantFeedback: name }, () => {});
  };

  /* Merge the coordinate from the newMarkers array and
  the value from the newRestaurantList array (from AddRestaurants.js)
  Set the newMarkersArr state */
  newSubmit = newRestaurantList => {
    let newRestaurantObj = {
      geometry: {},
      reviews: {}
    };

    // Add the coordinate from the newMarkers to the newRestaurantObj
    this.newMarkers.forEach(marker => {
      newRestaurantObj["position"] = marker.position;
      newRestaurantObj["geometry"]["location"] = marker.position;
    });

    // Add values from the newRestaurantList array to the newRestaurantObj
    newRestaurantList.forEach(list => {
      newRestaurantObj["place_id"] = this.state.randomID;
      newRestaurantObj["name"] = list.name;
      newRestaurantObj["vicinity"] = list.address;
      newRestaurantObj["rating"] = parseInt(list.rating);
      newRestaurantObj["reviews"]["rating"] = parseInt(list.rating);
      newRestaurantObj["reviews"]["text"] = list.feedback;
      newRestaurantObj["user_ratings_total"] = 1;
    });

    this.places.push(newRestaurantObj);

    let newMarkersArr = this.state.newMarkersArr.slice();
    newMarkersArr.push(newRestaurantObj);

    this.setState({ newMarkersArr }, () => {});
  };

  // Add new review
  onReviewSubmit = addReview => {
    let newReviewObj = {};
    addReview.forEach(review => {
      newReviewObj["id"] = review.id;
      newReviewObj["position"] = review.position;
      newReviewObj["rating"] = review.rating;
      newReviewObj["feedback"] = review.feedback;
    });

    // Existing restaurants review
    let newReviews = this.state.newReviews.slice();
    newReviews.push(newReviewObj);

    this.setState({ newReviews }, () => {});
  };

  render() {
    return (
      <div>
        <Header />
        <div id='map' />
        <AddRestaurants
          newSubmit={this.newSubmit}
          newRestaurantName={this.newRestaurantName}
          newRestaurantAddress={this.newRestaurantAddress}
          newRestaurantRating={this.newRestaurantRating}
          newRestaurantFeedback={this.newRestaurantFeedback}
        />
        <Sidebar
          places={this.state.filteredPlaces}
          onReviewSubmit={this.onReviewSubmit}
          listItemClick={this.listItemClick}
        >
          <RatingsFilter onFormSubmit={this.onFormSubmit} />
        </Sidebar>
      </div>
    );
  }
}

export default App;
