const all_china_timezones = ["5.5", "6", "7", "8", "8.5"];
const all_china_time_zone_longitude_centers = [82.5, 90, 105, 120, 127.5];
const all_china_time_zone_longitude_range = {
  82.5: [73, 82.5],
  90: [82.5, 97.5],
  105: [97.5, 112.5],
  120: [112.5, 127.5],
  127.5: [127.5, 136],
};
async function load_geo_data() {
  const response = await fetch("china.geojson");
  return await response.json();
}
let china_geojson = null;
/**
 * @param {Array} point
 * @param {Array} polygon
 */
function is_point_in_polygon(point, polygon) {
  const [lng, lat] = point;
  let isInside = false;
  const ring = polygon[0];
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect =
      yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) isInside = !isInside;
  }
  return isInside;
}
/**
 * @param {number} lng
 * @param {number} lat
 * @returns {boolean}
 */
function is_inside_china(lng, lat) {
  const feature = china_geojson.features.find(
    (f) => f.properties.name === "中华人民共和国",
  );
  if (!feature) {
    console.error("找不到中國邊界數據");
    return false;
  }
  const { type, coordinates } = feature.geometry;
  if (type === "Polygon") {
    return is_point_in_polygon([lng, lat], coordinates);
  } else if (type === "MultiPolygon") {
    return coordinates.some((polygonCoords) =>
      is_point_in_polygon([lng, lat], polygonCoords),
    );
  }
  return false;
}
function get_current_timezone_from_browser() {
  const offsetMinutes = new Date().getTimezoneOffset();
  const offsetHours = -offsetMinutes / 60;
  return offsetHours.toString();
}
function get_current_timezone_from_geo_location(longitude, latitude) {
  if (is_inside_china(longitude, latitude)) {
    for (let i = 0; i < all_china_timezones.length; ++i) {
      const current_center = all_china_time_zone_longitude_centers[i];
      const current_lowerbound =
        all_china_time_zone_longitude_range[current_center][0];
      const current_upperbound =
        all_china_time_zone_longitude_range[current_center][1];
      if (longitude >= current_lowerbound && longitude < current_upperbound) {
        return all_china_timezones[i];
      }
    }
  }
  return null;
}
function get_current_timezone_from_gps() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("瀏覽器不支援 GPS 定位");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        resolve(get_current_timezone_from_geo_location(longitude, latitude));
      },
      (error) => {
        reject("無法獲取位置: " + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  });
}
async function get_current_timezone_from_ip() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (response.ok) {
      const data = await response.json();
      const longitude = data.longitude;
      const latitude = data.latitude;
      return get_current_timezone_from_geo_location(longitude, latitude);
    } else {
      console.warn("IP 定位服務回應異常:", response.status);
      return null;
    }
  } catch (error) {
    console.error("獲取 IP 定位時發生錯誤:", error);
    return null;
  }
}
export async function get_current_timezone() {
  const base_current_timezone = get_current_timezone_from_browser();
  if (
    base_current_timezone.endsWith(".25") ||
    base_current_timezone.endsWith(".75")
  ) {
    return base_current_timezone;
  }
  if (null === china_geojson) {
    try {
      china_geojson = await load_geo_data();
    } catch (e) {
      console.error("載入邊界數據失敗", e);
    }
  }
  if (null !== china_geojson) {
    try {
      let current_timezone = await get_current_timezone_from_gps();
      if (current_timezone !== null) {
        return current_timezone;
      }
    } catch (e) {
      console.log("GPS 定位失敗，轉向 IP 判斷...");
    }
    try {
      let current_timezone = await get_current_timezone_from_ip();
      if (current_timezone !== null) {
        return current_timezone;
      }
    } catch (e) {
      console.log("IP 判斷失敗...");
    }
  }
  return base_current_timezone;
}
