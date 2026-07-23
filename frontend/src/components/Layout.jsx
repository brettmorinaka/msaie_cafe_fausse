import { NavLink } from "react-router-dom";
import "./Layout.css";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/menu", label: "Menu" },
  { to: "/reservations", label: "Reservations" },
  { to: "/about", label: "About Us" },
  { to: "/gallery", label: "Gallery" },
];

export default function Layout({ children }) {
  return (
    <div className="site">
      <header className="site-header">
        <div className="header-inner">
          <NavLink to="/" className="brand">
            Café Fausse
          </NavLink>
          <nav className="main-nav" aria-label="Main navigation">
            <ul>
              {navItems.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink to={to} end={end}>
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <div className="footer-inner">
          <p>
            <strong>Café Fausse</strong> · 1234 Culinary Ave, Suite 100,
            Washington, DC 20002
          </p>
          <p>(202) 555-4567 · Mon–Sat 5–11 PM · Sun 5–9 PM</p>
        </div>
      </footer>
    </div>
  );
}
