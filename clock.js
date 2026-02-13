import { SolarPromise } from "./lunar_bridge.js";
import { SearchSunLongitude } from "./astronomy.js";
const Solar = await SolarPromise;
const weekday = "日一二三四五六";
const gan = "甲乙丙丁戊己庚辛壬癸";
const zhi = "子丑寅卯辰巳午未申酉戌亥";
const animals = "鼠牛虎兔龍蛇馬羊猴雞狗豬";
const solar_terms_dict = {
  立春: "立春",
  雨水: "雨水",
  惊蛰: "驚蟄",
  春分: "春分",
  清明: "清明",
  谷雨: "穀雨",
  立夏: "立夏",
  小满: "小滿",
  芒种: "芒種",
  夏至: "夏至",
  小暑: "小暑",
  大暑: "大暑",
  立秋: "立秋",
  处暑: "處暑",
  白露: "白露",
  秋分: "秋分",
  寒露: "寒露",
  霜降: "霜降",
  立冬: "立冬",
  小雪: "小雪",
  大雪: "大雪",
  冬至: "冬至",
  小寒: "小寒",
  大寒: "大寒",
};
const month_dictionary = {
  1: "正",
  2: "二",
  3: "三",
  4: "四",
  5: "五",
  6: "六",
  7: "七",
  8: "八",
  9: "九",
  10: "十",
  11: "冬",
  12: "臘",
  [-1]: "閏正",
  [-2]: "閏二",
  [-3]: "閏三",
  [-4]: "閏四",
  [-5]: "閏五",
  [-6]: "閏六",
  [-7]: "閏七",
  [-8]: "閏八",
  [-9]: "閏九",
  [-10]: "閏十",
  [-11]: "閏冬",
  [-12]: "閏臘",
};
const date_dictionary = [
  "初一",
  "初二",
  "初三",
  "初四",
  "初五",
  "初六",
  "初七",
  "初八",
  "初九",
  "初十",
  "十一",
  "十二",
  "十三",
  "十四",
  "十五",
  "十六",
  "十七",
  "十八",
  "十九",
  "二十",
  "廿一",
  "廿二",
  "廿三",
  "廿四",
  "廿五",
  "廿六",
  "廿七",
  "廿八",
  "廿九",
  "三十",
];
const xiaoshi = "初正";
const jike = "初一二三四五六七";
const msInDay = 1000 * 60 * 60 * 24;
function get_interval_days(
  a_year,
  a_month,
  a_date,
  a_hour,
  a_minute,
  a_second,
  b_Date,
) {
  const date1 = new Date(
    a_year,
    a_month - 1,
    a_date,
    a_hour,
    a_minute,
    a_second,
  );
  const diffInMs = Math.abs(b_Date - date1);
  return Math.ceil(diffInMs / msInDay);
}
const regex =
  /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2}) (?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})/;
function parse_date(date_string) {
  const parts = date_string.match(/\d+/g).map(Number);
  return new Date(
    parts[0],
    parts[1] - 1,
    parts[2],
    parts[3],
    parts[4],
    parts[5],
  );
}
function get_china_lunisolar_date(year, month, date, hour, minute, second) {
  const solar = Solar.fromYmdHms(year, month, date, hour, minute, second);
  const lunisolar_date = solar.getLunar();
  const jieqi = lunisolar_date.getPrevJieQi(false);
  const jieqi_time = parse_date(jieqi.getSolar().toYmdHms());
  const solar_term =
    solar_terms_dict[jieqi.getName()] +
    "第" +
    get_interval_days(year, month, date, hour, minute, second, jieqi_time) +
    "天";
  const ganzhi_year =
    gan.charAt(lunisolar_date.getYearGanIndex()) +
    zhi.charAt(lunisolar_date.getYearZhiIndex());
  const animal = animals.charAt(lunisolar_date.getYearZhiIndex());
  const china_month = month_dictionary[lunisolar_date.getMonth()];
  const ganzhi_month =
    gan.charAt(lunisolar_date.getMonthGanIndex()) +
    zhi.charAt(lunisolar_date.getMonthZhiIndex());
  const china_date = date_dictionary[lunisolar_date.getDay() - 1];
  const ganzhi_date =
    gan.charAt(lunisolar_date.getDayGanIndex()) +
    zhi.charAt(lunisolar_date.getDayZhiIndex());
  return {
    solar_term: solar_term,
    ganzhi_year: ganzhi_year,
    animal: animal,
    china_month: china_month,
    ganzhi_month: ganzhi_month,
    china_date: china_date,
    ganzhi_date: ganzhi_date,
  };
}
function time_to_shichen(hour, minute) {
  const shi = zhi.charAt(((hour + 1) % 24) / 2);
  const suffix = xiaoshi.charAt((hour + 1) % 2);
  const dashike = jike.charAt((((hour + 1) % 2) * 60 + minute) / 15);
  const xiaoshike = jike.charAt(minute / 15);
  return (
    shi + "時" + dashike + "刻&nbsp;&nbsp;" + shi + suffix + xiaoshike + "刻"
  );
}
export function clockModule(options) {
  this._initial(options);
}
clockModule.prototype = {
  constructor: this,
  destroy: function () {
    if (this.intervals) {
      this.intervals.forEach((id) => clearInterval(id));
      this.intervals = [];
    }
    this.par.Module.forEach((selector) => {
      const el = document.querySelector(selector);
      if (el) {
        el.innerHTML = "";
      }
    });
  },
  _initial: function (options) {
    this.intervals = [];
    const par = {
      Module: [],
      clocksize: [200, 200],
      clockbgcolor: "#ffffff",
      defaultcolor: {
        kdcolor: "#eee",
        zscolor: "#000",
        Minutehand: "#000",
        Hourhand: "#000",
        Secondhand: "#f00",
        textcolor: "#000000",
        brimcolor: "#000000",
      },
      clockparameter: [
        {
          timezone: "",
          cw: null,
          ch: null,
          bgcolor: null,
          cityName: "",
          cityEnglish: "",
          font: "",
          kdcolor: null,
          zscolor: null,
          Minutehand: null,
          Hourhand: null,
          Secondhand: null,
          textcolor: null,
          brimcolor: null,
        },
      ],
      expandmethod: function () {},
    };
    this.extend = function (o, n, override) {
      for (const key in n) {
        if (n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)) {
          o[key] = n[key];
        }
      }
      return o;
    };
    this.$ = function (className, topWindow) {
      const expression = /^\#|[\.]|\-\b$/;
      const v = expression.test(className);
      if (v == true) {
        if (className.indexOf("#") != -1) {
          topWindow != undefined
            ? (className = topWindow.getElementById(className.slice(1)))
            : (className = document.getElementById(className.slice(1)));
        } else if (className.indexOf(".") != -1) {
          if (!document.getElementsByClassName) {
            topWindow != undefined
              ? (className = this.getElementsByClassName(
                  topWindow,
                  className.slice(1),
                )[0])
              : (className = this.getElementsByClassName(
                  document,
                  className.slice(1),
                )[0]);
          } else {
            topWindow != undefined
              ? (className = topWindow.getElementsByClassName(
                  className.slice(1),
                )[0])
              : (className = document.getElementsByClassName(
                  className.slice(1),
                )[0]);
          }
        }
      }
      return className;
    };
    this.hasClass = function (elements, cName) {
      return !!elements.className.match(
        new RegExp("(\\s|^)" + cName + "(\\s|$)"),
      );
    };
    this.addClass = function (elements, cName) {
      if (!this.hasClass(elements, cName)) {
        elements.className += " " + cName;
      }
    };
    this.removeClass = function (elements, cName) {
      if (this.hasClass(elements, cName)) {
        elements.className = elements.className.replace(
          new RegExp("(\\s|^)" + cName + "(\\s|$)"),
          " ",
        );
      }
    };
    ((this.eve = function (eve) {
      const evt = eve || window.event;
      const obj = evt.target || evt.srcElement || eve.srcElement;
      return obj;
    }),
      (this.getElementsByClassName = function (parent, className) {
        const aEls = parent.getElementsByTagName("*");
        const arr = [];
        for (let i = 0; i < aEls.length; ++i) {
          const aClassName = aEls[i].className.split(" ");
          for (let j = 0; j < aClassName.length; ++j) {
            if (aClassName[j] == className) {
              arr.push(aEls[i]);
              break;
            }
          }
        }
        return arr;
      }));
    this.par = this.extend(par, options, true);
    this.show(this.par, this);
  },
  show: function (par, clock) {
    const doclist = par.Module;
    for (let i = 0; i < doclist.length; ++i) {
      const pagination = clock.$(doclist[i]);
      const clockparameter = clock.par.clockparameter[i];
      if (clockparameter != undefined) {
        clock.clocksite(pagination, clock, clockparameter);
      }
    }
    clock.par.expandmethod(clock);
  },
  clocksite: function (doc, clock, clockparameter) {
    let kdcolor,
      zscolor,
      Minutehand,
      Hourhand,
      Secondhand,
      textcolor,
      brimcolor;
    const canvasbox = document.createElement("canvas");
    clock.addClass(canvasbox, "canvasbox");
    canvasbox.style.overflow = "hidden";
    canvasbox.style.borderRadius = "50%";
    doc.appendChild(canvasbox);
    const titletime = document.createElement("div");
    clock.addClass(titletime, "titletime");
    doc.appendChild(titletime);
    const titleName = document.createElement("div");
    clock.addClass(titleName, "cityName");
    titleName.innerHTML = clockparameter.cityName;
    doc.appendChild(titleName);
    const titleEnglish = document.createElement("div");
    clock.addClass(titleEnglish, "cityEnglish");
    titleEnglish.innerHTML = clockparameter.cityEnglish;
    doc.appendChild(titleEnglish);
    if (clockparameter.cw == null && clockparameter.ch == null) {
      const clocksize = clock.par.clocksize;
      for (let i = 0; i < clocksize.length; ++i) {
        if (i == 0) {
          canvasbox.height = clocksize[i];
        } else if (i == 1) {
          canvasbox.width = clocksize[i];
        }
      }
    } else {
      canvasbox.height = clockparameter.ch;
      canvasbox.width = clockparameter.cw;
    }
    if (clockparameter.bgcolor == null) {
      canvasbox.style.backgroundColor = clock.par.clockbgcolor;
    } else {
      canvasbox.style.backgroundColor = clockparameter.bgcolor;
    }
    if (clockparameter.kdcolor == null) {
      kdcolor = clock.par.defaultcolor.kdcolor;
    } else {
      kdcolor = clockparameter.kdcolor;
    }
    if (clockparameter.zscolor == null) {
      zscolor = clock.par.defaultcolor.zscolor;
    } else {
      zscolor = clockparameter.zscolor;
    }
    if (clockparameter.Minutehand == null) {
      Minutehand = clock.par.defaultcolor.Minutehand;
    } else {
      Minutehand = clockparameter.Minutehand;
    }
    if (clockparameter.Hourhand == null) {
      Hourhand = clock.par.defaultcolor.Hourhand;
    } else {
      Hourhand = clockparameter.Hourhand;
    }
    if (clockparameter.Secondhand == null) {
      Secondhand = clock.par.defaultcolor.Secondhand;
    } else {
      Secondhand = clockparameter.Secondhand;
    }
    if (clockparameter.textcolor == null) {
      textcolor = clock.par.defaultcolor.textcolor;
    } else {
      textcolor = clockparameter.textcolor;
    }
    if (clockparameter.brimcolor == null) {
      brimcolor = clock.par.defaultcolor.brimcolor;
    } else {
      brimcolor = clockparameter.brimcolor;
    }
    const ctx = canvasbox.getContext("2d");
    const width = ctx.canvas.clientWidth;
    const height = ctx.canvas.clientHeight;
    const r = width / 2;
    const rem = width / 200;
    const drawAround = function () {
      ctx.save();
      ctx.beginPath();
      ctx.translate(r, r);
      ctx.lineWidth = 10 * rem;
      ctx.strokeStyle = brimcolor;
      ctx.arc(0, 0, r - 5, 0, 2 * Math.PI, false);
      ctx.stroke();
      const housNumbers = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];
      ctx.font = clockparameter.font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      housNumbers.forEach(function (number, i) {
        const rad = ((2 * Math.PI) / 12) * i;
        const x = Math.cos(rad) * (r - 30);
        const y = Math.sin(rad) * (r - 30);
        ctx.fillStyle = textcolor;
        ctx.fillText(number, x, y);
      });
      for (let i = 0; i < 60; ++i) {
        const rad = ((2 * Math.PI) / 60) * i;
        const x = Math.cos(rad) * (r - 18);
        const y = Math.sin(rad) * (r - 18);
        ctx.beginPath();
        if (i % 5 != 0) {
          ctx.fillStyle = kdcolor;
        } else {
          ctx.fillStyle = zscolor;
        }
        ctx.arc(x, y, 2, 0, 2 * Math.PI, false);
        ctx.fill();
      }
    };
    const drawhHour = function (hour, minute) {
      ctx.save();
      ctx.beginPath();
      const rad = ((2 * Math.PI) / 12) * hour;
      const mrad = ((2 * Math.PI) / 12 / 60) * minute;
      ctx.rotate(rad + mrad);
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.strokeStyle = Hourhand;
      ctx.moveTo(0, 10);
      ctx.lineTo(0, -r / 2);
      ctx.stroke();
      ctx.restore();
    };
    const drawMinute = function (minute) {
      ctx.save();
      ctx.beginPath();
      const rad = ((2 * Math.PI) / 60) * minute;
      ctx.rotate(rad);
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.strokeStyle = Minutehand;
      ctx.moveTo(0, 10);
      ctx.lineTo(0, -r + 30);
      ctx.stroke();
      ctx.restore();
    };
    const drawSecond = function (second) {
      ctx.save();
      ctx.beginPath();
      const rad = ((2 * Math.PI) / 60) * second;
      ctx.rotate(rad);
      ctx.fillStyle = Secondhand;
      ctx.moveTo(-2, 20);
      ctx.lineTo(2, 20);
      ctx.lineTo(1, -r + 18);
      ctx.lineTo(-1, -r + 18);
      ctx.fill();
      ctx.restore();
    };
    const drawDot = function () {
      ctx.beginPath();
      ctx.fillStyle = "#fff";
      ctx.arc(0, 0, 3, 0, 2 * Math.PI, false);
      ctx.fill();
    };
    const datetime = function (
      hour,
      minute,
      clockdate,
      weekdate,
      china_lunisolar_date,
      lunartime,
    ) {
      titletime.innerHTML =
        clockdate +
        "&nbsp;&nbsp;<span>" +
        hour +
        "</span>:<span>" +
        (minute.toString().length < 2
          ? "0" + minute.toString()
          : minute.toString()) +
        "</span><br/>" +
        weekdate +
        "<br/>" +
        china_lunisolar_date +
        "<br/>" +
        lunartime;
    };
    const draw = function () {
      ctx.clearRect(0, 0, width, height);
      const timezone = clockparameter.timezone;
      const offset_GMT = new Date().getTimezoneOffset();
      const now_date = new Date().getTime();
      const target_date = new Date(
        now_date + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000,
      );
      const hour = target_date.getHours();
      const minute = target_date.getMinutes();
      const second = target_date.getSeconds();
      const year = target_date.getFullYear();
      const china_year = "中華民國" + (year - 1911);
      const month = target_date.getMonth() + 1;
      const date = target_date.getDate();
      const clockdate = china_year + "年" + month + "月" + date + "日";
      const china_lunisolar_date = get_china_lunisolar_date(
        year,
        month,
        date,
        hour,
        minute,
        second,
      );
      const weekdate =
        "西元" +
        year +
        "年&nbsp;&nbsp;星期" +
        weekday.charAt(target_date.getDay()) +
        "&nbsp;&nbsp;" +
        china_lunisolar_date.solar_term;
      const china_date =
        china_lunisolar_date.ganzhi_year +
        "(" +
        china_lunisolar_date.animal +
        ")" +
        "年" +
        china_lunisolar_date.china_month +
        "(" +
        china_lunisolar_date.ganzhi_month +
        ")" +
        "月" +
        china_lunisolar_date.china_date +
        "(" +
        china_lunisolar_date.ganzhi_date +
        ")日";
      const china_time = time_to_shichen(hour, minute);
      drawAround();
      drawSecond(second);
      drawMinute(minute);
      drawhHour(hour, minute);
      datetime(hour, minute, clockdate, weekdate, china_date, china_time);
      drawDot();
      ctx.restore();
    };
    draw();
    const interval_id = setInterval(draw, 1000);
    clock.intervals.push(interval_id);
  },
};
