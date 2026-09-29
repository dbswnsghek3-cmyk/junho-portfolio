const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-navigation]");
const navLinks = [...document.querySelectorAll(".primary-navigation a")];
const sections = [...document.querySelectorAll("[data-section]")];
const revealItems = document.querySelectorAll(".reveal");
const year = document.querySelector("[data-current-year]");
const desktopNavigation = window.matchMedia("(min-width: 981px)");

const closeMenu = () => {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "메뉴 열기");
  navigation.classList.remove("is-open");

  if (desktopNavigation.matches) navigation.removeAttribute("aria-hidden");
  else navigation.setAttribute("aria-hidden", "true");
};

const openMenu = () => {
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "메뉴 닫기");
  navigation.removeAttribute("aria-hidden");
  navigation.classList.add("is-open");
};

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  if (isOpen) closeMenu();
  else openMenu();
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.addEventListener("click", (event) => {
  if (navigation.classList.contains("is-open") && !header.contains(event.target)) {
    closeMenu();
  }
});

desktopNavigation.addEventListener("change", closeMenu);

if (!desktopNavigation.matches) navigation.setAttribute("aria-hidden", "true");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("is-active", isCurrent);

        if (isCurrent) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    });
  },
  { rootMargin: "-35% 0px -55%", threshold: 0 },
);

sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 },
);

revealItems.forEach((item) => revealObserver.observe(item));

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

year.textContent = new Date().getFullYear();
