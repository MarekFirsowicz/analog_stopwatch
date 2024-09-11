const fragment = new DocumentFragment();
const quarters = Array.from({ length: 4 }, () => cr_node('i')({ class: "fa-solid fa-caret-down" })());
const romanHours = ['N', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI']
const sixty = Array.from({ length: 60 }, (_, i) => i % 5 === 0 ? i : '|')
const div = cr_node('div')
const i = cr_node('i')
const button = cr_node('button')

//main conatiner
const timer_container = div({ id: 'timer_container', oncontextmenu: "return false;" })()
document.body.append(timer_container)

//timer elements
function create_timer_ring(arr) {
    const fragment = new DocumentFragment();
    arr.map((el, i) => fragment.append(div({
        class: 'ring',
        style: `transform:rotate(${i * 360 / arr.length}deg)`
    })(el)))
    return fragment
}

const hr_circle = create_timer_ring(romanHours)
const outer_circle = create_timer_ring(quarters)
const mn_circle = create_timer_ring(sixty)
const sc_circle = create_timer_ring(sixty)


const time = time_setter()
//timer conatiner
const timer = div({ class: 'timer bronze2' })(
    div({ class: 'face_circle old_paper', id: 'outer_circle' })(outer_circle),
    div({ class: 'face_circle  setter', 'data-name': 'hr', id: 'hr_circle', ontouchstart: (e) => touch_set_timer(e), onmouseover: (e) => set_timer(e) })(hr_circle),
    div({ class: 'face_circle setter', 'data-name': 'mn', id: 'mn_circle', ontouchstart: (e) => touch_set_timer(e), onmouseover: (e) => set_timer(e) })(mn_circle),
    div({ class: 'face_circle setter', 'data-name': 'sc', id: 'sc_circle', ontouchstart: (e) => touch_set_timer(e), onmouseover: (e) => set_timer(e) })(sc_circle),
    div({ class: 'face_circle', id: 'bg_circle' })(),
)

//debounce(e => search_bar(e, brands), 250)
//timer btns
timer_container.append(
    div({ class: 'buttons play' })(button({ id: 'playBtn', class: 'bronze', onclick: throttle(e => time.play(e), 200) })
        (
            i({ class: "fa-solid fa-pause" })(),
            i({ class: "fa-solid fa-play" })())
    ),
    div({ class: 'buttons reset' })(button({ id: 'resetBtn', class: 'bronze', onclick: throttle(e => time.reset(e, true), 200) })(
        i({ class: "fa-solid fa-rotate-left" })())
    ),
    timer,
)

// click events
function set_timer(e) {
    e.target.onwheel = debounce(e => time.add_time(e, e.deltaY / 100), 10)
    e.target.onclick = (e) => time.add_time(e, 1)
    e.target.oncontextmenu = (e) => time.add_time(e, -1)
}

//touch event
function get_Deg(rad) {
    let degrees = rad * (180 / Math.PI);
    degrees = (degrees + 90) % 360;
    if (degrees < 0) {
        degrees += 360;
    }
    return degrees;
}


function touch_set_timer(e) {
    const node = e.target
    const touch = e.touches[0];
    const rect = node.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX)
    const inc = Math.floor(get_Deg(startAngle) / (360 / node.children.length))
    time.add_time(e, inc, 'touch')
}




