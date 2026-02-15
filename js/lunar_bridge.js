export const SolarPromise = new Promise((resolve) => {
  if (window.Solar) {
    return resolve(window.Solar);
  }
  const script = document.createElement("script");
  script.src = "./lunar.js";
  script.onload = () => resolve(window.Solar);
  document.head.appendChild(script);
});
export const LunarPromise = new Promise((resolve) => {
  if (window.Lunar) {
    return resolve(window.Lunar);
  }
  const script = document.createElement("script");
  script.src = "./lunar.js";
  script.onload = () => resolve(window.Lunar);
  document.head.appendChild(script);
});
