import { Link } from "react-router-dom";
import NewsletterSignup from "../components/NewsletterSignup";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-overlay">
          <p className="hero-eyebrow">Washington, DC · Est. 2010</p>
          <h1>Café Fausse</h1>
          <p className="hero-tagline">
            Traditional Italian flavors meet modern culinary innovation.
          </p>
          <div className="hero-actions">
            <Link to="/menu" className="btn btn-primary">
              View Menu
            </Link>
            <Link to="/reservations" className="btn btn-outline">
              Reserve a Table
            </Link>
          </div>
        </div>
      </section>

      <section className="info-grid">
        <article>
          <h2>Visit us</h2>
          <p>
            1234 Culinary Ave, Suite 100
            <br />
            Washington, DC 20002
          </p>
          <p>
            <a href="tel:+12025554567">(202) 555-4567</a>
          </p>
        </article>
        <article>
          <h2>Hours</h2>
          <p>Monday–Saturday: 5:00 PM – 11:00 PM</p>
          <p>Sunday: 5:00 PM – 9:00 PM</p>
        </article>
        <article>
          <h2>Explore</h2>
          <ul className="explore-links">
            <li>
              <Link to="/menu">Menu</Link>
            </li>
            <li>
              <Link to="/reservations">Reservations</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/gallery">Gallery</Link>
            </li>
          </ul>
        </article>
      </section>

      <NewsletterSignup />
    </div>
  );
}
