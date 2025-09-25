"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import ReactDOM from "react-dom";

const navLinks = [
  { href: "#testimonials", label: "Depoimentos" },
  { href: "#faq", label: "FAQ" },
];

function MobileMenuPortal({ open, onClose, navLinks }: { open: boolean; onClose: () => void; navLinks: { href: string; label: string }[] }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  if (!open) return null;

  console.log("navlinks", navLinks)

  return ReactDOM.createPortal(
    <>
      {/* Backdrop: rendered first so it's below the panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        aria-hidden
      />

      {/* Sidebar panel: solid background, high z-index */}
      <motion.aside
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 right-0 z-50 w-80 max-w-full bg-background backdrop-blur-none bg-opacity-100 shadow-2xl border-l border-gray-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <div className="rounded-md flex items-center justify-center text-white font-bold">
                    <Image src="/images/flower.png" alt="Sabonete Camélia" width={70} height={70} className="object-cover" />
               </div>
            <span className="font-semibold text-primary">Camélia Saboaria Artesanal</span>
          </Link>

          <button aria-label="Fechar menu" onClick={onClose} className="p-2 rounded-md focus:outline-none click:outline-none">
            <X size={18} />
          </button>
        </div>

        <div className="px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={onClose} className="block text-lg text-primary font-medium hover:brightness-95 transition">
              {link.label}
            </Link>
          ))}

          <div className="pt-4">
            <Link href="#get-started" onClick={onClose} className="w-full inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold bg-primary text-background shadow-sm hover:brightness-95 transition">
              Começar
            </Link>
          </div>
        </div>
      </motion.aside>
    </>,
    document.body
  );
}

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Close on escape
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Prevent body scrolling when sidebar open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  return (
    <header className="w-full bg-background/60 backdrop-blur sticky top-0 z-40 border-b border-gray-200 selection:bg-primary selection:text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo (link to home). */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" aria-label="Início - Camélia Saboaria Artesanal" className="flex items-center gap-2">
              <span className="sr-only">Camélia Saboaria Artesanal — Início</span>
              <div className="rounded-md flex items-center justify-center text-white font-bold">
                    <Image src="/images/flower.png" alt="Sabonete Camélia" width={70} height={70} className="object-cover" />
               </div>
              <span className="hidden sm:inline font-semibold">Camélia Saboaria Artesanal</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav aria-label="Primária" className="hidden md:flex md:items-center md:space-x-6">
            <ul className="flex items-center space-x-6" role="menubar">
              {navLinks.map((link) => {
                const isActive = pathname?.includes(link.href.replace("#", ""));
                return (
                  <li key={link.href} role="none">
                    <Link
                      href={link.href}
                      role="menuitem"
                      aria-current={isActive ? "page" : undefined}
                      className={`text-sm font-medium transition-colors ${isActive ? "brightness-95" : "hover:brightness-95"}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}

              <li role="none">
                <Link
                  href="#get-started"
                  role="menuitem"
                  className="ml-2 inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold bg-primary text-background selection:bg-background selection:text-primary shadow-sm hover:brightness-95 transition focus:outline-none click:outline-none"
                >
                  Começar
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center md:hidden">
            <button
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none click:outline-none"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Portal-mounted mobile menu so it covers the whole viewport */}
      <AnimatePresence>{open && <MobileMenuPortal open={open} onClose={() => setOpen(false)} navLinks={navLinks} />}</AnimatePresence>
    </header>
  );
}