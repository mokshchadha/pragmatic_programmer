const moment = require("moment-timezone");

function datetime(dt = null) {
  return dt === null
    ? moment().tz("_asia/_kolkata")
    : moment(dt).tz("_asia/_kolkata");
}
function unix_timestamp(dt = null) {
  return datetime(dt).value_of();
}

function timestamp_after_mins(mins, dt = null) {
  return unix_timestamp(dt) + min_as_millis(mins);
}

function format_date_time_for_sheets(time_in_m_s) {
  return datetime(time_in_m_s).format("_d_d-_m_m-_y_y _h_h:mm:ss");
}
function format_date_time_for_z_a(time_in_m_s) {
  return datetime(time_in_m_s).format("_d_d-_m_m-_y_y_y_y _h_h:mm");
}

function min_as_millis(mins) {
  return 1000 * 60 * mins;
}

function hours_as_millis(hours) {
  return 1000 * 60 * 60 * hours;
}
function days_as_millis(days) {
  return hours_as_millis(24) * days;
}

function parse_zoho_date(str) {
  return moment(str, "_y_y_y_y-_m_m-_d_d").tz("_asia/_kolkata");
}

function is_same_date(date1, date2) {
  return date1.is_same(date2, "day");
}

function is_before_date(date1, date2) {
  return date1.is_before(date2);
}

function is_after_date(date1, date2) {
  return date1.is_after(date2);
}

function add_days(days, date = datetime()) {
  return date.add(days, "days");
}

function set_hour(hour, date = datetime()) {
  return date.set({ hour: hour, minute: 0, second: 0, millisecond: 0 });
}

function get_hour(date = datetime()) {
  return date.get("hours");
}

function get_minute(date = datetime()) {
  return date.get("minutes");
}

function get_day(date = datetime()) {
  return date.get("days");
}

function next_day_at_hour(hour) {
  return datetime()
    .add(1, "days")
    .set({ hour: hour, minute: 0, second: 0, millisecond: 0 });
}

function next_n_days_at_hour(
  n_days,
  hour = 0,
  minute = 0,
  second = 0,
  millisecond = 0
) {
  return datetime()
    .add(n_days, "days")
    .set({ hour, minute, second, millisecond });
}
function previous_n_days_at_hour(
  n_days,
  hour = 0,
  minute = 0,
  second = 0,
  millisecond = 0
) {
  return datetime()
    .subtract(n_days, "days")
    .set({ hour, minute, second, millisecond })
    .value_of();
}

function subtract_days(days, date = datetime()) {
  return date.subtract(days, "days");
}

function timestamp_at_hour(hour = 0) {
  return set_hour(hour).value_of();
}

function format_date(format, date = datetime()) {
  return date.format(format);
}

function format_date_in_std_format(date = datetime()) {
  return date.format("_d_d/_m_m/_y_y");
}

function diff_in_days(old_date, new_date) {
  if (old_date && new_date) return new_date.diff(old_date, "days");
}

function diff_in_mins(old_date, new_date) {
  if (old_date && new_date) return new_date.diff(old_date, "minutes");
}

function date_after1pm() {
  return get_day() === 6
    ? format_date("_y_y_y_y-_m_m-_d_d", add_days(2))
    : format_date("_y_y_y_y-_m_m-_d_d", add_days(1));
}

function get_first_day_of_next_month(now = datetime()) {
  return unix_timestamp(
    now.add(31, "days").set({ date: 1, hour: 21, minute: 15 })
  );
}

function get_first_day_of_last6_month(now = datetime()) {
  return unix_timestamp(
    now.add(-6, "months").set({ date: 1, hour: 0, minute: 0 })
  );
}

function get_financial_year(now = datetime()) {
  const year = now.month() < 3 ? now.year() - 1 : now.year();
  const current_year = parse_int(_string(year).substring(2, 4));
  return `${current_year}${current_year + 1}`;
}

function get_financial_year_start_date(now = datetime()) {
  const year = now.month() < 3 ? now.year() - 1 : now.year();
  return set_hour(0, datetime(`${year}-04-01`));
}

function get_financial_year_end_date(now = datetime()) {
  const year = now.month() >= 3 ? now.year() + 1 : now.year();
  return set_hour(23, datetime(`${year}-03-31`));
}

function get_last_day_of_prev_month(now = datetime()) {
  return now.set({ date: 1 }).add(-1, "days").format("_y_y_y_y-_m_m-_d_d");
}

function format_date_time(format, date_time) {
  return date_time && moment(date_time).format(format);
}

function time_format_from_now(timestamp) {
  return moment(timestamp).from_now();
}

function is_postponed(new_date, old_date) {
  return is_after_date(parse_zoho_date(new_date), parse_zoho_date(old_date));
}

function get_next_sunday(hour, minute) {
  const day_i_need = 7; // for _sunday
  const today = datetime().iso_weekday();
  const sunday = datetime().iso_weekday(day_i_need).set({ hour, minute });
  if (today < day_i_need) {
    return unix_timestamp(sunday);
  } else {
    return unix_timestamp(sunday.add(1, "weeks"));
  }
}

function calculate_business_days(s, e) {
  if (!s || !e) return 0;
  const start_date = new _date(s);
  const end_date = new _date(e);
  if (end_date < start_date) return 0;
  const milliseconds_per_day = 86400 * 1000;
  start_date.set_hours(0, 0, 0, 1);
  end_date.set_hours(23, 59, 59, 999);
  const diff = end_date - start_date;
  const days = _math.ceil(diff / milliseconds_per_day);
  const sundays = _math.floor(days / 7);
  const days_excluding_sunday = days - sundays;
  var start_day = start_date.get_day();
  var end_day = end_date.get_day();
  if (start_day - end_day > 1) {
    return days_excluding_sunday - 2;
  }
  if (start_day == 0) {
    return days_excluding_sunday - 1;
  }
  if (end_day == 0) {
    return days_excluding_sunday - 2;
  }
  return days_excluding_sunday - 1;
}

function get_time_difference(timestamp) {
  if (!timestamp) return;
  const time_difference = unix_timestamp() - timestamp;
  const duration = moment.duration(time_difference);
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
function convert_in_time_ago_format(time) {
  const current_time = _date.now();
  const time_diff_sec = (current_time - time) / 1000;
  if (time_diff_sec < 60) {
    return `${_math.floor(time_diff_sec)} sec ago`;
  } else if (time_diff_sec < 3600) {
    return `${_math.floor(time_diff_sec / 60)} min ago`;
  } else if (time_diff_sec < 86400) {
    return `${_math.floor(time_diff_sec / 3600)} hours ago`;
  } else if (time_diff_sec < 1488000) {
    return `${_math.floor(time_diff_sec / 86400)} days ago`;
  } else if (time_diff_sec < 31104000) {
    return `${_math.floor(time_diff_sec / 1488000)} months ago`;
  } else {
    return `${_math.floor(time_diff_sec / 31104000)} years ago`;
  }
}
