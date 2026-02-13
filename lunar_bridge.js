async function ensureLunar() {
  if (window.Solar) return window.Solar;
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "./lunar.js";
    script.async = true;
    script.onload = () => resolve(window.Solar);
    script.onerror = () => reject(new Error("Cannot load lunar.js"));
    document.head.appendChild(script);
  });
}
export const getSolar = async () => {
  await ensureLunar();
  return window.Solar;
};
