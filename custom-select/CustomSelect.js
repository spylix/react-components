import React, { useEffect, useRef } from "react";
import "./CustomSelect.css";

export default function CustomSelect(props) {
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
  //  - onMouseDown
  // You can add more event handlers to the input as necessary

  let node = useRef(React.createRef());
  let tileList = useRef();

  useEffect(() => {
    // Set the tile list's width to be the same as the input's
    // since it's position absolute and the width won't be set automatically
    setTimeout(() => {
      tileList.current = node.current.getElementsByClassName(
        "custom-select-tile-list"
      )[0];
      if (tileList.current)
        tileList.current.style.width = `${
          node.current.getBoundingClientRect().width - 4
        }px`;
    }, 0);
  });

  const handlePointerDown = (e) => {
    // Focus on the select (show the select list) on pointer down if it wasn't focused before,
    // blur it (hide the list) if it was focused
    // Save the current active element to see what was the active element before blurring
    const activeElement = document.activeElement;
    // Blur (hide) current active element
    document.activeElement.blur();
    // Check if the active element was the select input, if not - focus on it
    setTimeout(() => {
      const select = node.current.getElementsByClassName(
        "custom-select-input"
      )[0];
      if (select !== activeElement) select.focus();
    }, 0);
    // Handle props.onPointerDown if is defined
    if (props.onMouseDown) props.onMouseDown(e);
  };

  const addScrollListener = () => {
    // Set the list position under the select (cause the list is position fixed)
    const pos = node.current.getBoundingClientRect();
    if (!tileList.current)
      tileList.current = node.current.getElementsByClassName(
        "custom-select-tile-list"
      )[0];
    // Check if there is enough space below the select to render the list
    // if not, render it above the select
    if (window.innerHeight - pos.bottom < tileList.current.offsetHeight) {
      tileList.current.style.transformOrigin = "bottom";
      tileList.current.style.top = `calc(${
        pos.top + 2 - tileList.current.offsetHeight
      }px)`;
    } else {
      tileList.current.style.transformOrigin = "";
      tileList.current.style.top = `${pos.bottom - 2}px`;
    }
    // Add scroll event listener on focus
    document.addEventListener("scroll", handleScroll);
  };

  const removeScrollListener = () => {
    // Remove scroll event listener on blur
    document.removeEventListener("scroll", handleScroll);
  };

  const handleScroll = () => {
    // Hide the list on scroll
    if (tileList.current) {
      document.activeElement.blur();
      removeScrollListener();
    }
  };

  const selectTile = (e) => {
    // Blur the tile so the select closes
    if (!props.dontCloseOnClick) e.target.blur();
    // Set select value
    node.current.getElementsByClassName("custom-select-input")[0].value =
      e.target.id;
    // Handle onChange (for select) if is defined
    if (props.onChange) props.onChange(e);
  };

  const changeTile = (e) => {
    // Change the tiles in list with keyboard arrows
    // Prevent scrolling with arrows
    if (e.keyCode === 38 || e.keyCode === 40) e.preventDefault();
    // Get the index of current element in props.elements list
    const index = props.elements.map((e) => e.value).indexOf(e.target.id);
    // Handle key presses
    if (e.keyCode === 38 && index > 0) {
      // Arrow up
      document.getElementById(props.elements[index - 1].value).focus();
    } else if (e.keyCode === 40 && index < props.elements.length - 1) {
      // Arrow down
      document.getElementById(props.elements[index + 1].value).focus();
    }
  };

  return (
    <div
      ref={node}
      className="custom-select-wrapper"
      onMouseDown={handlePointerDown}
    >
      {/* Label */}
      <div className="custom-select-label">{props.label}</div>
      {/* Select */}
      <select
        className="custom-select-input"
        value={props.value}
        onChange={props.onChange}
        onFocus={addScrollListener}
        onBlur={removeScrollListener}
      >
        {props.elements.map((el) => {
          return (
            <option key={el.value} value={el.value}>
              {el.title || el.value}
            </option>
          );
        })}
      </select>
      {/* Custom options list */}
      <div className="custom-select-tile-list">
        {props.elements.map((el) => {
          return (
            <button
              className="custom-select-tile"
              key={el.value}
              id={el.value}
              value={el.value}
              onClick={selectTile}
              onKeyDown={changeTile}
              onFocus={addScrollListener}
              onBlur={removeScrollListener}
            >
              {el.title || el.value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
