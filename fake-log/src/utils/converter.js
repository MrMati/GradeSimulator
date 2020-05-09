const { addDays, toDate } = require('date-fns');
const WEEK_TICK = 6048000000000;
const DAY_TICK = 864000000000;

function getDateFromTick(tick) {
    if (tick === '' || tick === undefined) {
        return getMonday(new Date());
    }

    return new Date((tick - 621355968000000000) / 10000);
}

function getTickFromDate(date) {
    return (date.getTime() * 10000) + 621355968000000000;
}

function formatDate(today, iso = false) {
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!

    let yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }

    if (iso) return `${yyyy}-${mm}-${dd}`;

    return `${dd}.${mm}.${yyyy}`;
}

function getMonday(date) {
    let day = date.getDate() - date.getDay() + 1;
    return new Date(date.getFullYear(), date.getMonth(), day);
}

function getDayName(dateStr) {
    return new Date(dateStr).toLocaleDateString("pl", {weekday: "long"});
}

function getWeekDaysFrom(startDate, number = 5) {
    if (!(startDate instanceof Date)) startDate = getDateFromTick(startDate);

    const days = [];
    for (let i = 0; i < number; i++) {
        let date = addDays(startDate, i);
        days.push([
            getDayName(date),
            formatDate(toDate(date)),
            date
        ]);
    }

    return days;
}

function getPrevWeekTick(tick) {
    return getPrevTick(tick, WEEK_TICK);
}

function getPrevDayTick(tick) {
    return getPrevTick(tick, DAY_TICK);
}

function getNextWeekTick(tick) {
    return getNextTick(tick, WEEK_TICK);
}

function getNextDayTick(tick) {
    return getNextTick(tick, DAY_TICK);
}

function getNextTick(tick, plus) {
    tick = tick ? tick : getTickFromDate(new Date());
    return parseInt(tick) + plus;
}

function getPrevTick(tick, minus) {
    tick = tick ? tick : getTickFromDate(new Date());
    return parseInt(tick) - minus;
}

exports.getDateString = getDateFromTick;
exports.getWeekDaysFrom = getWeekDaysFrom;
exports.getDayName = getDayName;
exports.getPrevDayTick = getPrevDayTick;
exports.getNextDayTick = getNextDayTick;
exports.getPrevWeekTick = getPrevWeekTick;
exports.getNextWeekTick = getNextWeekTick;
exports.formatDate = formatDate;
