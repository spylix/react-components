import React from "react";
import "./CustomCheckbox.css";

export default function CustomCheckbox(props) {
  // props:
  // Necessary props:
  //  - id - input id - unique id is needed for the label to work correctly
  //         (it can be id of an object when rendering a list or just Math.random())
  // Other props:
  //  - label - text next to the checkbox
  //  - style
  //  - className
  //  - checked
  //  - onChange
  // You can add more event handlers to the input as necessary

  return (
    <div
      className={`custom-checkbox-wrapper ${props.className}`}
      style={{ position: "relative", ...props.style }}
    >
      <input
        type="checkbox"
        checked={props.checked}
        id={`custom-checkbox-${props.id}`}
        className="custom-checkbox"
        onChange={props.onChange}
      />
      <label
        htmlFor={`custom-checkbox-${props.id}`}
        className="custom-checkbox-box"
      >
        <div className="custom-check">
          <div className="custom-check-p1"></div>
          <div className="custom-check-p2"></div>
        </div>
        <div className="custom-checkbox-label">{props.label}</div>
      </label>
    </div>
  );
}
