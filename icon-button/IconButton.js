import React from "react";
import "./IconButton.css";

export default function IconButton(props) {
  // By default icon-button is 40px and the icon inside should be 24px

  // props:
  // Necessary props:
  //  - children - icon (everything between the IconButton tags)
  //  - title
  //  - onClick
  // Other props:
  //  - id
  //  - className - icon-button additional className
  //  - style - icon-button style
  // You can add more event handlers to the input as necessary

  const handleClick = (e) => {
    // Animate click
    const target = e.target.getElementsByClassName("icon-button-background")[0];
    target.style.animation = "clickAnimation 0.3s forwards";
    // Remove the animation after it has ended so it can be used again
    setTimeout(() => (target.style.animation = ""), 300);
    // Handle onClick if is defined
    if (props.onClick) props.onClick(e);
  };

  return (
    <button
      id={props.id}
      className={`icon-button ${props.className || ""}`}
      title={props.title}
      onClick={handleClick}
      style={props.style}
    >
      <div className="icon-button-background"></div>
      {props.children}
    </button>
  );
}
