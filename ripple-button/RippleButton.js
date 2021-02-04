import React from "react";
import "./RippleButton.css";

export default function RippleButton(props) {
  // props:
  //  - className
  //  - style
  //  - id
  //  - onClick
  //  - onBlur
  //  - onPointerDown
  //  - onPointerUp
  //  - children - text or something (everything between the RippleButton tags)
  // You can add more event handlers to the input as necessary

  const startRippleOnClick = (e) => {
    e.persist();
    // Position of the touch relative to the button
    const touchX = e.clientX - e.target.getBoundingClientRect().x;
    const touchY = e.clientY - e.target.getBoundingClientRect().y;
    // Set the longest distance from touch to button's border -
    // ripple should cover the whole button (but also no need to be too large)
    const yLimit =
      touchY > -touchY + e.target.getBoundingClientRect().height
        ? touchY * 2
        : (-touchY + e.target.getBoundingClientRect().height) * 2;
    const xLimit =
      touchX > -touchX + e.target.getBoundingClientRect().width
        ? touchX * 2
        : (-touchX + e.target.getBoundingClientRect().width) * 2;
    const rippleWidth = Math.sqrt(Math.pow(xLimit, 2) + Math.pow(yLimit, 2));
    // Set the ripple div as target
    const target = e.target.getElementsByClassName(
      "ripple-button-background"
    )[0];

    // Set position of the ripple (position of touch) and reset size and opacity
    // instantly (transition = 0s)
    target.style.transition = "0s";
    target.style.left = `${touchX}px`;
    target.style.top = `${touchY}px`;
    target.style.transform = "scale(0)";
    target.style.opacity = "1";

    // Set ripple duration (transition), size and final position
    // (so the center of the ripple is in the same place throughout the animation)
    setTimeout(() => {
      target.style.transition = ".2s";
      target.style.transform = `scale(${rippleWidth})`;
    }, 0);

    // Handle onPointerDown if is defined
    if (props.onPointerDown) props.onPointerDown();
  };

  const removeRipple = (e) => {
    // Hide ripple
    const target = e.target.getElementsByClassName(
      "ripple-button-background"
    )[0];
    target.style.transition = "0.4s";
    target.style.opacity = "0";
  };

  const handlePointerUp = (e) => {
    removeRipple(e);
    // Handle onPointerUp if is defined
    if (props.onPointerUp) props.onPointerUp(e);
  };

  const handleBlur = (e) => {
    removeRipple(e);
    // Handle onBlur if is defined
    if (props.onBlur) props.onBlur(e);
  };

  return (
    <button
      className={`ripple-button ${props.className || ""}`}
      id={props.id}
      onClick={props.onClick}
      onPointerDown={startRippleOnClick}
      onPointerUp={handlePointerUp}
      onBlur={handleBlur}
      style={props.style}
    >
      <div className="ripple-button-background" />
      {props.children}
    </button>
  );
}
