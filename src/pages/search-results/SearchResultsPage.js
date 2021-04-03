import { useEffect, useRef, useState } from "react";
import { Redirect } from "react-router";
import formatDateIntl from "../../functions/formatDateIntl";
import PhotoModal from "./photo-modal/PhotoModal";
import "./SearchResultsPage.css";

const SearchResultsPage = (props) => {
  const accessKey = "56h7ucIGUoJmbNqgBmSp4w9AEJeHx5oOObdx7-nIG9M";
  const [status, setStatus] = useState("Loading...");
  // Photos
  const [photos, setPhotos] = useState([]);
  const currentPage = useRef(0);
  const page = useRef(0);
  const maxPage = useRef(1);
  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const modalPhoto = useRef({});

  useEffect(() => {
    if (!page.current) checkPhotos();
  });

  const checkPhotos = () => {
    if (page.current >= maxPage.current || currentPage.current !== page.current)
      return;
    page.current++;
    setStatus("Loading...");
    getPhotos();
  };

  const getPhotos = () => {
    fetch(
      `https://api.unsplash.com/search/photos?per_page=20&order_by=default&query=${props.location.state.phrase}&page=${page.current}`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => preparePhotos(data));
  };

  const preparePhotos = (data) => {
    const results = data.results.map((photo) => {
      return { ...photo, date: formatDate(photo.created_at) };
    });
    setPhotos([...photos, ...results]);
    currentPage.current = page.current;
    maxPage.current = data.total_pages;

    if (!photos.length && !results.length) setStatus("No photos");
    else setStatus("");
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = formatDateIntl({ year: "numeric" }, d);
    const month = formatDateIntl({ month: "2-digit" }, d);
    const day = formatDateIntl({ day: "2-digit" }, d);
    return `${day}-${month}-${year}`;
  };

  const handleScroll = (e) => {
    // Check if user scrolled near the bottom of the page
    if (
      e.target.scrollHeight <
      e.target.scrollTop + e.target.getBoundingClientRect().height + 100
    ) {
      checkPhotos();
    }
  };

  const openPhotoModal = (photo) => {
    modalPhoto.current = photo;
    setModalOpen(true);
  };

  if (!props.location.state.phrase) return <Redirect to="/" />;

  return (
    <div id="search-results" onScroll={handleScroll}>
      <div id="search-results-grid">
        {photos.map((photo) => (
          <figure key={photo.id} className="search-results-figure">
            <img
              className="search-results-img"
              src={photo.urls.thumb}
              alt={photo.alt_description}
              loading="lazy"
              tabIndex="0"
              onClick={() => openPhotoModal(photo)}
            />
            <figcaption className="search-results-caption">
              {photo.date}
            </figcaption>
          </figure>
        ))}
        <p>{status}</p>
      </div>
      {modalOpen ? (
        <PhotoModal photo={modalPhoto.current} setModalOpen={setModalOpen} />
      ) : null}
    </div>
  );
};

export default SearchResultsPage;
