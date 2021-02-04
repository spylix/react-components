import React, { Component } from "react";
import "./CustomSelect.css";

export default class CustomSelect extends Component {
  // onFocus and onBlur don't work like in normal select
  // props:
  //  - elements: [{
  //        value: "", title: ""
  //    }] - array of elements (options) for select,
  //         every option is an object with value (necessary) and title (optional),
  //         if there's no title, value is rendered as one
  //  - label - is shown on the border above the input
  //  - value - select initial value
  //  - onChange - select onChange
  //  - dontCloseOnClick - (bool) don't close the select list after choosing an option
  //  - onPointerDown
  // You can add more event handlers to the input as necessary

  node;
  tileList;

  constructor(props) {
    super(props);
    this.node = React.createRef();
  }

  handlePointerDown = (e) => {
    // Focus on the select (show the select list) on pointer down if it wasn't focused before,
    // blur it (hide the list) if it was focused
    // Save the current active element to see what was the active element before blurring
    const activeElement = document.activeElement;
    // Blur (hide) current active element
    document.activeElement.blur();
    // Check if the active element was the select input, if not - focus on it
    setTimeout(() => {
      const select = this.node.current.getElementsByClassName(
        "custom-select-input"
      )[0];
      if (select !== activeElement) select.focus();
    }, 0);
    // Handle this.props.onPointerDown if is defined
    if (this.props.onPointerDown) this.props.onPointerDown(e);
  };

  addScrollListener = () => {
    // Set the list position under the select (cause the list is position fixed)
    const node = this.node.current;
    const pos = node.getBoundingClientRect();
    if (!this.tileList)
      this.tileList = node.getElementsByClassName("custom-select-tile-list")[0];
    if (this.tileList)
      this.tileList.style.top = `${pos.top + pos.height - 2}px`;
    // Add scroll event listener on focus
    document.addEventListener("scroll", this.handleScroll);
  };

  removeScrollListener = () => {
    // Remove scroll event listener on blur
    document.removeEventListener("scroll", this.handleScroll);
  };

  handleScroll = () => {
    // Move the list when scrolling so it's always under the input
    if (this.tileList) {
      const pos = this.node.current.getBoundingClientRect();
      this.tileList.style.top = `${pos.top + pos.height - 2}px`;
    }
  };

  selectTile = (e) => {
    // Blur the tile so the select closes
    if (!this.props.dontCloseOnClick) e.target.blur();
    // Set select value
    this.node.current.getElementsByClassName("custom-select-input")[0].value =
      e.target.id;
    // Handle onChange (for select) if is defined
    if (this.props.onChange) this.props.onChange(e);
  };

  changeTile = (e) => {
    // Change the tiles in list with keyboard arrows
    // Prevent scrolling with arrows
    if (e.keyCode === 38 || e.keyCode === 40) e.preventDefault();
    // Get the index of current element in this.props.elements list
    const index = this.props.elements.map((e) => e.value).indexOf(e.target.id);
    // Handle key presses
    if (e.keyCode === 38 && index > 0) {
      // Arrow up
      document.getElementById(this.props.elements[index - 1].value).focus();
    } else if (e.keyCode === 40 && index < this.props.elements.length - 1) {
      // Arrow down
      document.getElementById(this.props.elements[index + 1].value).focus();
    }
  };

  render() {
    // Set the tile list's width to be the same as the input's
    // since it's position absolute and the width won't be set automatically
    setTimeout(() => {
      this.tileList = this.node.current.getElementsByClassName(
        "custom-select-tile-list"
      )[0];
      if (this.tileList)
        this.tileList.style.width = `${
          this.node.current.getBoundingClientRect().width - 4
        }px`;
    }, 0);

    return (
      <div
        ref={this.node}
        className="custom-select-wrapper"
        onPointerDown={this.handlePointerDown}
      >
        {/* Label */}
        <div className="custom-select-label">{this.props.label}</div>
        {/* Select */}
        <select
          className="custom-select-input"
          value={this.props.value}
          onChange={this.props.onChange}
          onFocus={this.addScrollListener}
          onBlur={this.removeScrollListener}
        >
          {this.props.elements.map((el) => {
            return (
              <option key={el.value} value={el.value}>
                {el.title || el.value}
              </option>
            );
          })}
        </select>
        {/* Custom options list */}
        <div className="custom-select-tile-list">
          {this.props.elements.map((el) => {
            return (
              <button
                className="custom-select-tile"
                key={el.value}
                id={el.value}
                value={el.value}
                onClick={this.selectTile}
                onKeyDown={this.changeTile}
                onFocus={this.addScrollListener}
                onBlur={this.removeScrollListener}
              >
                {el.title || el.value}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}
