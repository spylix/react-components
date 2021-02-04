import React from "react";
import "./HelpModal.css";

export default function HelpModal(props) {
  //  props:
  //  - style - help-modal style
  //  - contentStyle - help-modal-content style - mostly left / right and width (position of the modal)
  //  - children - content, innerHTML of the HelpModal
  //  - icon - custom icon, if none is provided, the default is a circle with question mark

  //  Example:
  //    <HelpModal>
  //      <div className="help-modal-content-title">Title</div>
  //      <div style={{ marginBottom: "3px" }}>Some text</div>
  //      <div>More text</div>
  //    </HelpModal>;

  // Use className help-modal-content-title for the title in content
  // By default modal width is 200px

  return (
    <div className="help-modal" style={props.style} tabIndex="0">
      {props.icon || <div className="help-modal-icon">?</div>}
      <div className="help-modal-content" style={props.contentStyle}>
        {props.children}
      </div>
    </div>
  );
}
