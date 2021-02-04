import React, { Component } from "react";
import "./AlertModal.css";

export default class AlertModal extends Component {
  // props:
  //  - showAlertModal - (bool) without this variable the modal won't work,
  //                     it defines whether the modal should be rendered
  //  - toggleAlertModal - (function) example:
  //                       toggleAlertModal = (val) => { this.setState({ showAlertModal: val }); };
  //  - title - modal title
  //  - subtitle - modal subtitle
  //  - buttons - an array of objects:
  //              [{ name: "Button name", onClick: () => {}, dontCloseAfterClick: bool }]
  //  - dontCloseAfterClick - (bool) don't close the modal after clicking on any button, if false - the modal will close.
  //                          You can use this property separately for every button (in buttons array) or for all buttons at once

  // Change mobileWidth to max mobile width you choose,
  // don't forget to change the value in css
  mobileWidth = 1000;

  showModal;
  firstTouchY;
  // Html elements:
  modalBody; // alert-modal-body
  modalBg; // alert-modal-background
  body; // document body tag

  componentDidMount() {
    // Check if modal should be open when loading the component
    this.openModal();
  }

  componentDidUpdate() {
    // Check if modal should be open after updating the component
    this.openModal();
  }

  openModal = () => {
    // Animate the modal opening
    this.modalBody = document.getElementById("alert-modal-body");
    this.modalBg = document.getElementById("alert-modal-background");
    this.body = document.getElementsByTagName("body")[0];
    // Check this.props.showAlertModal (bool), the variable that decides whether the modal is open
    // and check if this.props.showAlertModal has been changed (if not, there's no need for the animation)
    if (
      this.props.showAlertModal &&
      this.showModal !== this.props.showAlertModal
    ) {
      // Get the necessary elements
      // Timeout needed for the animations to work, for elements to fully render / load
      setTimeout(() => {
        this.modalBody.style.transform = "";
        this.modalBody.style.opacity = "1";
        this.modalBg.style.opacity = "1";
        this.body.style.overflow = "hidden";
        // If the page is in mobile mode, remove overscroll behavior
        // which controls refreshing the page on pull down
        if (window.innerWidth < this.mobileWidth) {
          this.body.style.overscrollBehavior = "hidden";
        }
      }, 0);
    }
    // Update local copy of this.props.showAlertModal to compare them later if necessary
    this.showModal = this.props.showAlertModal;
  };

  closeModal = () => {
    // Animate the modal closing
    // Check if the page is in desktop or mobile mode - there are different animations
    if (window.innerWidth >= this.mobileWidth) {
      // Desktop
      this.modalBody.style.transform = "translateY(20px)";
    } else {
      // Mobile
      this.modalBody.style.transform = "translateY(50vh)";
      this.body.style.overscrollBehavior = "";
    }
    // Animations that are the same in both desktop and mobile modes
    this.modalBody.style.opacity = "0";
    this.modalBg.style.opacity = "0";
    this.body.style.overflow = "";
    // Close the modal (change this.props.showAlertModal to false)
    // after the animation is finished (200ms)
    setTimeout(() => {
      this.props.toggleAlertModal(false);
    }, 200);
  };

  startSwipe = (e) => {
    // Save the first touch position
    this.firstTouchY = e.touches[0].clientY;
    // Remove the transition time for modal body so the swipe doesn't have latency
    this.modalBody.style.transition = "0s";
  };

  moveSwipe = (e) => {
    // Check if the modal is in its highest position (in which it can't go further up)
    if (e.touches[0].clientY > this.firstTouchY) {
      // Move the modal with the touch (relative to the initial touch)
      this.modalBody.style.transform = `translateY(${
        e.touches[0].clientY - this.firstTouchY
      }px)`;
    } else {
      // If the current touch is higher than the initial touch,
      // just set the modal to the highest position possible
      this.modalBody.style.transform = `translateY(0px)`;
    }
  };

  endSwipe = (e) => {
    // Reset the modal's transition
    this.modalBody.style.transition = "";
    // Check if final touch is lower than the fist touch by more than 20 pixels,
    // if is - close the modal
    // if isn't - reset the modal to the default position
    if (e.changedTouches[0].clientY - this.firstTouchY > 20) {
      this.closeModal();
    } else {
      this.modalBody.style.transform = `translateY(0px)`;
    }
  };

  render() {
    // Don't render the modal if this.props.showAlertModal is false
    if (!this.props.showAlertModal) return null;

    return (
      <div
        id="alert-modal"
        onTouchStart={this.startSwipe}
        onTouchMove={this.moveSwipe}
        onTouchEnd={this.endSwipe}
      >
        <div
          id="alert-modal-background"
          onClick={this.closeModal}
          style={{
            opacity: "0",
          }}
        ></div>
        <div
          id="alert-modal-body"
          style={{
            transform:
              window.innerWidth >= this.mobileWidth
                ? "translateY(-20px)"
                : "translateY(50vh)",
            opacity: "0",
          }}
        >
          {this.props.title ? (
            <div id="alert-modal-title">{this.props.title}</div>
          ) : null}
          {this.props.subtitle ? (
            <div id="alert-modal-subtitle">{this.props.subtitle}</div>
          ) : null}
          <div
            id="alert-modal-buttons"
            style={{
              flexDirection: this.props.buttons
                ? this.props.buttons.length > 2
                  ? "column"
                  : ""
                : "",
              margin: this.props.buttons
                ? this.props.buttons.length > 2
                  ? "12px 12px 0 12px"
                  : ""
                : "",
            }}
          >
            {this.props.buttons
              ? this.props.buttons.map((button) => {
                  return (
                    <button
                      className="alert-modal-button"
                      onClick={(e) => {
                        if (button.onClick) button.onClick(e);
                        if (
                          !this.props.dontCloseAfterClick &&
                          !button.dontCloseAfterClick
                        )
                          this.closeModal();
                      }}
                      key={button.name}
                    >
                      {button.name}
                    </button>
                  );
                })
              : null}
            <button className="alert-modal-button" onClick={this.closeModal}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}
