import React, { useEffect, useRef } from "react";
import "./AlertModal.css";

export default function AlertModal(props) {
  // props:
  //  - showAlertModal - (bool) without this variable the modal won't work,
  //                     it defines whether the modal should be rendered
  //  - toggleAlertModal - (function), args: isOpen<bool>
  //  - title - modal title
  //  - subtitle - modal subtitle
  //  - buttons - an array of objects:
  //              [{ name: "Button name", onClick: () => {}, dontCloseAfterClick: bool }]
  //  - dontCloseAfterClick - (bool) don't close the modal after clicking on any button, if false - the modal will close.
  //                          You can use this property separately for every button (in buttons array) or for all buttons at once

  // Change mobileWidth to max mobile viewport width you choose,
  // don't forget to change the value in css
  let mobileWidth = useRef(100);

  let showModal = useRef();
  let firstTouchY;
  // Html elements:
  let modalBody = useRef(); // alert-modal-body
  let modalBg = useRef(); // alert-modal-background
  let body = useRef(); // document body tag

  useEffect(() => {
    const openModal = () => {
      // Animate the modal opening
      modalBody.current = document.getElementById("alert-modal-body");
      modalBg.current = document.getElementById("alert-modal-background");
      body.current = document.getElementsByTagName("body")[0];
      // Check props.showAlertModal (bool), the variable that decides whether the modal is open
      // and check if props.showAlertModal has been changed (if not, there's no need for the animation)
      if (props.showAlertModal && showModal !== props.showAlertModal) {
        // Get the necessary elements
        // Timeout needed for the animations to work, for elements to fully render / load
        setTimeout(() => {
          modalBody.current.style.transform = "";
          modalBody.current.style.opacity = "1";
          modalBg.current.style.opacity = "1";
          body.current.style.overflow = "hidden";
          // If the page is in mobile mode, remove overscroll behavior
          // which controls refreshing the page on pull down
          if (window.innerWidth < mobileWidth.current) {
            body.style.overscrollBehavior = "hidden";
          }
        }, 0);
      }
      // Update local copy of props.showAlertModal to compare them later if necessary
      showModal.current = props.showAlertModal;
    };

    openModal();
  }, [props.showAlertModal]);

  const closeModal = () => {
    // Animate the modal closing
    // Check if the page is in desktop or mobile mode - there are different animations
    if (window.innerWidth >= mobileWidth.current) {
      // Desktop
      modalBody.current.style.transform = "translateY(20px)";
    } else {
      // Mobile
      modalBody.current.style.transform = "translateY(50vh)";
      body.current.style.overscrollBehavior = "";
    }
    // Animations that are the same in both desktop and mobile modes
    modalBody.current.style.opacity = "0";
    modalBg.current.style.opacity = "0";
    body.current.style.overflow = "";
    // Close the modal (change props.showAlertModal to false)
    // after the animation is finished (200ms)
    setTimeout(() => {
      props.toggleAlertModal(false);
    }, 200);
  };

  const startSwipe = (e) => {
    // Save the first touch position
    firstTouchY = e.touches[0].clientY;
    // Remove the transition time for modal body so the swipe doesn't have latency
    modalBody.current.style.transition = "0s";
  };

  const moveSwipe = (e) => {
    // Check if the modal is in its highest position (in which it can't go further up)
    if (e.touches[0].clientY > firstTouchY) {
      // Move the modal with the touch (relative to the initial touch)
      modalBody.current.style.transform = `translateY(${
        e.touches[0].clientY - firstTouchY
      }px)`;
    } else {
      // If the current touch is higher than the initial touch,
      // just set the modal to the highest position possible
      modalBody.current.style.transform = `translateY(0px)`;
    }
  };

  const endSwipe = (e) => {
    // Reset the modal's transition
    modalBody.current.style.transition = "";
    // Check if final touch is lower than the fist touch by more than 20 pixels,
    // if is - close the modal
    // if isn't - reset the modal to the default position
    if (e.changedTouches[0].clientY - firstTouchY > 20) {
      closeModal();
    } else {
      modalBody.current.style.transform = `translateY(0px)`;
    }
  };

  // Don't render the modal if props.showAlertModal is false
  if (!props.showAlertModal) return null;

  return (
    <div
      id="alert-modal"
      onTouchStart={startSwipe}
      onTouchMove={moveSwipe}
      onTouchEnd={endSwipe}
    >
      <div
        id="alert-modal-background"
        onClick={closeModal}
        style={{
          opacity: "0",
        }}
      ></div>
      <div
        id="alert-modal-body"
        style={{
          transform:
            window.innerWidth >= mobileWidth.current
              ? "translateY(-20px)"
              : "translateY(50vh)",
          opacity: "0",
        }}
      >
        {props.title ? <div id="alert-modal-title">{props.title}</div> : null}
        {props.subtitle ? (
          <div id="alert-modal-subtitle">{props.subtitle}</div>
        ) : null}
        <div
          id="alert-modal-buttons"
          style={{
            flexDirection: props.buttons
              ? props.buttons.length > 2
                ? "column"
                : ""
              : "",
            margin: props.buttons
              ? props.buttons.length > 2
                ? "12px 12px 0 12px"
                : ""
              : "",
          }}
        >
          {props.buttons
            ? props.buttons.map((button) => {
                return (
                  <button
                    className="alert-modal-button"
                    onClick={(e) => {
                      if (button.onClick) button.onClick(e);
                      if (
                        !props.dontCloseAfterClick &&
                        !button.dontCloseAfterClick
                      )
                        closeModal();
                    }}
                    key={button.name}
                  >
                    {button.name}
                  </button>
                );
              })
            : null}
          <button className="alert-modal-button" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
