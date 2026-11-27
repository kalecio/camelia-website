"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import Image from "next/image";
import ReactDOM from "react-dom";

const navLinks = [
  { href: "#testimonials", label: "Depoimentos" },
  { href: "#faq", label: "Perguntas Frequentes" },
];

function MobileMenuPortal({ open, onClose, navLinks }: { open: boolean; onClose: () => void; navLinks: { href: string; label: string }[]; }) {
  const [portalRoot, setPortalRoot] = React.useState<HTMLDivElement | null>(null);
  const dialogRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    const root = document.createElement("div");
    root.dataset.mobileMenuPortal = "";
    document.body.appendChild(root);
    setPortalRoot(root);
    return () => root.remove();
  }, []);
  React.useEffect(() => {
    if (!portalRoot || !open || !dialogRef.current) return;

    const dialog = dialogRef.current;
    dialog.focus();

    function trapFocus(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )).filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");
      if (items.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    }
    dialog.addEventListener("keydown", trapFocus);
    return () => {
      dialog.removeEventListener("keydown", trapFocus);
    };
  }, [portalRoot, open]);
  if (!portalRoot) return null;
  if (!open) return null;

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
        aria-labelledby="mobile-menu-title"
        tabIndex={-1}
        ref={dialogRef}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
            <Link href="/" onClick={onClose} className="flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-2 focus-visible:ring-primary">
            <div className="rounded-md flex items-center justify-center text-white font-bold">
                <Image src="/images/flower.png" alt="Sabonete Camélia" width={70} height={70} className="object-cover" />
            </div>
            <span id="mobile-menu-title" className="font-semibold text-primary">Menu de navegação</span>
          </Link>

          <button aria-label="Fechar menu" onClick={onClose} className="p-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-2 focus-visible:ring-primary">
            <X size={18} />
          </button>
        </div>

        <div className="px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={onClose} className="block text-lg text-primary font-medium hover:brightness-95 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-2 focus-visible:ring-primary">
              {link.label}
            </Link>
          ))}

          <div className="pt-4">
            <Link href="#get-started" onClick={onClose} className="w-full inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold bg-primary text-background shadow-sm hover:brightness-95 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-2 focus-visible:ring-primary">
              Começar
            </Link>
          </div>
        </div>
      </motion.aside>
    </>,
    portalRoot
  );
}

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const menuTriggerRef = React.useRef<HTMLButtonElement>(null);
  const [darkMode, setDarkMode] = React.useState(false);
  const pathname = usePathname();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Adiciona ou remove a classe dark do documento
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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

  React.useEffect(() => {
    if (!open) return;
    const trigger = menuTriggerRef.current;
    const dialog = document.querySelector<HTMLElement>("[data-mobile-menu-portal] [role='dialog']");
    const previouslyInert = Array.from(document.body.children)
      .filter((element) => !element.contains(dialog))
      .map((element) => ({ element: element as HTMLElement, inert: (element as HTMLElement).inert }));
    previouslyInert.forEach(({ element }) => { element.inert = true; });
    return () => {
      previouslyInert.forEach(({ element, inert }) => { element.inert = inert; });
      trigger?.focus();
    };
  }, [open]);

  // Verificar preferência do sistema ao carregar
  React.useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('darkMode'));
    
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Salvar preferência
  React.useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  return (
    <header className="w-full bg-background/60 backdrop-blur sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
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
          <nav aria-label="Primária" className="hidden md:flex md:items-center md:space-x-4">
            <ul className="flex items-center space-x-6" role="menubar">
              {navLinks.map((link) => {
                const isActive = pathname?.includes(link.href.replace("#", ""));
                return (
                  <li key={link.href} role="none">
                    <Link
                      href={link.href}
                      role="menuitem"
                      aria-current={isActive ? "page" : undefined}
                      className={`text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-2 focus-visible:ring-primary ${isActive ? "text-indigo-600 dark:text-indigo-400" : "hover:text-indigo-600 dark:hover:text-indigo-400"}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}

              {/* Dark Mode Toggle - Desktop */}
              <li role="none">
                <button
                  onClick={toggleDarkMode}
                  aria-label={darkMode ? "Desativar modo escuro" : "Ativar modo escuro"}
                  className="p-2 rounded-md hover:bg-primary hover:text-background transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                </button>
              </li>
            </ul>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center md:hidden space-x-2">
            {/* Dark Mode Toggle - Mobile (outside menu) */}
            <button
              onClick={toggleDarkMode}
              aria-label={darkMode ? "Desativar modo escuro" : "Ativar modo escuro"}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-2 focus-visible:ring-primary"
            >
              {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              ref={menuTriggerRef}
              onClick={() => setOpen((s) => !s)}
              className="inline-flex items-center justify-center p-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-2 focus-visible:ring-primary"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Portal-mounted mobile menu so it covers the whole viewport */}
      <AnimatePresence>
        {open && (
          <MobileMenuPortal 
            open={open} 
            onClose={() => setOpen(false)} 
            navLinks={navLinks}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
