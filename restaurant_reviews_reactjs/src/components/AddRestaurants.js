import './addrestaurants.css';
import React, { Component } from 'react';

class AddRestaurants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      address: '',
      rating: '',
      feedback: '',
      newRestaurant: {},
      newRestaurantList: []
    };
  }

  // Get the values from the form and set the state for name, address, rating, and feedback
  onChangeInput = e => {
    const target = e.target;
    const name = target.name;
    const value = target.value;

    this.setState({ [name]: value }, () => {
      this.props.newRestaurantName(this.state.name);
      this.props.newRestaurantAddress(this.state.address);
      this.props.newRestaurantRating(this.state.rating);
      this.props.newRestaurantFeedback(this.state.feedback);
    });
  };

  // Add form values to the newRestaurant object
  newSubmit = e => {
    e.preventDefault();

    this.setState(
      Object.assign(this.state.newRestaurant, {
        name: this.state.name,
        address: this.state.address,
        rating: this.state.rating,
        feedback: this.state.feedback
      }),
      () => {
        this.addRestaurant();
      }
    );

    this.handleSubmit();
  };

  // Push the newRestaurant object to newRestaurantList array
  addRestaurant = () => {
    let addNewRestaurantList = [...this.state.newRestaurantList];
    addNewRestaurantList.push({ ...this.state.newRestaurant });

    this.setState({ newRestaurantList: addNewRestaurantList }, () => {
      // Pass the newRestaurantList array to App.js
      this.props.newSubmit(this.state.newRestaurantList);
      this.clearInput();
    });
  };

  // Clear the form value after it was submitted
  clearInput = () => {
    this.setState({
      name: '',
      address: '',
      rating: 'Choose Rating',
      feedback: ''
    });
    this.setState(
      Object.assign(this.state.newRestaurant, {
        name: '',
        address: '',
        rating: '',
        feedback: ''
      })
    );
  };

  // Hide the form after it was submitted
  handleSubmit = () => {
    document.getElementById('addRestaurant').style.display = 'none';
  };

  render() {
    return (
      <div>
        <div id='addRestaurant'>
          <h4>Add a New Restaurant</h4>
          <form className='contactForm' onSubmit={this.newSubmit}>
            <input
              type='text'
              className='contactForm__input contactForm__input--text'
              id='name'
              name={'name'}
              value={this.state.name}
              onChange={this.onChangeInput}
              placeholder='Restaurant Name'
              required
            />

            <textarea
              type='text'
              className='contactForm__input contactForm__input--textarea'
              id='address'
              name='address'
              value={this.state.address}
              onChange={this.onChangeInput}
              placeholder='Restaurant Address'
              required
            />

            <select
              className='contactForm__input contactForm__input--select'
              id='rating'
              name='rating'
              value={this.state.rating}
              onChange={this.onChangeInput}
              required
            >
              <option value='' autoFocus>
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
              className='contactForm__input contactForm__input--textarea'
              id='feedback'
              name='feedback'
              value={this.state.feedback}
              onChange={this.onChangeInput}
              placeholder='Write Your feedback'
              required
            />

            <button
              className='contactForm__button'
              type='submit'
              onSubmit={this.handleSubmit}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default AddRestaurants;
