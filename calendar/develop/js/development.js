var cal, resizeThrottled;
var useCreationPopup = true;
var useDetailPopup = true;
var datePicker, selectedCalendar;
console.log(CalendarList, '=====');

cal = new tui.Calendar('#calendar', {
    defaultView: 'month',
    useCreationPopup: useCreationPopup,
    useDetailPopup: useDetailPopup,
    calendars: CalendarList,
});

cal.on({
    'clickDayname': function (date) {
        console.log('clickDayname', date);
    },
    // 新增日程
    'beforeCreateSchedule': function (e) {
        console.log('beforeCreateSchedule', e);
        saveNewSchedule(e);
    },
    // 拖拽、更新、拉伸日程
    'beforeUpdateSchedule': function (e) {
        var schedule = e.schedule;
        var changes = e.changes;

        console.log('beforeUpdateSchedule', e);

        if (changes && !changes.isAllDay && schedule.category === 'allday') {
            changes.category = 'time';
        }

        cal.updateSchedule(schedule.id, schedule.calendarId, changes);
        refreshScheduleVisibility();
    },
    // 删除日程
    'beforeDeleteSchedule': function (e) {
        console.log('beforeDeleteSchedule', e);
        cal.deleteSchedule(e.schedule.id, e.schedule.calendarId);
    },
});


// 新增保存
function saveNewSchedule(scheduleData) {
    var calendar = scheduleData.calendar || findCalendar(scheduleData.calendarId);
    var schedule = {
        id: String(chance.guid()),
        title: scheduleData.title, // 名称
        isAllDay: scheduleData.isAllDay,
        start: scheduleData.start,
        end: scheduleData.end,
        category: scheduleData.isAllDay ? 'allday' : 'time',
        dueDateClass: '',
        color: calendar.color,
        bgColor: calendar.bgColor,
        dragBgColor: calendar.bgColor,
        borderColor: calendar.borderColor,
        location: scheduleData.location,
        isPrivate: scheduleData.isPrivate,
        state: scheduleData.state
    };
    if (calendar) {
        schedule.calendarId = calendar.id;
        schedule.color = calendar.color;
        schedule.bgColor = calendar.bgColor;
        schedule.borderColor = calendar.borderColor;
    }
    console.log(schedule, '--');

    cal.createSchedules([schedule]);

    refreshScheduleVisibility();
}

function refreshScheduleVisibility() {
    var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));

    CalendarList.forEach(function (calendar) {
        cal.toggleSchedules(calendar.id, !calendar.checked, false);
    });

    cal.render(true);

    calendarElements.forEach(function (input) {
        var span = input.nextElementSibling;
        span.style.backgroundColor = input.checked ? span.style.borderColor : 'transparent';
    });
}


function onClickNavi(e) {
    console.log(1);
    var action = getDataAction(e.target);

    switch (action) {
        case 'move-prev':
            cal.prev();
            break;
        case 'move-next':
            cal.next();
            break;
        case 'move-today':
            cal.today();
            break;
        default:
            return;
    }

    setRenderRangeText();
    setSchedules();
}

function onNewSchedule() {
    var title = $('#new-schedule-title').val();
    var location = $('#new-schedule-location').val();
    var isAllDay = document.getElementById('new-schedule-allday').checked;
    var start = datePicker.getStartDate();
    var end = datePicker.getEndDate();
    var calendar = selectedCalendar ? selectedCalendar : CalendarList[0];

    if (!title) {
        return;
    }

    cal.createSchedules([{
        id: String(chance.guid()), // id
        calendarId: calendar.id, // 记录类型
        title: title, // 标题
        isAllDay: isAllDay, // 是否全天
        location: location, // 位置
        start: start, // 开始时间
        end: end, // 结束时间
        category: isAllDay ? 'allday' : 'time',
        dueDateClass: '',
        color: calendar.color,
        bgColor: calendar.bgColor,
        dragBgColor: calendar.bgColor,
        borderColor: calendar.borderColor,
        state: 'Busy'
    }]);

    console.log(cal);

    $('#modal-new-schedule').modal('hide');
}

function onChangeNewScheduleCalendar(e) {
    var target = $(e.target).closest('a[role="menuitem"]')[0];
    var calendarId = getDataAction(target);
    changeNewScheduleCalendar(calendarId);
}

function changeNewScheduleCalendar(calendarId) {
    var calendarNameElement = document.getElementById('calendarName');
    var calendar = findCalendar(calendarId);
    var html = [];

    html.push('<span class="calendar-bar" style="background-color: ' + calendar.bgColor + '; border-color:' + calendar.borderColor + ';"></span>');
    html.push('<span class="calendar-name">' + calendar.name + '</span>');

    calendarNameElement.innerHTML = html.join('');

    selectedCalendar = calendar;
}

function createNewSchedule(event) {
    var start = event.start ? new Date(event.start.getTime()) : new Date();
    var end = event.end ? new Date(event.end.getTime()) : moment().add(1, 'hours').toDate();

    if (useCreationPopup) {
        cal.openCreationPopup({
            start: start,
            end: end
        });
    }
}


function onChangeCalendars(e) {
    var calendarId = e.target.value;
    var checked = e.target.checked;
    var viewAll = document.querySelector('.lnb-calendars-item input');
    var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));
    var allCheckedCalendars = true;

    if (calendarId === 'all') {
        allCheckedCalendars = checked;

        calendarElements.forEach(function (input) {
            var span = input.parentNode;
            input.checked = checked;
            span.style.backgroundColor = checked ? span.style.borderColor : 'transparent';
        });

        CalendarList.forEach(function (calendar) {
            calendar.checked = checked;
        });
    } else {
        findCalendar(calendarId).checked = checked;

        allCheckedCalendars = calendarElements.every(function (input) {
            return input.checked;
        });

        if (allCheckedCalendars) {
            viewAll.checked = true;
        } else {
            viewAll.checked = false;
        }
    }

    refreshScheduleVisibility();
}


function currentCalendarDate(format) {
    var currentDate = moment([cal.getDate().getFullYear(), cal.getDate().getMonth(), cal.getDate().getDate()]);

    return currentDate.format(format);
}

function setRenderRangeText() {
    var renderRange = document.getElementById('renderRange');
    var options = cal.getOptions();
    var viewName = cal.getViewName();

    var html = [];
    if (viewName === 'day') {
        html.push(currentCalendarDate('YYYY.MM.DD'));
    } else if (viewName === 'month' &&
        (!options.month.visibleWeeksCount || options.month.visibleWeeksCount > 4)) {
        html.push(currentCalendarDate('YYYY.MM'));
    } else {
        html.push(moment(cal.getDateRangeStart().getTime()).format('YYYY.MM.DD'));
        html.push(' ~ ');
        html.push(moment(cal.getDateRangeEnd().getTime()).format(' MM.DD'));
    }
    renderRange.innerHTML = html.join('');
}

function setSchedules() {
    console.log(ScheduleList);
    cal.clear();
    generateSchedule(cal.getViewName(), cal.getDateRangeStart(), cal.getDateRangeEnd());
    cal.createSchedules(ScheduleList);

    refreshScheduleVisibility();
}

function setEventListener() {
    $('#menu-navi').on('click', onClickNavi);
    $('#lnb-calendars').on('change', onChangeCalendars);

    $('#btn-save-schedule').on('click', onNewSchedule);
    $('#btn-new-schedule').on('click', createNewSchedule);

    $('#dropdownMenu-calendars-list').on('click', onChangeNewScheduleCalendar);

    window.addEventListener('resize', resizeThrottled);
}

function getDataAction(target) {
    return target.dataset ? target.dataset.action : target.getAttribute('data-action');
}

resizeThrottled = tui.util.throttle(function () {
    cal.render();
}, 50);

window.cal = cal;

setRenderRangeText();
setSchedules();
setEventListener();
