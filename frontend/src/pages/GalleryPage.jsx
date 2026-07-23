import { useState } from "react";
import Lightbox from "../components/Lightbox";
import { awards, galleryImages, reviews } from "../data/gallery";
import "./GalleryPage.css";

export default function GalleryPage() {
  const [active, setActive] = useState(null);

  return (
    <div className="page gallery-page">
      <header className="page-header">
        <h1>Gallery</h1>
        <p>A glimpse of our space, our plates, and the moments we create.</p>
      </header>

      <div className="gallery-grid">
        {galleryImages.map((img) => (
          <button
            key={img.src}
            type="button"
            className="gallery-thumb"
            onClick={() => setActive(img)}
          >
            <img src={img.src} alt={img.alt} loading="lazy" />
            <span>{img.caption}</span>
          </button>
        ))}
      </div>

      <section className="awards-section">
        <h2>Awards</h2>
        <ul>
          {awards.map((award) => (
            <li key={award}>{award}</li>
          ))}
        </ul>
      </section>

      <section className="reviews-section">
        <h2>Customer reviews</h2>
        <div className="review-cards">
          {reviews.map((r) => (
            <blockquote key={r.source}>
              <p>“{r.quote}”</p>
              <footer>— {r.source}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <Lightbox image={active} onClose={() => setActive(null)} />
    </div>
  );
}
