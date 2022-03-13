import React from "react";
import { Link, useLocation } from "react-router-dom";
import { routes } from "../../routes";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../redux";
import "./Header.scss";
import { toggleEditMode } from "../../redux/modules/edit";
import {
  saveAllEditableAreas,
  saveAllAnimatedBanners,
} from "../../redux/modules/edit";

const Header = (): React.ReactElement => {
  const location = useLocation();
  const dispatch = useDispatch();

  const isEdit = useSelector((state: State) => state.edit).edit;

  return (
    <header className="header-container">
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
      {isEdit && (
        <button
          key={"nav-route-save-button"}
          className={`header-link`}
          onClick={(): void => {
            // toggle mode
            dispatch(toggleEditMode("test", "test"));

            // save all editable areas
            dispatch(saveAllEditableAreas("test", "test"));

            // save all animatedBanners
            dispatch(saveAllAnimatedBanners("test", "test"));

            // TODO: append ?edit=true to querystring
          }}
        >
          Save
        </button>
      )}
      {!isEdit && (
        <button
          key={"nav-route-edit-button"}
          className={`header-link`}
          onClick={(): void => {
            // toggle mode
            dispatch(toggleEditMode("test", "test"));

            // TODO: remove ?edit=true to querystring
          }}
        >
          Edit
        </button>
      )}
    </header>
  );
};

export default Header;
