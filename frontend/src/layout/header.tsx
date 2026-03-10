import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import "../assets/header.css";
import DropdownMenu from "../components/DropdownMenu";
import SearchDropdown from "../components/SearchDropdown";
import ProfileDropdown from "../components/ProfileDropdown";
import { selectCartTotals } from "../store/selectors/cartSelectors";
import { Button } from "@mui/material";

export default function Header() {
  const location = useLocation();

  // Get user from Redux or fallback
  const user = useAppSelector((state) => state.auth.user);
  const persistedUser = user ?? JSON.parse(localStorage.getItem("user") || "null");
  const authHiddenRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
  ];

  const hideNav = authHiddenRoutes.includes(location.pathname);

  // ✅ Use selector for correct cart count
  const { totalQuantity } = useAppSelector(selectCartTotals);

  return (
    <header>
      <div className="header-top-nav">
        {!hideNav && (
          <>
            <ul>
              {persistedUser && (
                <li>
                  <ProfileDropdown />
                </li>
              )}
              <li><Link to="/resources-download">Resources and Download</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>

            <ul className="header-top-nav-r">
              {!persistedUser && (
                <>
                  <li><Link to="/auth/login">Login</Link></li>
                  <li><Link to="/auth/register">Join Us</Link></li>
                </>
              )}
              {persistedUser && (
                <li>
                  <Link to={`/user/order-history`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z" />
                      <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
                    </svg>
                  </Link>
                </li>
              )}

              {persistedUser && (
                <li>
                  <Link to="/admin/team-dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                    </svg>

                  </Link>
                </li>
              )}
              <li className="relative">
                <Link to="/shopping-cart">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 640"
                    width={18}
                    height={18}
                  >
                    <path d="M0 72C0 58.7 10.7 48 24 48L69.3 48C96.4 48 119.6 67.4 124.4 94L124.8 96L524.7 96C549.8 96 568.7 118.9 564 143.6L537.6 280.6C529.6 322 493.4 352 451.2 352L171.4 352L176.5 380.3C178.6 391.7 188.5 400 200.1 400L456 400C469.3 400 480 410.7 480 424C480 437.3 469.3 448 456 448L200.1 448C165.3 448 135.5 423.1 129.3 388.9L77.2 102.6C76.5 98.8 73.2 96 69.3 96L24 96C10.7 96 0 85.3 0 72zM162.6 304L451.2 304C470.4 304 486.9 290.4 490.5 271.6L514.9 144L133.5 144L162.6 304zM208 480C234.5 480 256 501.5 256 528C256 554.5 234.5 576 208 576C181.5 576 160 554.5 160 528C160 501.5 181.5 480 208 480zM432 480C458.5 480 480 501.5 480 528C480 554.5 458.5 576 432 576C405.5 576 384 554.5 384 528C384 501.5 405.5 480 432 480z"></path>
                  </svg>

                  {totalQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {totalQuantity}
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </>
        )}
      </div>

      <nav>
        <DropdownMenu />
        <h1>
          <Link to="/">
            <img src="/images/logo.png" alt="Lavani Wellness" width="130" height="60" />
          </Link>
        </h1>
        <SearchDropdown />
      </nav>

      <div className="header-bottom-nav">
        <div className="start"></div>
        <div className="left"><span>Best Business Opportunity in India</span></div>
        <div className="right"><span>100% Harmful Chemical Free Product</span></div>
        <div className="end"></div>
      </div>
    </header>
  );
}
