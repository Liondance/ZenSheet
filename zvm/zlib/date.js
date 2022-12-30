///
/// Date, time and datetime functions
///

var type = require("./type.js");

/**
 *  Time Type functions
 */

const dayLength = 24 * 60 * 60 * 1000; // 86400000

this.Time_constructor = function (h, m, s, ms) {
  if (h === undefined && m === undefined && s === undefined && ms === undefined)
    var time_aux = new Date();
  else if (typeof h === "string" && m === undefined && s === undefined) {
    var now = new Date();
    var time_aux = new Date(
      "" +
        now.getFullYear() +
        "-" +
        (now.getMonth() + 1) +
        "-" +
        now.getDate() +
        " " +
        h
    );

    if (isNaN(time_aux)) {
      throw type.Invalid.constructor("#VALUE!", "Could not parse time string.");
    }
  } else if (
    typeof h === "number" &&
    typeof m === "number" &&
    typeof s === "number"
  ) {
    var time_aux = null;
  } else if (
    typeof h === "object" &&
    h.hasOwnProperty("hours") &&
    h.hasOwnProperty("minutes") &&
    h.hasOwnProperty("seconds") &&
    m === undefined &&
    s === undefined &&
    ms === undefined
  ) {
    return h.copy();
  } else {
    throw type.Invalid.constructor(
      "#VALUE!",
      "Time constructor got unexpected types"
    );
  }

  var time = {};

  if (time_aux) {
    time.hours = time_aux.getHours();
    time.minutes = time_aux.getMinutes();
    time.seconds = time_aux.getSeconds();
    time.milliseconds = time_aux.getMilliseconds();
  } else {
    // Hour normalize
    total = h * 3600 + m * 60 + s; // We should take miliseconds
    time.hours = Math.floor(total / 3600);
    time.minutes = Math.floor((total % 3600) / 60);
    time.seconds = Math.floor((total % 3600) % 60);
    time.milliseconds = typeof ms === "number" ? ms : 0;
  }

  time.type = type.Time;

  time.getHours = function () {
    return this.hours;
  };

  time.getMinutes = function () {
    return this.minutes;
  };

  time.getSeconds = function () {
    return this.seconds;
  };

  time.getMilliseconds = function () {
    return this.milliseconds;
  };

  time.toString = function () {
    return this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
  };

  time.getTime = function () {
    return (
      (this.hours * 3600 + this.minutes * 60 + this.seconds) * 1000 +
      this.milliseconds
    );
  };

  time.setTime = function (total_ms) {
    total = Math.trunc(total_ms / 1000);
    this.hours = Math.floor(total / 3600);
    this.minutes = Math.floor((total % 3600) / 60);
    this.seconds = Math.floor((total % 3600) % 60);
    this.milliseconds = total_ms % 1000;
  };

  time.copy = function () {
    return exports.Time_constructor(
      this.hours,
      this.minutes,
      this.seconds,
      this.milliseconds
    );
  };

  return time;
};

this.hour = function hour(atime) {
  return atime.getHours();
};

this.minute = function minute(atime) {
  return atime.getMinutes();
};

this.second = function second(atime) {
  return atime.getSeconds();
};

/**
 *  Date Type functions
 */

this.Date_constructor = function (y, m, d) {
  var temp;
  if (y === undefined || m === undefined || d === undefined) {
    temp = new Date();
    temp.setHours(0);
    temp.setMinutes(0);
    temp.setSeconds(0);
    temp.setMilliseconds(0);
  } else {
    if (typeof y != "number" || typeof m != "number" || typeof d != "number")
      throw type.Invalid.constructor("#VALUE!");

    y += Math.floor(m / 13);
    m -= Math.floor(m / 13) * 12;

    var old_date = d;

    if (d < 1) d = 1;

    temp = new Date(y, m - 1, d);
    temp.setUTCFullYear(y);

    if (old_date < 1) temp.setTime(temp.getTime() + (old_date - 1) * dayLength);
  }

  temp.type = type.Date;
  temp.toString = function () {
    return (
      String(this.getMonth() + 1) +
      "/" +
      this.getDate() +
      "/" +
      this.getFullYear()
    );
  };

  temp.copy = function () {
    return exports.Date_constructor(
      this.getFullYear(),
      this.getMonth() + 1,
      this.getDate()
    );
  };

  return temp;
};

/**
 *  DateTime Type functions
 */

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

this.Datetime_constructor = function (y, mo, d, h, mi, s) {
  if (typeof y == "number" && typeof mo == "number") {
    y += Math.floor(mo / 13);
    mo -= Math.floor(mo / 13) * 12;

    // 0 indexed months, bc JS
    mo = mo - 1;
  }

  var temp;
  if (y === undefined || mo === undefined || d === undefined) temp = new Date();
  else if (h === undefined || mi === undefined || s === undefined) {
    if (typeof y != "number" || typeof mo != "number" || typeof d != "number")
      throw type.Invalid.constructor("#VALUE!");

    var old_date = d;

    if (d < 1) d = 1;

    temp = new Date(y, mo, d);
    // Fixing JS bug, it's impossible to use constructors with years
    // smaller than 1901
    temp.setFullYear(y);

    if (old_date < 1) temp.setTime(temp.getTime() + (old_date - 1) * dayLength);
  } else {
    if (
      typeof y != "number" ||
      typeof mo != "number" ||
      typeof d != "number" ||
      typeof h != "number" ||
      typeof mi != "number" ||
      typeof s != "number"
    )
      throw type.Invalid.constructor("#VALUE!");

    var old_date = d;

    if (d < 1) d = 1;

    temp = new Date(y, mo, d, h, mi, s);

    // JS Patch again
    temp.setFullYear(y);

    if (old_date < 1) temp.setTime(temp.getTime() + (old_date - 1) * dayLength);
  }

  temp.type = type.Datetime;
  temp.date_rep = temp.toString;
  temp.toString = function (repl_rep) {
    if (repl_rep === true) {
      inner_rep = [
        temp.getFullYear(),
        temp.getMonth() + 1,
        temp.getDate(),
        temp.getHours(),
        temp.getMinutes(),
        temp.getSeconds(),
      ];
      return "datetime(" + inner_rep.join(", ") + ")";
    }

    var split_date = temp.date_rep().split(" ");
    var day = parseInt(split_date[2], 10);

    if (
      temp.getHours() === 0 &&
      temp.getMinutes() === 0 &&
      temp.getSeconds() === 0
    )
      split_date[4] = "";
    else split_date[4] = " " + split_date[4];

    // console.log(temp.getFullYear());
    // console.log(temp.getYear());
    // console.log(temp.getUTCFullYear());

    return (
      monthNames[temp.getMonth()] +
      " " +
      day +
      ", " +
      temp.getFullYear() +
      split_date[4]
    );
  };
  temp.copy = function () {
    return exports.Datetime_constructor(
      this.getFullYear(),
      this.getMonth() + 1,
      this.getDate(),
      this.getHours(),
      this.getMinutes(),
      this.getSeconds()
    );
  };

  return temp;
};

///
/// Date Functions
///

exports.day = function day(adate) {
  return adate.getDate();
};

exports.month = function month(adate) {
  return adate.getMonth() + 1;
};

exports.year = function year(adate) {
  return adate.getFullYear();
};

exports.hour = function hour(atime) {
  return atime.getHours();
};

exports.minute = function minute(atime) {
  return atime.getMinutes();
};

exports.second = function second(atime) {
  return atime.getSeconds();
};

exports.milliseconds = function milliseconds(atime) {
  return atime.getMilliseconds();
};

exports.timevalue = function timevalue(strtime) {
  return exports.Time_constructor(strtime);
};

exports.weekday = function weekday(a_date) {
  return a_date.getDay() + 1;
};

exports.weekday_alt = function weekday_alt(a_date, offset) {
  var res = a_date.getDay() + 1 - (offset - 1);
  return res <= 0 ? res + 7 : res;
};

exports.utc = function utc(a_datetime) {
  const result = Date.UTC(
    a_datetime.getFullYear(),
    a_datetime.getMonth(),
    a_datetime.getDate(),
    a_datetime.getHours(),
    a_datetime.getMinutes(),
    a_datetime.getSeconds(),
    a_datetime.getMilliseconds()
  );
  // console.log(a_datetime.toString());
  // console.log(a_datetime.toDateString());
  // console.log(new Date(result).toUTCString());
  return result;
};

exports.date_add_n = function date_add_n(a, b) {
  var date_copy = a.copy();
  date_copy.setTime(date_copy.getTime() + b * dayLength);
  return date_copy;
};

exports.datetime_time_add = function datetime_time_add(a, b) {
  var date_copy = a.copy();
  date_copy.setTime(date_copy.getTime() + b.getTime());
  return date_copy;
};

exports.date_subs_n = function date_subs_n(a, b) {
  var date_copy = a.copy();
  date_copy.setTime(date_copy.getTime() - b * dayLength);
  return date_copy;
};

exports.datetime_diff = function datetime_diff(a, b) {
  var time_diff = exports.Time_constructor(0, 0, 0);
  var diff = Math.floor(a.getTime() / 1000) - Math.floor(b.getTime() / 1000);
  time_diff.setTime(diff * 1000);

  return time_diff;
};

exports.datetime_time_subs = function datetime_time_subs(a, b) {
  var date_copy = a.copy();
  date_copy.setTime(date_copy.getTime() - b.getTime());
  return date_copy;
};

exports.time_by_scalar = function time_by_scalar(a, b) {
  if (typeof a === "number") {
    var temp = b;
    b = a;
    a = temp;
  }

  var time_res = exports.Time_constructor(0, 0, 0);
  time_res.setTime(a.getTime() * b);

  return time_res;
};

exports.date_time_combine = function date_time_combine(a, b) {
  return exports.Datetime_constructor(
    a.getFullYear(),
    a.getMonth() + 1,
    a.getDate(),
    b.getHours(),
    b.getMinutes(),
    b.getSeconds()
  );
};

exports.dateStr = function datestr(datetext, dynamic) {
  var date = datetext;
  if (typeof datetext == "string") date = new Date(datetext);

  if (isNaN(date.valueOf())) {
    if (dynamic)
      return type.Invalid.constructor(
        "#VALUE!",
        "The date must have a valid format"
      );
    else
      throw type.Invalid.constructor(
        "#VALUE!",
        "The date must have a valid format"
      );
  }
  return date;
};

exports.timeStr = function timestr(hourtext, dynamic) {
  var now = new Date();
  var time = new Date(
    "" +
      now.getFullYear() +
      "-" +
      now.getMonth() +
      "-" +
      now.getDate() +
      " " +
      hourtext
  );
  if (isNaN(time.valueOf())) {
    if (dynamic) {
      return type.Invalid.constructor(
        "#VALUE!",
        "The time must have a valid format"
      );
    } else {
      throw type.Invalid.constructor(
        "#VALUE!",
        "The time must have a valid format"
      );
    }
  }
  return time;
};

exports.DATE = function date(year, month, day) {
  if (
    typeof year != "number" ||
    typeof month != "number" ||
    typeof day != "number"
  ) {
    throw type.Invalid.constructor("#VALUE!", "The values must be numbers");
  }
  if (year < 0 || year >= 10000) {
    throw type.Invalid.constructor(
      "#NUM!",
      "The year must be between 0 and 10000"
    );
  }
  if (year < 1899) {
    year += 1900;
  }
  return new Date(year, month - 1, day).toLocaleDateString();
};

exports.DATE_D = function date(year, month, day) {
  if (
    typeof year != "number" ||
    typeof month != "number" ||
    typeof day != "number"
  ) {
    return type.Invalid.constructor("#VALUE!", "The values must be numbers");
  }
  if (year < 0 || year >= 10000) {
    return type.Invalid.constructor(
      "#NUM!",
      "The year must be between 0 and 10000"
    );
  }
  if (year < 1899) {
    year += 1900;
  }
  return new Date(year, month - 1, day).toLocaleDateString();
};

exports.DATEVALUE = function datevalue(datetext) {
  var date = exports.dateStr(datetext, false);
  return exports.Date_constructor(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
};

exports.DATEVALUE_D = function datevalue(datetext) {
  var date = exports.dateStr(datetext, true);
  if (date.hasOwnProperty("code")) return date;
  else
    return exports.Date_constructor(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
};

exports.DATETIME_VALUE_D = function datetime_value(datetext) {
  var date = exports.dateStr(datetext, true);
  if (date.hasOwnProperty("code")) return date;
  else
    return exports.Date_constructor(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds
    );
};

exports.DAY = function day(datetext) {
  var date = exports.dateStr(datetext, false);
  return date.hasOwnProperty("code") ? date : date.getDate();
};

exports.DAY_D = function day(datetext) {
  var date = exports.dateStr(datetext, true);
  return date.hasOwnProperty("code") ? date : date.getDate();
};

exports.DAYS = function days(endDate, beginDate) {
  var end = endDate,
    begin = beginDate;
  if (typeof endDate == "string") {
    end = new Date(endDate);
  }
  if (typeof beginDate == "string") {
    begin = new Date(beginDate);
  }
  if (isNaN(end.valueOf()) || isNaN(begin.valueOf())) {
    throw type.Invalid.constructor(
      "#VALUE!",
      "The date must have a valid format"
    );
  }
  return Math.abs(end - begin) / (3600000 * 24);
};

exports.DAYS_D = function days(endDate, beginDate) {
  var end = endDate,
    begin = beginDate;
  if (typeof endDate == "string") {
    end = new Date(endDate);
  }
  if (typeof beginDate == "string") {
    begin = new Date(beginDate);
  }
  if (isNaN(end.valueOf()) || isNaN(begin.valueOf())) {
    return type.Invalid.constructor(
      "#VALUE!",
      "The date must have a valid format"
    );
  }
  return Math.abs(end - begin) / (3600000 * 24);
};

exports.EDATE = function edate(date, months) {
  var date = exports.dateStr(date, false);
  if (date.hasOwnProperty("code")) {
    return date;
  }
  date.setMonth(date.getMonth() + months);
  return date.toLocaleDateString();
};

exports.EDATE = function edate(date, months) {
  var date = exports.dateStr(date, true);
  if (date.hasOwnProperty("code")) {
    return date;
  }
  date.setMonth(date.getMonth() + months);
  return date.toLocaleDateString();
};

exports.EOMONTHS = function eomonths(date, months) {
  var allMonths = {
    1: 31,
    2: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
  };
  var date = exports.dateStr(date, false);
  if (date.hasOwnProperty("code")) {
    return date;
  }
  date.setMonth(date.getMonth() + months);
  var eomonth = allMonths[date.getMonth() + 1];
  if (eomonth == 28 && date.getFullYear() % 4 == 0) {
    eomonth = 29;
  }
  date.setDate(eomonth);
  return date.toLocaleDateString();
};

exports.EOMONTHS_D = function eomonths(date, months) {
  var allMonths = {
    1: 31,
    2: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
  };
  var date = exports.dateStr(date, true);
  if (date.hasOwnProperty("code")) {
    return date;
  }
  date.setMonth(date.getMonth() + months);
  var eomonth = allMonths[date.getMonth() + 1];
  if (eomonth == 28 && date.getFullYear() % 4 == 0) {
    eomonth = 29;
  }
  date.setDate(eomonth);
  return date.toLocaleDateString();
};

exports.HOUR = function hour(hourtext) {
  var time = exports.timeStr(hourtext, false);
  return time.hasOwnProperty("code") ? time : time.getHours();
};

exports.HOUR_D = function hour(hourtext) {
  var time = exports.timeStr(hourtext, true);
  return time.hasOwnProperty("code") ? time : time.getHours();
};

exports.MINUTE = function minute(hourtext) {
  var time = exports.timeStr(hourtext, false);
  return time.hasOwnProperty("code") ? time : time.getMinutes();
};

exports.MINUTE_D = function minute(hourtext) {
  var time = exports.timeStr(hourtext, true);
  return time.hasOwnProperty("code") ? time : time.getMinutes();
};

exports.MONTH = function month(datetext) {
  var date = exports.dateStr(datetext, false);
  return date.hasOwnProperty("code") ? date : date.getMonth() + 1;
};

exports.MONTH_D = function month(datetext) {
  var date = exports.dateStr(datetext, true);
  return date.hasOwnProperty("code") ? date : date.getMonth() + 1;
};

exports.NOW = function now() {
  return new Date().toString();
};

exports.SECOND = function second(hourtext) {
  var time = exports.timeStr(hourtext, false);
  return time.hasOwnProperty("code") ? time : time.getSeconds();
};

exports.SECOND_D = function second(hourtext) {
  var time = exports.timeStr(hourtext, true);
  return time.hasOwnProperty("code") ? time : time.getSeconds();
};

exports.TIME = function time(hour, minute, second) {
  var dateTime = exports.timeStr(
    "" + hour + ":" + minute + ":" + second,
    false
  );
  return dateTime.hasOwnProperty("code")
    ? dateTime
    : dateTime.toLocaleTimeString();
};

exports.TIME_D = function time(hour, minute, second) {
  var dateTime = exports.timeStr("" + hour + ":" + minute + ":" + second, true);
  return dateTime.hasOwnProperty("code")
    ? dateTime
    : dateTime.toLocaleTimeString();
};
exports.TODAY = function today() {
  return new Date().toLocaleDateString();
};

exports.WEEKDAY = function weekday(datetext) {
  var date = exports.dateStr(datetext, false);
  return date.hasOwnProperty("code") ? date : date.getDay() + 1;
};

exports.WEEKDAY_D = function weekday(datetext) {
  var date = exports.dateStr(datetext, true);
  return date.hasOwnProperty("code") ? date : date.getDay() + 1;
};

exports.WEEKNUM = function weeknum(datetext) {
  var date = exports.dateStr(datetext, false);
  if (date.hasOwnProperty("code")) {
    return date;
  }
  var tmp = new Date(date.getFullYear(), 0, 1);
  var millisecsInDay = dayLength;
  return Math.ceil(((date - tmp) / millisecsInDay + tmp.getDay() + 1) / 7);
};

exports.WEEKNUM_D = function weeknum(datetext) {
  var date = exports.dateStr(datetext, true);
  if (date.hasOwnProperty("code")) {
    return date;
  }
  var tmp = new Date(date.getFullYear(), 0, 1);
  var millisecsInDay = dayLength;
  return Math.ceil(((date - tmp) / millisecsInDay + tmp.getDay() + 1) / 7);
};

exports.YEAR = function year(datetext) {
  var date = exports.dateStr(datetext, false);
  return date.hasOwnProperty("code") ? date : date.getFullYear();
};

exports.YEAR_D = function year(datetext) {
  var date = exports.dateStr(datetext, true);
  return date.hasOwnProperty("code") ? date : date.getDate();
};

exports.today = function today() {
  return exports.Date_constructor();
};

exports.now = function now() {
  return exports.Datetime_constructor();
};

// console.log(EDATE("01-1-11", 1));
// console.log(EOMONTHS("1-1-11", 1));
// console.log(TIME(12, 0, 0));
// console.log(NOW());
// console.log(TODAY());
