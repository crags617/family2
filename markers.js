markerLayer = mapbox.markers.layer()
// this is a quick optimization - otherwise all markers are briefly displayed
// before filtering to 2001
	.filter(function() { return false })
	.url('https://docs.google.com/open?id=0B4nlwc2QbtjtMS01YWYwNGYyOC03ZmY0LTQ2YzMtODJmYS0zMDIzZDEwYjFlY2U', function(err, features) {
/* if that url doesn't work:
mapbox.converters.googledocs('0B4nlwc2QbtjtMS01YWYwNGYyOC03ZmY0LTQ2YzMtODJmYS0zMDIzZDEwYjFlY2U', 'od6', function(features) {
*/
    // A closure for clicking years. You give it a year, and it returns a function
    // that, when run, clicks that year. It's this way in order to be used as both an
    // event handler and run manually.
    function click_year(y) {
        return function() {
            var active = document.getElementsByClassName('start_year');
            //make it work for start_year through start_year+num_months/12 (round up)
            if (active.length) active[0].className = '';
            document.getElementById('y' + y).className = 'start_year';
            markerLayer.filter(function(f) {
                return f.properties.year == y;
            });
            return false;
        };
    }

    var years = {},
        yearlist = [],
        year_links = [];

    for (var i = 0; i < features.length; i++) {
        years[features[i].properties.start_year] = true;
    }

    for (var y in years) yearlist.push(y);
    yearlist.sort();

    for (var i = 0; i < yearlist.length; i++) {
        var a = timeline.appendChild(document.createElement('a'));
        a.innerHTML = yearlist[i] + ' ';
        a.id = 'y' + yearlist[i];
        a.href = '#';
        a.onclick = click_year(yearlist[i]);
    }

    var stop = controls.appendChild(document.createElement('a')),
          play = controls.appendChild(document.createElement('a')),
          playStep;

    stop.innerHTML = 'STOP ■';
    play.innerHTML = 'PLAY ▶';

    play.onclick = function() {
        var step = 0;
        // Every quarter-second (250 ms) increment the year
        // we're looking at and show a new year. When
        // the end is reached, call clearInterval to stop
        // the animation.
        playStep = window.setInterval(function() {
            if (step < yearlist.length) {
                click_year(yearlist[step])();
                step++;
            } else {
                window.clearInterval(playStep);
            }
        }, 250);
    };

    stop.onclick = function() {
        window.clearInterval(playStep);
    };

    click_year(2012)();
});
