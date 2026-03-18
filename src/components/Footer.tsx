import { Link } from "react-router-dom";
import pathcastLogo from "@/assets/pathcast-logo.png";

const Footer = () => (
  <footer className="mt-12 px-4 md:px-8">
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
        {/* Column 1: Brand + description */}
        <div className="flex flex-col gap-4 items-start text-left">
          <Link to="/" className="flex items-center gap-3">
            <img src={pathcastLogo} alt="pathCast" className="h-8" />
            <span className="font-bold text-sm text-primary">pathCast</span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-sm text-left">
            Global Open-Access Pathology Education Platform. Bridging the
            knowledge gap in professional pathology education on a global scale.
          </p>
        </div>

        {/* Column 2: Platform links */}
        <div className="flex flex-col items-start">
          <h4 className="text-sm font-semibold text-foreground mb-4">
            Platform
          </h4>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground items-start list-none p-0 m-0">
            <li>
              <Link
                to="/search"
                className="hover:text-foreground transition-colors"
              >
                Lectures
              </Link>
            </li>
            <li>
              <Link
                to="/search"
                className="hover:text-foreground transition-colors"
              >
                Topics
              </Link>
            </li>
            <li>
              <Link
                to="/events"
                className="hover:text-foreground transition-colors"
              >
                Upcoming Events
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-foreground transition-colors"
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Community links */}
        <div className="flex flex-col items-start">
          <h4 className="text-sm font-semibold text-foreground mb-4">
            Community
          </h4>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground items-start list-none p-0 m-0">
            <li>
              <Link
                to="/contact"
                className="hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/speakers"
                className="hover:text-foreground transition-colors"
              >
                For Faculty
              </Link>
            </li>
            <li>
              <a
                href="https://www.youtube.com/@pathcast"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                YouTube Channel
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60" />

      <div className="py-6 text-center">
        <p className="text-xs text-muted-foreground">
          © 2026 pathCast. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
