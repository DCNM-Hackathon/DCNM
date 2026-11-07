"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import Logo from "@/components/logo";
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
  const [hash, setHash] = useState("");

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, [path]);

  const activeHref =
    path === "/" && ["#about", "#activities"].includes(hash)
      ? `${path}${hash}`
      : path;
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" aria-label="DC&M 홈" className="brand">
          <Logo width={28} height={32} gradientId="logo-header" />
          <span>
            DC&M
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
              onClick={() => {
                setOpen(false);
                setHash(href.includes("#") ? `#${href.split("#")[1]}` : "");
              }}
              className={activeHref === href ? "active" : ""}
              aria-current={
                activeHref === href
                  ? href.includes("#")
                    ? "location"
                    : "page"
                  : undefined
              }
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <Link href="/apply" className="button header-join">
            JOIN US
          </Link>
        </div>
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