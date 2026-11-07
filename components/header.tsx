"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
const links = [
  ["Home", "/"],
  ["About", "/#about"],
  ["Activities", "/#activities"],
  ["Projects", "/projects"],
  ["Members", "/members"],
];
export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" aria-label="DC&M 홈" className="brand">
          <img src="/images/logo.svg" alt="" width="28" height="32" />
          <span>
            DC&M<span className="brand-dot">.</span>
          </span>
        </Link>
        <nav
          aria-label="주 메뉴"
          className={open ? "navigation open" : "navigation"}
        >
          {links.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className={path === href ? "active" : ""}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/apply" className="button header-join">
          JOIN US <ArrowUpRight size={14} />
        </Link>
        <button
          className="menu-button"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
