import "./AboutPage.css";

export default function AboutPage() {
  return (
    <div className="page about-page">
      <header className="page-header">
        <h1>About Us</h1>
      </header>

      <section className="about-block">
        <h2>About Café Fausse</h2>
        <p>
          Founded in 2010 by Chef Antonio Rossi and restaurateur Maria Lopez,
          Café Fausse blends traditional Italian flavors with modern culinary
          innovation. Our mission is to provide an unforgettable dining
          experience that reflects both quality and creativity.
        </p>
      </section>

      <section className="founders-grid">
        <article>
          <h3>Chef Antonio Rossi</h3>
          <p>
            Trained in Florence and Rome, Antonio brings decades of classical
            technique to every plate—always with room for bold, contemporary
            expression.
          </p>
        </article>
        <article>
          <h3>Maria Lopez</h3>
          <p>
            Maria shapes the guest experience from the dining room to the
            community table, ensuring warmth, precision, and hospitality at
            every turn.
          </p>
        </article>
      </section>

      <section className="about-block">
        <h2>Our commitment</h2>
        <p>
          We believe unforgettable dining starts with excellent food and
          responsibly sourced ingredients. Whenever possible, we partner with
          local farms and artisans across the Mid-Atlantic to bring freshness
          and integrity to your table.
        </p>
      </section>
    </div>
  );
}
