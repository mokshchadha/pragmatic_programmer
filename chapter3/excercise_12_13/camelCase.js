const moment = require("moment-timezone");

function datetime(dt = null) {
  return dt === null
    ? moment().tz("Asia/Kolkata")
    : moment(dt).tz("Asia/Kolkata");
}
function unixTimestamp(dt = null) {
  return datetime(dt).valueOf();
}

function timestampAfterMins(mins, dt = null) {
  return unixTimestamp(dt) + minAsMillis(mins);
}

function formatDateTimeForSheets(timeInMS) {
  return datetime(timeInMS).format("DD-MM-YY HH:mm:ss");
}
function formatDateTimeForZA(timeInMS) {
  return datetime(timeInMS).format("DD-MM-YYYY HH:mm");
}

function minAsMillis(mins) {
  return 1000 * 60 * mins;
}

function hoursAsMillis(hours) {
  return 1000 * 60 * 60 * hours;
}
function daysAsMillis(days) {
  return hoursAsMillis(24) * days;
}

function parseZohoDate(str) {
  return moment(str, "YYYY-MM-DD").tz("Asia/Kolkata");
}

function isSameDate(date1, date2) {
  return date1.isSame(date2, "day");
}

function isBeforeDate(date1, date2) {
  return date1.isBefore(date2);
}

function isAfterDate(date1, date2) {
  return date1.isAfter(date2);
}

function addDays(days, date = datetime()) {
  return date.add(days, "days");
}

function setHour(hour, date = datetime()) {
  return date.set({ hour: hour, minute: 0, second: 0, millisecond: 0 });
}

function getHour(date = datetime()) {
  return date.get("hours");
}

function getMinute(date = datetime()) {
  return date.get("minutes");
}

function getDay(date = datetime()) {
  return date.get("days");
}

function nextDayAtHour(hour) {
  return datetime()
    .add(1, "days")
    .set({ hour: hour, minute: 0, second: 0, millisecond: 0 });
}

function nextNDaysAtHour(
  nDays,
  hour = 0,
  minute = 0,
  second = 0,
  millisecond = 0
) {
  return datetime()
    .add(nDays, "days")
    .set({ hour, minute, second, millisecond });
}
function previousNDaysAtHour(
  nDays,
  hour = 0,
  minute = 0,
  second = 0,
  millisecond = 0
) {
  return datetime()
    .subtract(nDays, "days")
    .set({ hour, minute, second, millisecond })
    .valueOf();
}

function subtractDays(days, date = datetime()) {
  return date.subtract(days, "days");
}

function timestampAtHour(hour = 0) {
  return setHour(hour).valueOf();
}

function formatDate(format, date = datetime()) {
  return date.format(format);
}

function formatDateInStdFormat(date = datetime()) {
  return date.format("DD/MM/YY");
}

function diffInDays(oldDate, newDate) {
  if (oldDate && newDate) return newDate.diff(oldDate, "days");
}

function diffInMins(oldDate, newDate) {
  if (oldDate && newDate) return newDate.diff(oldDate, "minutes");
}

function dateAfter1pm() {
  return getDay() === 6
    ? formatDate("YYYY-MM-DD", addDays(2))
    : formatDate("YYYY-MM-DD", addDays(1));
}

function getFirstDayOfNextMonth(now = datetime()) {
  return unixTimestamp(
    now.add(31, "days").set({ date: 1, hour: 21, minute: 15 })
  );
}

function getFirstDayOfLast6Month(now = datetime()) {
  return unixTimestamp(
    now.add(-6, "months").set({ date: 1, hour: 0, minute: 0 })
  );
}

function getFinancialYear(now = datetime()) {
  const year = now.month() < 3 ? now.year() - 1 : now.year();
  const currentYear = parseInt(String(year).substring(2, 4));
  return `${currentYear}${currentYear + 1}`;
}

function getFinancialYearStartDate(now = datetime()) {
  const year = now.month() < 3 ? now.year() - 1 : now.year();
  return setHour(0, datetime(`${year}-04-01`));
}

function getFinancialYearEndDate(now = datetime()) {
  const year = now.month() >= 3 ? now.year() + 1 : now.year();
  return setHour(23, datetime(`${year}-03-31`));
}

function getLastDayOfPrevMonth(now = datetime()) {
  return now.set({ date: 1 }).add(-1, "days").format("YYYY-MM-DD");
}

function formatDateTime(format, dateTime) {
  return dateTime && moment(dateTime).format(format);
}

function timeFormatFromNow(timestamp) {
  return moment(timestamp).fromNow();
}

function isPostponed(newDate, oldDate) {
  return isAfterDate(parseZohoDate(newDate), parseZohoDate(oldDate));
}

function getNextSunday(hour, minute) {
  const dayINeed = 7; // for Sunday
  const today = datetime().isoWeekday();
  const sunday = datetime().isoWeekday(dayINeed).set({ hour, minute });
  if (today < dayINeed) {
    return unixTimestamp(sunday);
  } else {
    return unixTimestamp(sunday.add(1, "weeks"));
  }
}

function calculateBusinessDays(s, e) {
  if (!s || !e) return 0;
  const startDate = new Date(s);
  const endDate = new Date(e);
  if (endDate < startDate) return 0;
  const millisecondsPerDay = 86400 * 1000;
  startDate.setHours(0, 0, 0, 1);
  endDate.setHours(23, 59, 59, 999);
  const diff = endDate - startDate;
  const days = Math.ceil(diff / millisecondsPerDay);
  const sundays = Math.floor(days / 7);
  const daysExcludingSunday = days - sundays;
  var startDay = startDate.getDay();
  var endDay = endDate.getDay();
  if (startDay - endDay > 1) {
    return daysExcludingSunday - 2;
  }
  if (startDay == 0) {
    return daysExcludingSunday - 1;
  }
  if (endDay == 0) {
    return daysExcludingSunday - 2;
  }
  return daysExcludingSunday - 1;
}

function getTimeDifference(timestamp) {
  if (!timestamp) return;
  const timeDifference = unixTimestamp() - timestamp;
  const duration = moment.duration(timeDifference);
  const years = duration.years();
  const months = duration.months();
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();
  if (years) return years + " yr";
  if (months) return months + " mon";
  if (days) return days + " day";
  if (hours) return hours + " hr";
  if (minutes) return minutes + " min";
  if (seconds) return seconds + " sec";
}

// no longer used
function convertInTimeAgoFormat(time) {
  const currentTime = Date.now();
  const timeDiffSec = (currentTime - time) / 1000;
  if (timeDiffSec < 60) {
    return `${Math.floor(timeDiffSec)} sec ago`;
  } else if (timeDiffSec < 3600) {
    return `${Math.floor(timeDiffSec / 60)} min ago`;
  } else if (timeDiffSec < 86400) {
    return `${Math.floor(timeDiffSec / 3600)} hours ago`;
  } else if (timeDiffSec < 1488000) {
    return `${Math.floor(timeDiffSec / 86400)} days ago`;
  } else if (timeDiffSec < 31104000) {
    return `${Math.floor(timeDiffSec / 1488000)} months ago`;
  } else {
    return `${Math.floor(timeDiffSec / 31104000)} years ago`;
  }
}
