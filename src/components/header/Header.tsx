import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const isEdit = useSelector((state: State) => state.edit).edit;

  // toggle edit mode to true if querystring exists but page is not in edit mode
  useEffect(() => {
    if (params.get("edit") === "true" && isEdit === false) {
      dispatch(toggleEditMode("test", "test"));
    }
  }, []);

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

            // append ?edit=true to querystring
            navigate({
              pathname: location.pathname,
              search: undefined,
            });
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

            // remove ?edit=true to querystring
            navigate({
              pathname: location.pathname,
              search: "?edit=true",
            });
          }}
        >
          Edit
        </button>
      )}
    </header>
  );
};

export default Header;
