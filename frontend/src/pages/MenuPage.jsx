import { menuCategories } from "../data/menu";
import "./MenuPage.css";

function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}

export default function MenuPage() {
  return (
    <div className="page menu-page">
      <header className="page-header">
        <h1>Our Menu</h1>
        <p>
          Seasonal ingredients, classic technique, and plates meant to be
          remembered.
        </p>
      </header>

      <div className="menu-sections">
        {menuCategories.map((category) => (
          <section key={category.name} className="menu-section">
            <h2>{category.name}</h2>
            <ul className="menu-list">
              {category.items.map((item) => (
                <li key={item.name} className="menu-item">
                  <div className="menu-item-head">
                    <h3>{item.name}</h3>
                    <span className="menu-price">{formatPrice(item.price)}</span>
                  </div>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
