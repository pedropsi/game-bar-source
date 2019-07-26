/*
 * Add gesture support for mobile devices.
 */

window.Mobile = {};

Mobile.hasTouch = function() {
	return (('ontouchstart' in window)||window.TouchEvent||window.DocumentTouch && document instanceof DocumentTouch)||false;
}

Mobile.enable = function (force) {
    if (force || Mobile.hasTouch() && !Mobile._instance) {
        Mobile._instance = new Mobile.GestureHandler();
        Mobile._instance.bindEvents();
        /*Mobile._instance.bootstrap();*/
    }
    return Mobile._instance;
};

window.Mobile.GestureHandler = function () {
    this.initialize.apply(this, arguments);
};

(function (proto) {
    'use strict';

    // Minimum range to begin looking at the swipe direction, in pixels
    var SWIPE_THRESHOLD = 10;
    // Distance in pixels required to complete a swipe gesture.
    var SWIPE_DISTANCE = 50;
    // Time in milliseconds to complete the gesture.
    var SWIPE_TIMEOUT = 1000;
    // Time in milliseconds to repeat a motion if still holding down,
    // ... and not specified in state.metadata.key_repeat_interval.
    var DEFAULT_REPEAT_INTERVAL = 150;

    // Lookup table mapping action to keyCode.
    var CODE = {
        action:  88, // x
        left:    37, // left arrow
        right:   39, // right arrow
        up:      38, // up arrow
        down:    40, // down arrow
        undo:    85, // u
        restart: 82, // r
        quit:    27 // escape
    }

    /** Bootstrap Methods **/

    proto.initialize = function () {
        this.firstPos = { x: 0, y: 0 };
        this.repeatTick = this.repeatTick.bind(this);
        this.isFocused = true;
    };

    proto.bindEvents = function () {
        canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
        canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
        canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
    };

    /** Event Handlers **/

    proto.onTouchStart = function (event) {
        if (this.isTouching) {
            return;
        }

        if (event.target.tagName.toUpperCase() === 'A') {
            return;
        }
        this.isTouching = true;

        this.mayBeSwiping = true;
        this.gestured = false;

        this.swipeDirection = undefined;
        this.swipeDistance = 0;
        this.startTime = new Date().getTime();

        this.firstPos.x = event.touches[0].clientX;
        this.firstPos.y = event.touches[0].clientY;
    };

    proto.onTouchEnd = function (event) {
        if (!this.isFocused) {
            return;
        }
        if (!this.isTouching) {
            // If we're here, the menu event handlers had probably
            // canceled the touchstart event.
            return;
        }
        if (!this.gestured) {
            if (event.touches.length === 0) {
                this.handleTap();
            }
        }

        // The last finger to be removed from the screen lets us know
        // we aren't tracking anything.
        if (event.touches.length === 0) {
            this.isTouching = false;
            this.endRepeatWatcher();
        }
    };

    proto.onTouchMove = function (event) {
        if (!this.isFocused) {
            return;
        }
        if (this.isSuccessfulSwipe()) {
            this.handleSwipe(this.swipeDirection, this.touchCount);
            this.gestured = true;
            this.mayBeSwiping = false;
            this.beginRepeatWatcher(event);
        } else if (this.mayBeSwiping) {
            this.swipeStep(event);
        } else if (this.isRepeating) {
            this.repeatStep(event);
        }

        prevent(event);
        return false;
    };

    proto.beginRepeatWatcher = function (event) {
        var repeatIntervalMilliseconds;
        if (this.repeatInterval) {
            return;
        }
        this.isRepeating = true;
        repeatIntervalMilliseconds = state.metadata.key_repeat_interval * 1000;
        if (isNaN(repeatIntervalMilliseconds) || !repeatIntervalMilliseconds) {
            repeatIntervalMilliseconds = DEFAULT_REPEAT_INTERVAL;
        }
        this.repeatInterval = setInterval(this.repeatTick, repeatIntervalMilliseconds);
        this.recenter(event);
    };

    proto.endRepeatWatcher = function () {
        if (this.repeatInterval) {
            clearInterval(this.repeatInterval);
            delete this.repeatInterval;
            this.isRepeating = false;
        }
    };

    proto.repeatTick = function () {
        if (this.isTouching) {
            this.handleSwipe(this.direction, this.touchCount);
        }
    };

    // Capture the location to consider the gamepad center.
    proto.recenter = function (event) {
        this.firstPos.x = event.touches[0].clientX;
        this.firstPos.y = event.touches[0].clientY;
    }

    /** Detection Helper Methods **/

    proto.isSuccessfulSwipe = function () {
        var isSuccessful;

        if (this.mayBeSwiping &&
            this.swipeDirection !== undefined &&
            this.swipeDistance >= SWIPE_DISTANCE) {
            isSuccessful = true;
        }

        return isSuccessful;
    };

    // Examine the current state to see what direction they're swiping and
    // if the gesture can still be considered a swipe.
    proto.swipeStep = function (event) {
        var currentPos, distance, currentTime;
        var touchCount;

        if (!this.mayBeSwiping) {
            return;
        }

        currentPos = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
        currentTime = new Date().getTime();
        touchCount = event.touches.length;

        this.swipeDistance = this.cardinalDistance(this.firstPos, currentPos);
        if (!this.swipeDirection) {
            if (this.swipeDistance > SWIPE_THRESHOLD) {
                // We've swiped far enough to decide what direction we're swiping in.
                this.swipeDirection = this.dominantDirection(this.firstPos, currentPos);
                this.touchCount = touchCount;
            }
        } else if (distance < SWIPE_DISTANCE) {
            // Now that they've committed to the swipe, look for misfires...

            direction = this.dominantDirection(this.firstPos, currentPos);
            // Cancel the swipe if the direction changes.
            if (direction !== this.swipeDirection) {
                this.mayBeSwiping = false;
            }
            // If they're changing touch count at this point, it's a misfire.
            if (touchCount < this.touchCount) {
                this.mayBeSwiping = false;
            }
        } else if (currentTime - this.startTime > SWIPE_TIMEOUT) {
            // Cancel the swipe if they took too long to finish.
            this.mayBeSwiping = false;
        }
    };

    proto.repeatStep = function (event) {
        var currentPos, distance, currentTime;
        var newDistance, direction;

        currentPos = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };

        newDistance = this.cardinalDistance(this.firstPos, currentPos);

        if (newDistance >= SWIPE_DISTANCE) {
            this.swipeDirection = this.dominantDirection(this.firstPos, currentPos);
            this.recenter(event);
        }
    };

    // Find the distance traveled by the swipe along compass directions.
    proto.cardinalDistance = function (firstPos, currentPos) {
        var xDist, yDist;

        xDist = Math.abs(firstPos.x - currentPos.x);
        yDist = Math.abs(firstPos.y - currentPos.y);

        return Math.max(xDist, yDist);
    };

    // Decide which direction the touch has moved farthest.
    proto.dominantDirection = function (firstPos, currentPos) {
        var dx, dy;
        var dominantAxis, dominantDirection;

        dx = currentPos.x - firstPos.x;
        dy = currentPos.y - firstPos.y;

        dominantAxis = 'x';
        if (Math.abs(dy) > Math.abs(dx)) {
            dominantAxis = 'y';
        }

        if (dominantAxis === 'x') {
            if (dx > 0) {
                dominantDirection = 'right';
            } else {
                dominantDirection = 'left';
            }
        } else {
            if (dy > 0) {
                dominantDirection = 'down';
            } else {
                dominantDirection = 'up';
            }
        }

        return dominantDirection;
    };

    /** Action Methods **/

    // Method to be called when we've detected a swipe and some action
    // is called for.
    proto.handleSwipe = function (direction, touchCount) {
        if (touchCount === 1) {
            this.emitKeydown(this.swipeDirection);
        } else if (touchCount > 1) {
            // Since this was a multitouch gesture, open the menu.
            this.toggleMenu();
        }
    };

    proto.handleTap = function () {
        this.emitKeydown('action');
    };

    // Fake out keypresses to acheive the desired effect.
    proto.emitKeydown = function (input) {
        var event;

        event = { keyCode: CODE[input] };

        this.fakeCanvasFocus();
        // Press, then release key.
        onKeyDown(event);
        onKeyUp(event);
    };

    proto.fakeCanvasFocus = function () {
        var canvas;

        canvas = document.getElementById('gameCanvas');
        onMouseDown({
            button: 0,
            target: canvas
        });
    };

}(window.Mobile.GestureHandler.prototype));