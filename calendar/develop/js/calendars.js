/**
 * 新增的下拉选项
 */

var CalendarList = [];
var calendatList = [
    {
        "id": "1",
        "name": "My Calendar",
        "checked": true,
        "color": "#ffffff",
        "bgColor": "#9e5fff",
        "borderColor": "#9e5fff",
        "dragBgColor": "#9e5fff"
    },
    {
        "id": "2",
        "name": "Company",
        "checked": true,
        "color": "#ffffff",
        "bgColor": "#00a9ff",
        "borderColor": "#00a9ff",
        "dragBgColor": "#00a9ff"
    },
    {
        "id": "3",
        "name": "Family",
        "checked": true,
        "color": "#ffffff",
        "bgColor": "#ff5583",
        "borderColor": "#ff5583",
        "dragBgColor": "#ff5583"
    },
    {
        "id": "4",
        "name": "Friend",
        "checked": true,
        "color": "#ffffff",
        "bgColor": "#03bd9e",
        "borderColor": "#03bd9e",
        "dragBgColor": "#03bd9e"
    },
    {
        "id": "5",
        "name": "Travel",
        "checked": true,
        "color": "#ffffff",
        "bgColor": "#bbdc00",
        "borderColor": "#bbdc00",
        "dragBgColor": "#bbdc00"
    },
    {
        "id": "6",
        "name": "etc",
        "checked": true,
        "color": "#ffffff",
        "bgColor": "#9d9d9d",
        "borderColor": "#9d9d9d",
        "dragBgColor": "#9d9d9d"
    },
    {
        "id": "7",
        "name": "Birthdays",
        "checked": true,
        "color": "#ffffff",
        "bgColor": "#ffbb3b",
        "borderColor": "#ffbb3b",
        "dragBgColor": "#ffbb3b"
    },
    {
        "id": "8",
        "name": "National Holidays",
        "checked": true,
        "color": "#ffffff",
        "bgColor": "#ff4040",
        "borderColor": "#ff4040",
        "dragBgColor": "#ff4040"
    }

]

function CalendarInfo() {
    this.id = null;
    this.name = null;
    this.checked = true;
    this.color = null;
    this.bgColor = null;
    this.borderColor = null;
    this.dragBgColor = null;
}

function addCalendar(calendar) {
    CalendarList.push(calendar);
}

function findCalendar(id) {
    var found;

    CalendarList.forEach(function (calendar) {
        if (calendar.id === id) {
            found = calendar;
        }
    });

    return found || CalendarList[0];
}

function hexToRGBA(hex) {
    var radix = 16;
    var r = parseInt(hex.slice(1, 3), radix),
        g = parseInt(hex.slice(3, 5), radix),
        b = parseInt(hex.slice(5, 7), radix),
        a = parseInt(hex.slice(7, 9), radix) / 255 || 1;
    var rgba = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';

    return rgba;
}

(function () {
    for (var i = 0; i < calendatList.length; i++) {
        addCalendar(calendatList[i]);
    }
})();