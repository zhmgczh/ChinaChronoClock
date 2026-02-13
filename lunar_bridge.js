export const SolarPromise = new Promise((resolve) => {
  if (window.Solar) return resolve(window.Solar);
  const script = document.createElement("script");
  script.src = "./lunar.js";
  script.onload = () => resolve(window.Solar);
  document.head.appendChild(script);
});
