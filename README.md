Notification of Browser Window Size or Scroll Position Changes
==============================================================

I regularly find myself needing updated window size and scroll position,
often for simulating sticky positioning. This module is an attempted
solution.

Usage
-----

    ES5: var viewport = require('viewport-event').default;
    ES2015: import viewport from 'viewport-event';

The module has one (non events) public method:

    var data = viewport.getViewport();

And one event:

    viewport.on('viewport', function(data) { ... });

The retrieved data is an object with these properties:

- scrollY
- scrollX
- width
- height
- clientWidth
- clientHeight

The difference between *width* and *clientWidth*, and *height* and
*clientHeight* is that the "client" versions do not include space
taken up by scroll bars. In general, the "client" values are the
useful ones.

In iOS, height and clientHeight are the same, as that seems to be
the only way to get the correct (useful) client height in iOS Safari.

In addition to "on", it also inherits all methods from
[events](https://github.com/Gozala/events).

Notes
-----

Even though *clientWidth* and *clientHeight* are the ones we usually
need, browsers do not fire events when they change. However, they
should only change when window size or scroll has changed, and browsers
do have events for those.

On browsers that support *requestAnimationFrame*, the *viewport*
event is throttled using that mechanism. On older browsers that
do not, throttling is more conservative, with the event coming only
after a "quiet time".

Testing
-------

I have a manual test page: https://github.com/egauci/tviewport with
[live code](https://ldo.gauci.co/tviewport/).

The test page shows data centered in the window and "crop marks" in
the four corners, all based on results from *viewport-event*.

I have tested on Safari, Chrome, and Firefox on iOS, Safari, Chrome,
and Firefox on OS X, and IE 11, Chrome, and Firefox on Windows 7. Any
test results, especially failing tests, are welcome.
