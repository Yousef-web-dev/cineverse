import React, { useEffect, useState } from "react";
import { footerStyles } from "../assets/dummyStyles";

// استيراد الأيقونات من react-icons و lucide-react
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaFilm,
  FaStar,
  FaTicketAlt,
} from "react-icons/fa";
import { GiClapperboard, GiPopcorn } from "react-icons/gi";
import { ArrowUp, Film, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const links = [
    { label: "Home", href: "/" },
    { label: "Movies", href: "/movies" },
    { label: "Releases", href: "/releases" },
    { label: "Contact", href: "/contact" },
    { label: "Login", href: "/login" },
  ];

  const genreLinks = [
    { label: "Horror", href: "/movies?genre=horror" },
    { label: "Thriller", href: "/movies?genre=thriller" },
    { label: "Action", href: "/movies?genre=action" },
    { label: "Drama", href: "/movies?genre=drama" },
    { label: "Comedy", href: "/movies?genre=comedy" },
  ];

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // مصفوفة الأيقونات العائمة
  const floatingIcons = [
    GiClapperboard,
    FaFilm,
    FaStar,
    FaTicketAlt,
    GiPopcorn,
  ];

  return (
    <footer className={footerStyles.footer}>
      <div className={footerStyles.animatedBorder}></div>

      <div className={footerStyles.bgContainer}>
        <div className={footerStyles.bgGlow1}></div>
        <div className={footerStyles.bgGlow2}></div>
      </div>

      {/* Floating icons */}
      <div className={footerStyles.floatingIconsContainer}>
        {[...Array(12)].map((_, i) => {
          const IconComponent = floatingIcons[i % floatingIcons.length];
          const left = (i * 23) % 100;
          const top = (i * 17) % 100;
          const dur = 6 + (i % 5);
          const delay = (i % 4) * 0.6;
          return (
            <div
              key={i}
              className={footerStyles.floatingIcon}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animation: `float ${dur}s infinite ease-in-out`,
                animationDelay: `${delay}s`,
              }}
            >
              <IconComponent size={32} />
            </div>
          );
        })}
      </div>

      <div className={footerStyles.mainContainer}>
        <div className={footerStyles.gridContainer}>
          <div className={footerStyles.brandContainer}>
            <div className={footerStyles.brandLogoContainer}>
              <div className="relative">
                <div className={footerStyles.logoGlow}></div>
                <div className={footerStyles.logoContainer}>
                  <GiClapperboard className={footerStyles.logoIcon} size={28} />
                </div>
              </div>
              <h2
                style={{ fontFamily: "Monoton, cursive" }}
                className={footerStyles.brandTitle}
              >
                Cine <span className={footerStyles.brandTitleWhite}>Verse</span>
              </h2>
            </div>
            <p className={footerStyles.brandDescription}>
              Experience the dark side of cinema with the latest news, reviews,
              and exclusive content.
            </p>

            {/* أزرار السوشيال ميديا */}
            <div className={footerStyles.socialContainer}>
              {[
                { Icon: FaFacebookF },
                { Icon: FaTwitter },
                { Icon: FaInstagram },
                { Icon: FaYoutube },
              ].map((item, index) => (
                <a href="#" key={index} className={footerStyles.socialLink}>
                  <item.Icon className={footerStyles.socialIcon} />
                </a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className={footerStyles.sectionHeader}>
              <div className={footerStyles.sectionDot} />
              Explore
            </h3>
            <ul className={footerStyles.linksList}>
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={footerStyles.linkItem}>
                    <span className={footerStyles.linkDot} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* GENRES */}
          <div>
            <h3 className={footerStyles.sectionHeader}>
              <div className={footerStyles.sectionDot} />
              Genres
            </h3>
            <ul className={footerStyles.linksList}>
              {genreLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={footerStyles.linkItem}>
                    <span className={footerStyles.linkDot} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={footerStyles.sectionHeader}>
              <div className={footerStyles.sectionDot} />
              Contact Us
            </h3>
            <ul className={footerStyles.contactList}>
              <li className={footerStyles.contactItem}>
                <div className={footerStyles.contactIconContainer}>
                  <Mail className={footerStyles.contactIcon} />
                </div>
                <span className={footerStyles.contactText}>
                  yousefmohamed.2942003@gmail.com
                </span>
              </li>
              <li className={footerStyles.contactItem}>
                <div className={footerStyles.contactIconContainer}>
                  <Phone className={footerStyles.contactIcon} />
                </div>
                <span className={footerStyles.contactText}>
                  +20 115 770 0392
                </span>
              </li>
              <li className={footerStyles.contactItem}>
                <div className={footerStyles.contactIconContainer}>
                  <MapPin className={footerStyles.contactIcon} />
                </div>
                <span className={footerStyles.contactText}>Cairo, Egypt</span>
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className={footerStyles.divider}>
          <div className={footerStyles.dividerIconContainer}>
            <Film className={footerStyles.dividerIcon} />
          </div>
        </div>

        <div className={footerStyles.bottomBar}>
          <div className={footerStyles.designedBy}>
            <span className={footerStyles.designedByText}>
              Designed by You-Web-Dev
            </span>
            <a
              href="https://hexagondigitalservices.com"
              target="_blank"
              rel="noopener noreferrer"
              className={footerStyles.designedByLink}
            >
              Hexagon Digital Services
            </a>
          </div>

          <div className={footerStyles.policyLinks}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item, index) => (
                <a key={index} href="#" className={footerStyles.policyLink}>
                  {item}
                </a>
              )
            )}
          </div>
        </div>
      </div>

      {/* Scroll to Top Button (بدون شرط {isVisible && ...}) */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`${footerStyles.scrollTopButton.base} ${
          isVisible
            ? footerStyles.scrollTopButton.visible
            : footerStyles.scrollTopButton.hidden
        }`}
      >
        <ArrowUp className={footerStyles.scrollTopIcon} />
      </button>

      <style>{footerStyles.customCSS}</style>
    </footer>
  );
};

export default Footer;