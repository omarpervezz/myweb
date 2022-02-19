const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links li");
const overlayY = document.querySelector('.first_div');

// humbugger menu
hamburger.addEventListener('click', () => {
    //Animate Links
    navLinks.classList.toggle("open");
    // navLinks.classList.remove("remove");
    links.forEach(link => {
        link.classList.toggle("fade");
    });
    overlayY.classList.toggle('adding_div')
        //Hamburger Animation
    hamburger.classList.toggle("toggle");

});

// Header Type = Fixed
$(window).scroll(function() {
    var scroll = $(window).scrollTop();
    // var box = $('.nav_bg_adder').height();
    // var header = $('nav').height();

    if (scroll > 20) {
        $("header").addClass("nav_bg_adder");
        $("header").addClass("vhs-flicker");

    } else {
        $("header").removeClass("nav_bg_adder");
    }
});

// banner background
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

function resize() {
    var box = c.getBoundingClientRect();
    c.width = box.width;
    c.height = box.height;
}

var light = {
    x: 160,
    y: 200
}

var colors = ["#f5c156", "#e6616b", "#5cd3ad"];

function drawLight() {
    ctx.beginPath();
    ctx.arc(light.x, light.y, 1000, 0, 2 * Math.PI);
    var gradient = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, 1000);
    gradient.addColorStop(0, "#000");
    gradient.addColorStop(1, "#000000");
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(light.x, light.y, 20, 0, 2 * Math.PI);
    gradient = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, 5);
    gradient.addColorStop(0, "#12e4d2ea");
    gradient.addColorStop(1, "#000 ");
    ctx.fillStyle = gradient;
    ctx.fill();
}

function Box() {
    this.half_size = Math.floor((Math.random() * 50) + 1);
    this.x = Math.floor((Math.random() * c.width) + 1);
    this.y = Math.floor((Math.random() * c.height) + 1);
    this.r = Math.random() * Math.PI;
    this.shadow_length = 2000;
    this.color = colors[Math.floor((Math.random() * colors.length))];

    this.getDots = function() {

        var full = (Math.PI * 2) / 4;


        var p1 = {
            x: this.x + this.half_size * Math.sin(this.r),
            y: this.y + this.half_size * Math.cos(this.r)
        };
        var p2 = {
            x: this.x + this.half_size * Math.sin(this.r + full),
            y: this.y + this.half_size * Math.cos(this.r + full)
        };
        var p3 = {
            x: this.x + this.half_size * Math.sin(this.r + full * 2),
            y: this.y + this.half_size * Math.cos(this.r + full * 2)
        };
        var p4 = {
            x: this.x + this.half_size * Math.sin(this.r + full * 3),
            y: this.y + this.half_size * Math.cos(this.r + full * 3)
        };

        return {
            p1: p1,
            p2: p2,
            p3: p3,
            p4: p4
        };
    }
    this.rotate = function() {
        var speed = (60 - this.half_size) / 20;
        this.r += speed * 0.002;
        this.x += speed;
        this.y += speed;
    }
    this.draw = function() {
        var dots = this.getDots();
        ctx.beginPath();
        ctx.moveTo(dots.p1.x, dots.p1.y);
        ctx.lineTo(dots.p2.x, dots.p2.y);
        ctx.lineTo(dots.p3.x, dots.p3.y);
        ctx.lineTo(dots.p4.x, dots.p4.y);
        ctx.fillStyle = this.color;
        ctx.fill();


        if (this.y - this.half_size > c.height) {
            this.y -= c.height + 100;
        }
        if (this.x - this.half_size > c.width) {
            this.x -= c.width + 100;
        }
    }
    this.drawShadow = function() {
        var dots = this.getDots();
        var angles = [];
        var points = [];

        for (dot in dots) {
            var angle = Math.atan2(light.y - dots[dot].y, light.x - dots[dot].x);
            var endX = dots[dot].x + this.shadow_length * Math.sin(-angle - Math.PI / 2);
            var endY = dots[dot].y + this.shadow_length * Math.cos(-angle - Math.PI / 2);
            angles.push(angle);
            points.push({
                endX: endX,
                endY: endY,
                startX: dots[dot].x,
                startY: dots[dot].y
            });
        };

        for (var i = points.length - 1; i >= 0; i--) {
            var n = i == 3 ? 0 : i + 1;
            ctx.beginPath();
            ctx.moveTo(points[i].startX, points[i].startY);
            ctx.lineTo(points[n].startX, points[n].startY);
            ctx.lineTo(points[n].endX, points[n].endY);
            ctx.lineTo(points[i].endX, points[i].endY);
            ctx.fillStyle = "#000000";
            ctx.fill();
        };
    }
}

var boxes = [];

function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    drawLight();

    for (var i = 0; i < boxes.length; i++) {
        boxes[i].rotate();
        boxes[i].drawShadow();
    };
    for (var i = 0; i < boxes.length; i++) {
        collisionDetection(i)
        boxes[i].draw();
    };
    requestAnimationFrame(draw);
}

resize();
draw();

while (boxes.length < 14) {
    boxes.push(new Box());
}

window.onresize = resize;
c.onmousemove = function(e) {
    light.x = e.offsetX == undefined ? e.layerX : e.offsetX;
    light.y = e.offsetY == undefined ? e.layerY : e.offsetY;
}


function collisionDetection(b) {
    for (var i = boxes.length - 1; i >= 0; i--) {
        if (i != b) {
            var dx = (boxes[b].x + boxes[b].half_size) - (boxes[i].x + boxes[i].half_size);
            var dy = (boxes[b].y + boxes[b].half_size) - (boxes[i].y + boxes[i].half_size);
            var d = Math.sqrt(dx * dx + dy * dy);
            if (d < boxes[b].half_size + boxes[i].half_size) {
                boxes[b].half_size = boxes[b].half_size > 1 ? boxes[b].half_size -= 1 : 1;
                boxes[i].half_size = boxes[i].half_size > 1 ? boxes[i].half_size -= 1 : 1;
            }
        }
    }
};

// anime text animation
var element = document.getElementsByClassName("text-animation")[0];
var element2 = document.getElementsByClassName("text-animation-short-info")[0];
// replace each char with <span class="letter">{char} </span>
element.innerHTML = element.textContent.replace(/\S/g, '<span class="letter">$&</span>');
element2.innerHTML = element2.textContent.replace(/\S/g, '<span class="letter2">$&</span>');

const omarTitle = element.querySelectorAll('.letter');
// first element
anime.timeline({ loop: false })
    .add({
        targets: '.text-animation .letter',

        opacity: [0, 1],
        translateZ: 0,
        duration: 1000,
        easing: 'easeOutExpo',
        autoplay: true,
        delay: (elem, index) => index * 260
    });
var omarLetter = document.querySelectorAll('.letter');
let headTitleTarget = document.querySelectorAll('.text-animation .letter');
headTitleTarget.forEach(e => {;
    e.addEventListener('mouseover', (ee) => {
        addingAnimationMainTitleInSpanIn(ee);
    });
    e.addEventListener('mouseleave', (ee) => {
        addingAnimationMainTitleInSpanOut(ee);
    });
});


function addingAnimationMainTitleInSpanIn(element) {
    element.target.classList.add('bounceInScale');
    if (element.target.classList.contains('bounceInScale')) {
        element.target.classList.add('shake-slow')
    }
}

function addingAnimationMainTitleInSpanOut(element) {
    if (element.target.classList.contains('bounceInScale', 'shake-slow')) {
        element.target.classList.remove('bounceInScale', 'shake-slow')
    }
}

// animation for all Title text
function animateButton(el, scale, duration, elasticity, delay, opacity) {
    anime.remove(el);
    anime({
        targets: el,
        scale: scale,
        opacity: opacity,
        duration: duration,
        elasticity: elasticity,
        delay: delay,
    });
}

function enterButton(el) {
    animateButton(el, 1.3, 800, 30, 200, [0.8])
};

function leaveButton(el) {
    animateButton(el, 1.1, 600, 30, 200, [1])
};
for (var i = 0; i < omarLetter.length; i++) {
    omarLetter[i].addEventListener('mouseenter', function(e) {
        e.target.classList.add('enter_class')
        enterButton(e.target);
    }, false);

    omarLetter[i].addEventListener('mouseleave', function(e) {
        e.target.classList.remove('enter_class');
        leaveButton(e.target)
    }, false);
}
// second element short bio about omar
anime.timeline({ loop: false })
    .add({
        targets: '.text-animation-short-info .letter2',
        scale: [3, 1],
        opacity: [0, 1],
        translateZ: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: (elem, index) => index * 60
    });
// who I am text animation
var whoIam = document.querySelectorAll(".titleOmar");
whoIam.forEach(e => {
    e.innerHTML = e.textContent.replace(/\S/g, '<span class="letter3">$&</span>');
})

// letter 3 target
let titleTarget = document.querySelectorAll('.titleOmar span');
titleTarget.forEach(e => {;
    e.addEventListener('mouseover', (ee) => {
        addingAnimationInSpanIn(ee);
    });
    e.addEventListener('mouseleave', (ee) => {
        addingAnimationInSpanOut(ee);
    });
});

function addingAnimationInSpanIn(element) {
    element.target.classList.add('bounceInLeft', 'shake-slow', 'titleC');
};

function addingAnimationInSpanOut(elem) {
    if (elem.target.classList.contains('bounceInLeft', 'shake-slow')) {
        elem.target.classList.remove('shake-slow', 'titleC')
    }

}

anime.timeline({ loop: false })
    .add({
        targets: '.titleOmar .letter3',
        opacity: 1,
        translateY: 0,
        rotate: {
            value: 360,
            duration: 2000,
            easing: 'easeInExpo'
        },
    });

//countUp
(function($) {
    $.fn.countTo = function(options) {
        options = options || {};

        return $(this).each(function() {
            // set options for current element
            var settings = $.extend({}, $.fn.countTo.defaults, {
                from: $(this).data('from'),
                to: $(this).data('to'),
                speed: $(this).data('speed'),
                refreshInterval: $(this).data('refresh-interval'),
                decimals: $(this).data('decimals')
            }, options);

            // how many times to update the value, and how much to increment the value on each update
            var loops = Math.ceil(settings.speed / settings.refreshInterval),
                increment = (settings.to - settings.from) / loops;

            // references & variables that will change with each update
            var self = this,
                $self = $(this),
                loopCount = 0,
                value = settings.from,
                data = $self.data('countTo') || {};

            $self.data('countTo', data);

            // if an existing interval can be found, clear it first
            if (data.interval) {
                clearInterval(data.interval);
            }
            data.interval = setInterval(updateTimer, settings.refreshInterval);

            // initialize the element with the starting value
            render(value);

            function updateTimer() {
                value += increment;
                loopCount++;

                render(value);

                if (typeof(settings.onUpdate) == 'function') {
                    settings.onUpdate.call(self, value);
                }

                if (loopCount >= loops) {
                    // remove the interval
                    $self.removeData('countTo');
                    clearInterval(data.interval);
                    value = settings.to;

                    if (typeof(settings.onComplete) == 'function') {
                        settings.onComplete.call(self, value);
                    }
                }
            }

            function render(value) {
                var formattedValue = settings.formatter.call(self, value, settings);
                $self.html(formattedValue);
            }
        });
    };

    $.fn.countTo.defaults = {
        from: 0, // the number the element should start at
        to: 0, // the number the element should end at
        speed: 1000, // how long it should take to count between the target numbers
        refreshInterval: 100, // how often the element should be updated
        decimals: 0, // the number of decimal places to show
        formatter: formatter, // handler for formatting the value before rendering
        onUpdate: null, // callback method for every time the element is updated
        onComplete: null // callback method for when the element finishes updating
    };

    function formatter(value, settings) {
        return value.toFixed(settings.decimals);
    }
}(jQuery));

jQuery(function($) {
    // custom formatting example
    $('.count-number').data('countToOptions', {
        formatter: function(value, options) {
            return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
        }
    });

    // start all the timers
    $('.timer').each(count);

    function count(options) {
        var $this = $(this);
        options = $.extend({}, options || {}, $this.data('countToOptions') || {});
        $this.countTo(options);
    }
});


// skill initializing
$(document).ready(function() {
    if (!$('#myCanvas').tagcanvas({
            outlineColour: '#2aab8a',
            outlineDash: 2,
            outlineDashSpace: 5,
            outlineDashSpeed: 4,
            outlineIncrease: 2,
            outlineOffset: 5,
            outlineThickness: 2,
            padding: 0,
            outlineMethod: 'outline',
            pinchZoom: false,
            noSelect: false,
            pulsateTime: 4,
            pulsateTo: 1.4,
            shuffleTags: false,
            reverse: true,
            depth: 0.8,
            maxSpeed: 0.06,
            animTiming: 'Smooth',
            textColour: '#2aab8a',
            textHeight: 16,
            weightMode: 'bgColour',
            wheelZoom: false,
            zoomMin: false,
            zoomMax: false,
            zoomStep: false,
            activeAudio: false,
            audioIcon: true,
            audioIconDark: true,
            audioIconSize: 10,
            audioVolume: 0.4,
            bgRadius: 3,
            fadeIn: 4,
            freezeActive: false,
            freezeDecel: false,
            frontSelect: true,
            hideTags: true,
            maxBrightness: 1.0,
            minBrightness: 0.2,
            minSpeed: 0.0,
            minTags: 0,
            noMouse: false,
            noTagsMessage: false,
            weightMode: 'size',
            weightSize: 1.0,
            weight: false,


            weightGradient: {
                0: '#fff', // red
                //0.33: '#fffff0', // yellow
                //0.66: '#0f9990', // green
                1: '#2aab8a' // blue
            }
        }, 'tags')) {
        // something went wrong, hide the canvas container
        $('#myCanvasContainer').hide();
    }
});



///main-banner moon parallax
// function parallax(element, distance, speed) {

// 	const item = document.querySelector(element);

// 	item.style.transform = `translateY(${distance * speed}px)`;
// 	item.style.transition = '2.5s ease all';

// };

// window.addEventListener('scroll', function () {
// 	parallax('.ball-1', window.scrollY, 0.3);
//     parallax('.ball-2', window.scrollY, 0.5);

// })