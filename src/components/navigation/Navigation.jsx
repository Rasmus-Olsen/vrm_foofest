"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Modal from "@/components/modal/Modal";
import { useAuth } from "@/context/AuthContext";

const Navigation = () => {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State til burger-menu
  const { isLoggedIn, logout } = useAuth();

  const toggleModal = () => setIsModalOpen((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev); // Åbner/Lukker menuen

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  // Funktion til at lukke menuen
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="flex justify-between font-oswald items-center py-4 max-w-7xl mx-auto px-2">
        {/* Logo */}
        <div>
          <Link href="/">
            <h1
              className={`text-4xl font-titan font-extrabold ${
                pathname === "/"
                  ? "text-primary"
                  : "text-white hover:text-primary transition ease-out duration-300"
              }`}
            >
              FooFest
            </h1>
          </Link>
        </div>

        {/* Burger Menu Icon */}
        <div
          className="md:hidden flex flex-col justify-center space-y-1 cursor-pointer z-50"
          onClick={toggleMenu}
        >
          <div
            className={`h-0.5 w-8 transition-transform duration-300 ${
              menuOpen ? "rotate-45 translate-y-[6px] bg-primary" : "bg-white"
            }`}
          ></div>
          <div
            className={`h-0.5 w-8 transition-transform duration-300 ${
              menuOpen ? "opacity-0 bg-primary" : "opacity-100 bg-white"
            }`}
          ></div>
          <div
            className={`h-0.5 w-8 transition-transform duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-[6px] bg-primary" : "bg-white"
            }`}
          ></div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 font-bold">
          {renderLinks(
            pathname,
            isLoggedIn,
            handleLogout,
            toggleModal,
            closeMenu
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav
        className={`md:hidden z-100 fixed top-0 left-0 w-full h-full bg-black/90 z-40 transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <ul className="flex flex-col items-center space-y-6 mt-20 text-white text-2xl">
          {renderLinks(
            pathname,
            isLoggedIn,
            handleLogout,
            toggleModal,
            closeMenu
          )}
        </ul>
      </nav>

      {/* Login Modal */}
      <Modal isOpen={isModalOpen} onClose={toggleModal} />
    </>
  );
};

// Funktion til at render navigation links
const renderLinks = (
  pathname,
  isLoggedIn,
  handleLogout,
  toggleModal,
  closeMenu
) => (
  <>
    <NavLink href="/" pathname={pathname} label="Home" closeMenu={closeMenu} />
    <NavLink
      href="/pages/artist"
      pathname={pathname}
      label="Artist"
      closeMenu={closeMenu}
    />
    <NavLink
      href="/pages/program"
      pathname={pathname}
      label="Program"
      closeMenu={closeMenu}
    />
    <NavLink
      href="/pages/booking"
      pathname={pathname}
      label="Booking"
      closeMenu={closeMenu}
    />
    <NavLink
      href="/pages/info"
      pathname={pathname}
      label="Info"
      closeMenu={closeMenu}
    />
    <NavLink
      href="/pages/liked"
      pathname={pathname}
      label="Liked artist"
      closeMenu={closeMenu}
    />
    {isLoggedIn && (
      <NavLink
        href="/pages/login"
        pathname={pathname}
        label="My Page"
        closeMenu={closeMenu}
      />
    )}
    {isLoggedIn ? (
      <button
        onClick={() => {
          handleLogout();
          closeMenu();
        }}
        className="text-white hover:text-primary transition"
      >
        Logout
      </button>
    ) : (
      <button
        onClick={() => {
          toggleModal();
          closeMenu();
        }}
        className="text-white hover:text-primary transition"
      >
        Login
      </button>
    )}
  </>
);

// NavLink komponent
const NavLink = ({ href, pathname, label, closeMenu }) => (
  <li className="list-none">
    <Link
      href={href}
      onClick={closeMenu} // Lukker menuen ved klik
      className={`relative group ${
        pathname === href ? "text-primary" : "hover:text-primary"
      }`}
    >
      {label}
      <span
        className={`absolute left-0 bottom-0 h-0.5 bg-primary transition-all duration-300 ${
          pathname === href ? "w-full" : "w-0 group-hover:w-full"
        }`}
      ></span>
    </Link>
  </li>
);

export default Navigation;
