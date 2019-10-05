import React, { Component } from 'react';

class RatingsFilter extends Component {
  constructor(props) {
    super(props);
    this.state = { ratings: '' };
  }

  onFormSubmit = event => {
    event.preventDefault();
    this.props.onFormSubmit(this.state.ratings);
  };

  render() {
    return (
      <div className='filterLabel'>
        <form onSubmit={this.onFormSubmit}>
          <label htmlFor='selectRating'>Rating at least:</label>
          <select
            id='selectRating'
            value={this.state.ratings}
            onChange={e => this.setState({ ratings: e.target.value })}
          >
            <option value='0.0'>Any rating</option>
            <option value='2.0'>2.0</option>
            <option value='2.5'>2.5</option>
            <option value='3.0'>3.0</option>
            <option value='3.5'>3.5</option>
            <option value='4.0'>4.0</option>
            <option value='4.5'>4.5</option>
          </select>
          <input type='submit' value='Submit' />
        </form>
      </div>
    );
  }
}

export default RatingsFilter;
