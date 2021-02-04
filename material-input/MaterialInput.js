import React from "react";
import "./MaterialInput.css";

export default function MaterialInput(props) {
  // Add noBorder attribute to the tag if you want to use input with only bottom border
  // props:
  // Necessary:
  //  - placeholder
  // Other props:
  //  - className - material-input-wrapper additional className
  //  - style - material-input-wrapper style
  //  - id - input id
  //  - noBorder - enables input without border (only bottom border)
  //  - type - input type, if not defined, type="text"
  //  - onEnter
  //  - autoFocus
  //  - value
  //  - onChange
  //  - onMouseDown
  //  - onFocus
  //  - onKeyDown
  // You can add more event handlers to the input as necessary

  // material-input-border-background element
  let borderBackground;

  const handleMouseDown = (e) => {
    // handleMouseDown starts the ripple in border from the mouse click position,
    // if removed, the ripple will start from the center of the input,
    // if removed, handleFocus function is unnecessary
    // as it only resets what has been changed in this function

    // Get input width and position of the cursor in the input
    const inputWidth = e.target.getBoundingClientRect().width;
    const posX = e.clientX - e.target.getBoundingClientRect().left;
    // Check border background is defined, if not, get the element
    if (!borderBackground) {
      borderBackground = e.target.parentElement.getElementsByClassName(
        "material-input-border-background"
      )[0];
    }
    // Calculate the width and left of the border background
    // so the element is the smallest possible
    let width;
    let left;
    // Check if the click was in the left or right half of the input
    if (posX < inputWidth / 2) {
      // Left half
      width = (inputWidth - posX) * 2;
      left = inputWidth - width;
    } else {
      // Right half
      width = posX * 2;
      left = 0;
    }
    // Set the width and left - timeout needed so the properties are set after handleFocus
    setTimeout(() => {
      borderBackground.style.left = `${left}px`;
      borderBackground.style.width = `${width + 4}px`;
    }, 0);
    // Execute props.onMouseDown if is defined
    if (props.onMouseDown) props.onMouseDown(e);
  };

  const handleFocus = (e) => {
    // Remove if handleMouseDown is removed

    // Check border background is defined, if not, get the element
    if (!borderBackground) {
      borderBackground = e.target.parentElement.getElementsByClassName(
        "material-input-border-background"
      )[0];
    }
    // Reset properties (after handleMouseDown) if necessary
    if (borderBackground.style.left) {
      borderBackground.style.left = "";
      borderBackground.style.width = "";
    }
    // Execute props.onFocus if is defined
    if (props.onFocus) props.onFocus(e);
  };

  const handleKeyDown = (e) => {
    // Handle onEnter if is defined
    if (props.onEnter && e.keyCode === 13) props.onEnter(e);
    // Handle onKeyDown if is defined
    if (props.onKeyDown) props.onKeyDown(e);
  };

  return (
    <div
      className={`material-input-wrapper ${props.className || ""}`}
      style={props.style}
    >
      <input
        type={props.type || "text"}
        id={props.id}
        className={`material-input ${
          props.noBorder ? "material-input-no-border" : ""
        }`}
        required
        autoFocus={props.autoFocus}
        value={props.value}
        onChange={props.onChange}
        onMouseDown={handleMouseDown}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      />
      <div className="material-input-border">
        <div className="material-input-border-background"></div>
      </div>
      <div className="material-input-placeholder">{props.placeholder}</div>
    </div>
  );
}
