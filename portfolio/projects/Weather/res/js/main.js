$(document).ready(function() {

    $(".nav-toggle").click(function() {
        $("nav").toggleClass("opened");
        return false;
    });

    getAndDisplayFromServer();

    $("#reload-btn").click(getAndDisplayFromServer);

    $('#weather-table .sorter').each(function() {
        var header = $(this);
        var inverse = false;

        header.click(function() {
            var sorterName = header.attr("data-sorter-name");
            var weatherData = getWeatherDataFromTable();

            header.siblings('th').removeClass('active');
            header.addClass('active');
            if(inverse){
              header.removeClass('desc');
            } else {
              header.addClass('desc');
            }

            switch (sorterName) {
                case 'city':
                    weatherData.sort(function(a, b) {
                        return a.name > b.name ?
                            inverse ? -1 : 1 :
                            inverse ? 1 : -1;
                    });
                    break;
                case 'location':
                    weatherData.sort(function(a, b) {
                        var lat0 = 60.169521, // Helsinki latitude
                            lon0 = 24.93545, // Helsinki longitude
                            lat1 = a.coord.lat,
                            lon1 = a.coord.lon,
                            lat2 = b.coord.lat,
                            lon2 = b.coord.lon;

                        var d1 = calculateDistance(lat1, lon1, lat0, lon0),
                            d2 = calculateDistance(lat2, lon2, lat0, lon0)
                        return d1 > d2 ?
                            inverse ? -1 : 1 :
                            inverse ? 1 : -1;
                    });
                    break;
                case 'temperature':
                    weatherData.sort(function(a, b) {
                        return a.main.temp > b.main.temp ?
                            inverse ? -1 : 1 :
                            inverse ? 1 : -1;
                    });
                    break;
                case 'wind':
                    weatherData.sort(function(a, b) {
                        return a.wind.speed > b.wind.speed ?
                            inverse ? -1 : 1 :
                            inverse ? 1 : -1;
                    });
                    break;
            }
            inverse = !inverse;

            displayWeatherData(weatherData);
        })

    });


});


function toRad(Value) {
    return Value * Math.PI / 180;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

function getAndDisplayFromServer() {
    $('#weather-table').css("display", "table");
    $('#weather-table tbody tr').remove();
    $("#message").css("display", "block");

    $.ajax({
            method: "GET",
            // url: "http://api.openweathermap.org/data/2.5/find?appid=ffe74f6475c14517ef5e80fe8df0b7d6",
            url: "http://api.openweathermap.org/data/2.5/find?appid=0b96668615bb92609290fa424719a2ea",
            data: {
                lat: 60.169847,
                lon: 24.938340,
                cnt: 30,
                units: "metric"
            },
            error: function(message) {
                $('#weather-table').css("display", "none");
                $("#errorMessage").text('"An error occured, please try again later: ' + message.statusText);
            }
        })
        .then(function(responseData) {
            $("#message").css("display", "none");

            var weatherData = responseData.list;
                //Sort weatherData by city Name by default
            weatherData.sort(function(a, b) {
                return a.name > b.name ? 1 : -1;
            });
            return weatherData;
        })
        .then(displayWeatherData);

}


function displayWeatherData(weatherData) {
    $('#weather-table tbody tr').remove();

    $.each(weatherData, function(i, item) {
        var newRow = '';
        newRow += '<tr>'
        newRow += '<td>' + item.name + '</td>'
        newRow += '<td>' + item.coord.lat + ' , ' + item.coord.lon + '</td>'
        newRow += '<td>' + item.main.temp + '</td>'
        newRow += '<td>' + item.wind.speed + '</td>'
        newRow += '</tr>'
        $('#weather-table tbody').append(newRow);
    });
}

function getWeatherDataFromTable() {
    var tableData = [];
    $('#weather-table tbody tr').each(function() {
        var $cells = $(this).children();
        var cellData = {
            "name": $cells.eq(0).text(),
            "coord": {
                "lat": $cells.eq(1).text().split(' , ')[0],
                "lon": $cells.eq(1).text().split(' , ')[1],
            },
            "main": {
                "temp": $cells.eq(2).text()
            },
            "wind": {
                "speed": $cells.eq(3).text(),
            }
        }
        tableData.push(cellData);
    });
    return tableData;
}
