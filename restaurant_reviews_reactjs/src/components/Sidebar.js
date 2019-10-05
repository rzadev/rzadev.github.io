import "./sidebar.css";
import React, { Component } from "react";
import StarRatingComponent from "react-star-rating-component";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addReview: []
    };
  }

  onReviewSubmit = e => {
    const details = {};

    // Find the TEXTAREA and SELECT tag from the form
    e.target.childNodes.forEach(el => {
      if (el.tagName === "TEXTAREA" || el.tagName === "SELECT")
        // Add the value from the TEXTAREA and SELECT tag to the details object
        details[el.name] = el.value;
    });

    // Find the matching ID between the places props and the place ID from the form
    this.props.places.forEach(place => {
      if (e.target.id === place.place_id) {
        // Simple form validation
        if (details.rating === "Choose Rating") {
          alert("Please select a rating for the restaurant on the sidebar");
          return false;
        }

        if (details.feedback === "") {
          alert("Please write a review for the restaurant on the sidebar");
          return false;
        }

        let ratingSum = place.rating * place.user_ratings_total;
        let currentRatingSum = ratingSum + parseInt(details.rating);

        if (details.rating >= 0 && details.feedback !== "") {
          // Add the ID to the details object
          details["id"] = place.place_id;
          details["position"] = place.geometry.location;

          // Increase the sum of user_ratings_total when the form has submitted
          place.user_ratings_total++;
        }

        /* Update the average rating when the form is submitted
        Round the number to one decimal place */
        place.rating =
          Math.round((currentRatingSum / place.user_ratings_total) * 10) / 10;
      }
    });

    // Push the details object to the addReview state
    const newReview = this.state.addReview.slice();
    newReview.push(details);

    // Set the state of the addReview and pass the value to App.js
    this.setState({ addReview: newReview }, () => {
      this.props.onReviewSubmit(this.state.addReview);
    });
    e.preventDefault();
    this.clearInput(e);
  };

  // Clear the form value after it has submitted
  clearInput = e => {
    e.target.childNodes.forEach(el => {
      if (el.tagName === "TEXTAREA") {
        el.value = null;
      }
      if (el.tagName === "SELECT") {
        el.value = "Choose Rating";
      }
    });
  };

  render() {
    return (
      <div id='right-panel'>
        <div className='right-panel-container'>
          <div className='restaurantsFilter'>{this.props.children}</div>
          <div id='places'>
            {this.props.places.map(place => (
              <div
                key={place.place_id}
                className='restaurants'
                onClick={() => {
                  this.props.listItemClick(place);
                }}
              >
                <div className='restaurantName'> {place.name} </div>
                <div className='starRating'>
                  <div className='numberRating'>{place.rating}</div>
                  <StarRatingComponent
                    name='rating'
                    starColor='#ffb400'
                    emptyStarColor='#ffb400'
                    value={place.rating}
                    renderStarIcon={(index, value) => {
                      return (
                        <span>
                          <i
                            className={
                              index <= value ? "fas fa-star" : "far fa-star"
                            }
                          />
                        </span>
                      );
                    }}
                    renderStarIconHalf={() => {
                      return (
                        <span>
                          <span style={{ position: "absolute" }}>
                            <i className='far fa-star' />
                          </span>
                          <span>
                            <i className='fas fa-star-half' />
                          </span>
                        </span>
                      );
                    }}
                  />
                  <div className='userRatingsTotal'>
                    ({place.user_ratings_total})
                  </div>
                </div>
                <div className='placeAddress'>{place.vicinity}</div>

                <div className='addReview'>
                  <form onSubmit={this.onReviewSubmit} id={place.place_id}>
                    <select
                      className='ratingForm__input ratingForm__input--select'
                      id='chooseRating'
                      name='rating'
                      required
                    >
                      <option value='Choose Rating' autoFocus>
                        Choose Rating
                      </option>
                      <option value='0'>0</option>
                      <option value='1'>1</option>
                      <option value='2'>2</option>
                      <option value='3'>3</option>
                      <option value='4'>4</option>
                      <option value='5'>5</option>
                    </select>

                    <textarea
                      type='text'
                      className='ratingForm__input ratingForm__input--textarea'
                      id='feedback'
                      name='feedback'
                      placeholder='Write your review'
                    />
                    <input type='submit' value='Submit' id={place.place_id} />
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
