// Theme detection and application
function applySystemTheme() {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const root = document.documentElement;

  console.log("Applying theme:", isDark ? "dark" : "light");

  if (isDark) {
    root.style.setProperty("--card-bg", "#1f2937");
    root.style.setProperty("--border-color", "#374151");
    root.style.setProperty("--text-primary", "#f9fafb");
    root.style.setProperty("--text-secondary", "#9ca3af");
    root.style.setProperty("--bg-primary", "#111827");

    // Add dark class to body for additional styling
    document.body.classList.add("dark");
    document.body.classList.remove("light");
  } else {
    root.style.setProperty("--card-bg", "#ffffff");
    root.style.setProperty("--border-color", "#e5e7eb");
    root.style.setProperty("--text-primary", "#111827");
    root.style.setProperty("--text-secondary", "#6b7280");
    root.style.setProperty("--bg-primary", "#f9fafb");

    // Add light class to body for additional styling
    document.body.classList.add("light");
    document.body.classList.remove("dark");
  }
}

// Apply theme immediately on load
document.addEventListener("DOMContentLoaded", applySystemTheme);

// Apply theme on load (fallback)
applySystemTheme();

// Listen for theme changes
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
mediaQuery.addEventListener("change", applySystemTheme);

// Force theme update after a short delay to ensure DOM is ready
setTimeout(applySystemTheme, 100);
