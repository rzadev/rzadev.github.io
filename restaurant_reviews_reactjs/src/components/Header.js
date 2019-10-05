import "./header.css";
import React, { Component } from "react";

class Header extends Component {
  detectEvent = () => {
    let closeIcon = document.querySelector(".closeIcon");
    let sideBar = document.querySelector("#right-panel");

    closeIcon.classList.toggle("change");
    if (sideBar.style.display === "" || sideBar.style.display === "block") {
      sideBar.style.display = "none";
    } else {
      sideBar.style.display = "block";
    }
  };

  render() {
    return (
      <div>
        <div id='header'>Restaurants Review</div>
        <div className='closeIcon' onClick={this.detectEvent}>
          <div className='bar1' />
          <div className='bar2' />
          <div className='bar3' />
        </div>
      </div>
    );
  }
}

export default Header;
