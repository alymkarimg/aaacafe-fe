import React from "react";
import { Link, useLocation } from "react-router-dom";
import { routes } from "../../routes";
import "./Header.scss";

const Header = (): React.ReactElement => {
  const location = useLocation();

  return (
    <div className="header-container">
      {routes.map((r, i) => {
        return (
          <Link
            key={i + "nav-route"}
            className={`header-link ${
              location.pathname === r.path && "active"
            }`}
            to={r.path}
          >
            {r.title}
          </Link>
        );
      })}
    </div>
  );
};

export default Header;
