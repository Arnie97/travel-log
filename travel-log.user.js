// ==UserScript==
// @name        乘车记录查询
// @description 从“铁路畅行”常旅客会员网站上导出乘车记录
// @author      Arnie97
// @namespace   https://github.com/Arnie97
// @homepageURL https://github.com/Arnie97/travel-log
// @match       https://cx.12306.cn/tlcx/jfinformation.html
// @version     2018.02.19
// ==/UserScript==

var stations = station_names.split('@').map(function(i) {
    return i.split('|');
});
stations.shift();

function getStationName(telecode) {
    for (var i = 0; i < stations.length; i++) {
        if (stations[i][2] === telecode) {
            return stations[i][1];
        }
    }
}

function getFormDate(name) {
    return $('#data' + name).val().replace(/-/g, '');
}

function listTrades() {
    var data = {
        'queryType': 0,
        'queryStartDate': getFormDate('Start'),
        'queryEndDate':   getFormDate('End'),
        'pageIndex': 1,
        'pageSize': 1000
    };
    $.post(url.pointSimpleQuery, data, function(response) {
        if (response.status) {
            response.data.forEach(getTradeDetail);
        }
    });
}

function getTradeDetail(trade) {
    var data = {
        'queryType': trade.trade_type,
        'trade_id':  trade.trade_id
    };
    $.post(url.PointDetailQuery, data, function(response) {
        if (response.status && response.data.length) {
            collect(response.data[0]);
        }
    });
}

function collect(x) {
    x.ticket_price /= 10;
    x.arrive_station_name = getStationName(x.arrive_station_telecode);
    x. board_station_name = getStationName(x. board_station_telecode);
    for (var key in x) {
        if (key.slice(0, 4) === 'flag') {
            delete x[key];
        }
    }
    console.log(x);
}
