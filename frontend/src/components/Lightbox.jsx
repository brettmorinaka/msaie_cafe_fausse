import { useEffect } from "react";
import "./Lightbox.css";

export default function Lightbox({ image, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "unset";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!image) return null;

  return (
    <div
      className="lightbox-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      onClick={onClose}
    >
      <button
        type="button"
        className="lightbox-close"
        onClick={onClose}
        aria-label="Close image"
      >
        ×
      </button>
      <figure
        className="lightbox-content"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={image.src} alt={image.alt} />
        {image.caption && <figcaption>{image.caption}</figcaption>}
      </figure>
    </div>
  );
}
