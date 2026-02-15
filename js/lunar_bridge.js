const currentScriptUrl = new URL(import.meta.url);
const lunarScriptPath = new URL("./lunar.js", currentScriptUrl).href;
let _lunar_load_task = null;
const load_lunar_script = () => {
  if (window.Solar || window.Lunar) return Promise.resolve();
  if (!_lunar_load_task) {
    _lunar_load_task = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = lunarScriptPath;
      script.async = true;
      script.onload = () => {
        _lunar_load_task = null;
        resolve();
      };
      script.onerror = () => {
        _lunar_load_task = null;
        reject(new Error("lunar.js 載入失敗"));
      };
      document.head.appendChild(script);
    });
  }
  return _lunar_load_task;
};
export const SolarPromise = load_lunar_script().then(() => window.Solar);
export const LunarPromise = load_lunar_script().then(() => window.Lunar);
