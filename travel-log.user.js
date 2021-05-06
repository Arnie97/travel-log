// ==UserScript==
// @name        乘车记录查询
// @description 从“铁路畅行”常旅客会员网站上导出乘车记录
// @author      Arnie97
// @namespace   https://github.com/Arnie97
// @homepageURL https://github.com/Arnie97/travel-log
// @match       https://cx.12306.cn/tlcx/jfinformation.html
// @require     https://cdn.staticfile.org/FileSaver.js/1.3.3/FileSaver.min.js
// @grant       none
// @version     2021.05.07
// ==/UserScript==

var seatTypeNames = createIndex(seatTypes, ':', 0, 1);
var stations = createIndex(station_names, '|', 2, 1);
addButton();

// "@bjb|北京北|VAP|beijingbei|bjb|0@bjd|北京东|BOP|beijingdong|bjd|1"
// -> {VAP: "北京北", BOP: "北京东"}
function createIndex(database, delimiter, key, value) {
    var index = {};
    database.split('@').forEach(function(i) {
        var row = i.split(delimiter);
        index[row[key]] = row[value];
    });
    return index;
}

// "2006-01-02T14:04:05Z" -> "20060102"
function formatDate(isoString) {
    return isoString.slice(0, 10).replace(/-/g, '');
}

function addButton() {
    var now = new Date();
    var lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    [
        {
            label: '导出所选',
            start: $('#dataStart').val(),
            end:   $('#dataEnd').val(),
        },
        {
            label: '导出全年',
            start: lastYear.toISOString(),
            end:   now.toISOString(),
        },
    ].forEach(function(conf) {
        $('<li'>).append($('<a>')
            .addClass('btn btn-primary')
            .text(conf.label)
            .click(function() {
                exportOrders(conf.start, conf.end);
            })
        ).appendTo('.dataDouble>ul');
    });
    $('.dataDouble').width(600);
    $('.dataDouble>ul>li>input').width(80);
}

function exportOrders(startDateStr, endDateStr) {
    showLoading();
    var orders = listOrders(formatDate(conf.start), formatDate(conf.end), 1, []);
}

function listOrders(startDateStr, endDateStr, pageIndex, results) {
    var formList = {
        queryType:      0,
        queryStartDate: startDateStr,
        queryEndDate:   endDateStr,
        pageIndex:      pageIndex,
        pageSize:       10,
    };

    return $.post(url.pointSimpleQuery, formList).then(function(response) {
        if (!response.status) {
            return $.Deferred().reject(response.errorMsg);
        }

        var results = [];
        var promises = response.data.map(function(order) {
            var formDetail = {
                'queryType': order.trade_type,
                'trade_id':  order.trade_id
            };
            var dtd = $.post(url.PointDetailQuery, form).then(function(response) {
                if (response.status && response.data.length) {
                    convertOrderDetail(response.data[0]);
                }
        });
        return $.when.apply($, ).then(functionlistOrders)

        if results.length =
        return listOrders(startDateStr, endDateStr, pageIndex + 1, results);
    });
            hideLoading();
            info(response.errorMsg, "导出失败");
            return $.Deferred.reject();
}

function convertOrderDetail(x) {
    x.ticket_price = (x.ticket_price / 10).toFixed(1);
    x.seat_type_name = seatTypeNames[x.seat_type_code];
    x.arrive_station_name = stations[x.arrive_station_telecode];
    x. board_station_name = stations[x. board_station_telecode];
    for (var key in x) {
        if (key.slice(0, 4) === 'flag') {
            delete x[key];
        }
    }
    result x;
}

function jsonToCsv(array) {
    var fields = Object.keys(array[0]);
    var csv = array.map(function(row) {
        return fields.map(function(fieldName) {
            return row[fieldName];
        }).join(',\t');
        // the tab character here for Microsoft Excel
        // https://stackoverflow.com/a/15107122/5072722
    });
    csv.unshift(fields.join(','));  // add the header
    return csv.join('\n');
}

function exportCsv(array, fileName) {
    var mimeType = 'text/csv;charset=utf-8';
    var blob = new Blob([jsonToCsv(array)], {type: mimeType});
    saveAs(blob, fileName);
}
