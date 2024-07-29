﻿let calendar = null;
$(function () {
    // from Controller
    var startDate = $('#startDate').val()

    let baseDay = moment(startDate)
    $.ajax({
        type: "GET",
        url: baseUrl + "Base/GetHolidays",
        success: function (result) {
            holidays = result;
            navigate(baseDay)

        },
        error: function (xhr) {
        }
    });

    $('#add_facility').click(function () {
        if (calendar != null) {
            var currentView = calendar.view;
            var startDate = currentView.activeStart;

            if (viewMode == 'Week')
                window.location.href = "CreateNormalWeek?start_date=" + moment(startDate).format('YYYY-MM-DD');
            else
                window.location.href = "CreateNormalDay?start_date=" + moment(startDate).format('YYYY-MM-DD');
        }
    });

    $('#keyword').on('keydown', function(event) {
        if (event.which == 13) {
            event.preventDefault();
            refreshCalendar();
        }
    });
    $('#keyword').on('blur', function() {
        refreshCalendar();
    });
    $('#place_list').on('change', function () {
        refreshCalendar();
    })    
})

function refreshCalendar() {
    if (calendar != null) {
        var currentView = calendar.view;
        baseDay = currentView.activeStart;
        navigate(baseDay);
    }    
}

function navigate(baseDay) {
    keyword = $('#keyword').val();
    var place = $('#place_list').val();

    var date_from = new moment(baseDay).format('YYYY-MM-DD');

    $.ajax({
        method: "get",
        url: 'FacilityList' + '?place=' + place + '&keyword=' + keyword,
        success: function (result) {
            console.log(result);
            if (result.placeList != undefined) {
                updateOnResponse(result.placeList, result.scheduleList, date_from);
            }
        },
        error: function (xhr) {
            console.log("Error:" + xhr.responseText);
        }
    })
}

function updateOnResponse(placeList, scheduleList, initialDate) {
    var resourcesData = [];
    var eventsData = [];

    if (placeList != null && placeList.length > 0) {
        if (viewMode == 'Week') {
            var start_time = "23:00";
            var end_time = "24:00";
            placeList.forEach(item => {
                resourcesData.push({ 'id': item.place_cd, 'title': item.place_name, 'sort_id': item.sort })
                eventsData.push({
                    'resourceId': item.place_cd,
                    'startTime': start_time,
                    'endTime': end_time,
                    'is_add': 1
                })
            })
        } else {
            placeList.forEach(item => {
                resourcesData.push({ 'id': item.place_cd, 'title': item.place_name, 'sort_id': item.sort })

                var start = moment().hours(7).minute(0);
                for (var i = 0; i < 13; i++) {
                    var start_time = start.format("HH:mm")
                    var end_time = start.add(1, 'hours').format("HH:mm")
                    eventsData.push({
                        'resourceId': item.place_cd,
                        'startTime': start_time,
                        'endTime': end_time,
                        'is_add': 1
                    })
                }
            })
        }

        if (scheduleList != null && scheduleList.length > 0) {
            loadCalendarEventsData(0, 'place', scheduleList, eventsData)
        }
    }

    let slotDuration;
    let viewMode_;
    let buttons;
    if (viewMode == 'Week') {
        slotDuration = { days: 1 }; // Set slot duration to 1 day
        viewMode_ = "resourceTimelineWeek";
        buttons = 'prev,prev_day,next_day,next today';
    }
    else {
        slotDuration = { hours: 1 }; // Set slot duration to 1 hour
        viewMode_ = "resourceTimelineDay";
        buttons = 'prev,prev_day,next_day,next today';
    }
    var calendarEl = document.getElementById('calendar');
    if (calendar != null) {
        calendar.destroy();
    }
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: viewMode_,
        initialDate: initialDate,
        firstDay: new Date().getDay(),

        slotDuration: slotDuration, // Set the slot duration to 1 day
        slotLabelInterval: slotDuration, // Display slot labels for each day
        slotMinTime: '07:00:00', // Set the minimum time to display
        slotMaxTime: '20:00:00', // Set the maximum time to display

        slotLaneClassNames: function() {
            return 'weekday-only';
        },
        locale: 'ja',
        timeZone: 'local',

        customButtons: {
            prev_day: {
                text: '前日',
            },
            next_day: {
                text: '翌日',
            }
        },
        headerToolbar: {
            left: '',
            center: 'title',
            right: buttons
        },
        views: {
            resourceTimelineWeek: {
                duration: { days: 7 },
                dateIncrement: { days: 1 },
                titleFormat: (info) => {
                    var date = new Date(info.date.year, info.date.month, info.date.day);
                    const formattedDate = `${info.date.year} 年 ${info.date.month + 1} 月 ${info.date.day} 日 `;
                    const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
                    date.setDate(date.getDate() + 6);
                    const formattedEndDate = `${date.getDate()} 日 `;
                    const weekdayEnd = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];

                    return `${formattedDate}(${weekday})  – ${formattedEndDate}(${weekdayEnd})`;
                },
            },
            resourceTimelineDay: {
                titleFormat: (info) => {
                    var date = new Date(info.date.year, info.date.month, info.date.day);
                    const formattedDate = `${info.date.year} 年 ${info.date.month + 1} 月 ${info.date.day} 日 `;
                    const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
                    return `${formattedDate}(${weekday})`;
                },
            },
        },
        buttonText: {
            today: '今日',
            prev: '前週',
            next: '翌週'
        },
        editable: true,
        eventResourceEditable: false,
        eventDurationEditable: false, // Disable Resize
        height: '500px',
        slotLabelClassNames : function(data) {
            var localDate = data.date;            
            var year = localDate.getFullYear();
            var month = String(localDate.getMonth() + 1).padStart(2, '0');
            var day = String(localDate.getDate()).padStart(2, '0');
            var stringDate = year + '-' + month + '-' + day;

            if ($.inArray(stringDate, holidays) !== -1) {
                return 'ast-holiday';
            }
        },
        slotLabelContent: function(arg) {
            if (arg.view.type == 'resourceTimelineWeek') {
                let dayNumber = arg.date.getDate();
                let dayOfWeek = arg.date.toLocaleDateString('ja', {weekday: 'short'});
    
                return `${dayNumber} (${dayOfWeek})`;
            }
            else {
                return arg.text;
            }
        },     
        resourceAreaWidth: "12%",
        resourceAreaHeaderContent: "",
        resourceLabelContent: function(arg) {
          var description = arg.resource._resource.title;

          return {
            html: '<div class="resource-description">' + description + '</div>'
          };
        },

        resources: resourcesData,
        resourceOrder: 'sort_id',
        events: eventsData,
        eventClassNames: 'event',
        eventContent: function (arg) {
            var props = arg.event.extendedProps;
            let startTime = arg.event.start;
            let endTime = arg.event.end;
            let from = moment(startTime, 'YYYY/MM/DD HH:mm').format('YYYY/MM/DD HH:mm');
            let to = moment(endTime, 'YYYY/MM/DD HH:mm').format('YYYY/MM/DD HH:mm');

            if (props.is_add) {
                return {
                    html: `<div class="cell-add" data-from="${from}"><i class="bi bi-plus ic-cell-add"></i></div>`
                };
            } else {
                var contentStyle = props.bkcolor == undefined ? `` : ` style="background-color:${props.bkcolor}"`
                let schedule_no = props.schedule_no;
                let place_cd = props.place_cd;
                let duplicate = props.duplicate;

                // Format the start and end times to display in the format of 7.00-8.00
                let formattedStartTime = startTime.toLocaleTimeString('ja', {hour: 'numeric', minute: '2-digit'});
                let formattedEndTime = endTime.toLocaleTimeString('ja', {hour: 'numeric', minute: '2-digit'});
            
                if (props.is_private) {
                    return {
                        html: `<div class="fc-content"${contentStyle} data-from="${from}" data-to="${to}" data-schedule_no="${schedule_no}" data-place_cd="${place_cd}" data-duplicate="${duplicate}">
                                    <div class="fc-date">${formattedStartTime}-${formattedEndTime}</div>
                                    <div class="px-1">
                                        <span class="fc-type px-1" style="background-color:${props.typecolor}; height:fit-content;">${props.typename}</span>
                                        <i class="bi bi-lock-fill fc-lock"></i>
                                        <span class="fc-title" style="color:${props.typecolor}">${arg.event.title}</span>
                                    </div>
                                </div>`
                    };
                }
                else {
                    return {
                        html: `<div class="fc-content"${contentStyle} data-from="${from}" data-to="${to}" data-schedule_no="${schedule_no}" data-place_cd="${place_cd}" data-duplicate="${duplicate}">
                                    <div class="fc-date">${formattedStartTime}-${formattedEndTime}</div>
                                    <div class="px-1">
                                        <span class="fc-type px-1" style="background-color:${props.typecolor}; height:fit-content;">${props.typename}</span>
                                        <span class="fc-title" style="color:${props.typecolor}">${arg.event.title}</span>
                                    </div>
                                </div>`
                    };
                }
            }

        },
        eventDrop: function(event) {
            let e = event.event;
            $.ajax({
                method: "POST",
                url: baseUrl + "ScheduleFacility/UpdateDuration",
                data: {
                    schedule_no: e.extendedProps.schedule_no,
                    place_cd: e.extendedProps.place_cd,
                    start: e.startStr,
                    end: e.endStr
                },                
                success: function (result) {
                    console.log(result);
                },
                error: function (xhr) {
                    console.log("Error:" + xhr.responseText);
                }
            })
        },
        eventClick: function (info) {
            var schedule_no = info.event.extendedProps.schedule_no
            var currentView = calendar.view;
            var startDate = currentView.activeStart;
    
            var action = null
            if (viewMode == 'Week')
                action = "EditNormalWeek"
            else
                action = "EditNormalDay"
            if (schedule_no == undefined) {
                schedule_no = 0
                currDate = info.event.start
                startTime = moment(info.event.start).format('HH:mm')
                endTime = moment(info.event.end).format('HH:mm')
                var url = `${action}?schedule_no=${schedule_no}&start_date=${moment(startDate).format('YYYY-MM-DD')}&curr_date=${moment(currDate).format('YYYY-MM-DD')}`
                if (viewMode == 'Day')
                    url += `&start_time=${startTime}&end_time=${endTime}`
                window.location.href = url
            } else {
                window.location.href = `${action}?schedule_no=${schedule_no}&start_date=${moment(startDate).format('YYYY-MM-DD')}`
            }
        },

        viewClassNames: function (fn) {
            /*$(".fc-content").each(function () {
                var duplicated = false;
                var thiz = $(this);
                var schedule_no = thiz.data('schedule_no');
                var place_cd = thiz.data('place_cd');
                var duplicate = thiz.data('duplicate');
                var from = moment(thiz.data('from'), 'YYYY/MM/DD HH:mm');
                var to = moment(thiz.data('to'), 'YYYY/MM/DD HH:mm');

                $(".fc-content").each(function () {
                    var thiz1 = $(this);

                    if (schedule_no == thiz1.data('schedule_no') && place_cd == thiz1.data('place_cd')) return; // itself
                    if (place_cd != thiz1.data('place_cd')) return; // different place

                    var item_from = moment(thiz1.data('from'), 'YYYY/MM/DD HH:mm');
                    var item_to = moment(thiz1.data('to'), 'YYYY/MM/DD HH:mm');
                    if (item_from.isAfter(to) || item_to.isBefore(from)) return;

                    if (duplicate == false && thiz1.data('duplicate') == true) {
                        return;
                    } else {
                        duplicated = true;
                    }
                });

                if (duplicated) {
                    //thiz.attr('duplicated', true);
                    if (thiz.find(".fc-duplicated").length == 0) {
                        thiz.find(".fc-date").prepend('<i class="bi bi-exclamation-triangle-fill fc-duplicated" style="color:red"></i>');
                    }
                }
            });*/

            $("a.fc-event:has(.cell-add)").removeClass("fc-h-event");
            $("a.fc-event:has(.cell-add)").css({
                'margin': '1px',
                'box-shadow': 'none'
            });
            $("a.fc-event:has(.cell-add)").css({
                'width': 'fit-content'
            });
        }
    });
      
    calendar.render();

    $('.fc-prev-button').click(function() {
        calendar.incrementDate({ day: -6 });
    });
    $('.fc-prev_day-button').click(function() {
        calendar.incrementDate({ day: -1 });
    });

    $('.fc-next_day-button').click(function() {
        calendar.incrementDate({ day: +1 });
    });
    $('.fc-next-button').click(function() {
        calendar.incrementDate({ day: +6 });
    });
}
