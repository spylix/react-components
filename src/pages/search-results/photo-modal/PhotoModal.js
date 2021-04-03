import { createRef, useEffect, useState } from "react";
import formatDateIntl from "../../../functions/formatDateIntl";
import "./PhotoModal.css";

const PhotoModal = ({ photo, setModalOpen }) => {
  const imageNode = createRef();
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    // Set full image as src when it is loaded
    if (status === "Loading...") {
      var img = new Image();
      img.onload = setFullImageSrc;
      img.src = photo.urls.full;
    }
  });

  const setFullImageSrc = () => {
    if (imageNode.current) {
      imageNode.current.src = photo.urls.full;
      setStatus("");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const formatDate = () => {
    const d = new Date(photo.created_at);
    const year = formatDateIntl({ year: "numeric" }, d);
    const month = formatDateIntl({ month: "long" }, d);
    return `${month} ${year}`;
  };

  return (
    <div id="photo-modal" className="center">
      <div id="photo-modal-background" onClick={closeModal}></div>
      <div id="photo-modal-body">
        <img
          ref={imageNode}
          /* Thumbnail as a placeholder for the full image */
          src={photo.urls.thumb}
          alt={photo.alt_description}
          id="photo-modal-img"
        />
        <section id="photo-modal-metadata">
          <h2>Details</h2>
          <p>Author: {photo.user.name}</p>
          <p>Location: {photo.user.location || "Not specified"}</p>
          <p>Date: {formatDate()}</p>
          <p>{status}</p>
        </section>
        <button
          className="close-button center"
          title="Close"
          onClick={closeModal}
        ></button>
      </div>
    </div>
  );
};

export default PhotoModal;
