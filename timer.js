function time_setter() {
    let set = { hr: 0, mn: 0, sc: 0 };
    let pause = true;
    let interval = null;

    //audio
    const alarm = new Audio('./audio/alarm2.mp3')
    alarm.volume = 1
    alarm.preload = 'auto'
    alarm.loop = true
    const click = new Audio('./audio/click.mp3')
    click.preload = 'auto'
    click.volume = 1
    const btn_click = new Audio('./audio/rclick.mp3')
    btn_click.volume = 0.5
    btn_click.preload = 'auto'
    return {
        add_time: function (e, inc, type = null) {
            e.preventDefault(e)
            if (interval) return
            const node = e.target
            const name = node.dataset.name
            if (type === 'touch') set[name] = (set[name] + inc) % node.children.length
            else {
                set[name] += inc
                if (set[name] <= 0) {
                    set[name] = 0
                }
                if (set[name] >= node.children.length - 1) {
                    set[name] = node.children.length - 1
                }
            }
            const deg = set[name] * 360 / node.children.length
            rotate_node(node, -deg)
        },

        reset: function (e = null, pause_switch = false) {
            if (e) {
                btn_click.play()
                get_node('#playBtn').classList.remove('pause')
                e.target.classList.remove('animate_reset')
                void e.target.offsetWidth
                e.target.classList.add('animate_reset')
            }

            pause = pause_switch
            !pause_switch ? alarm.play() : alarm.pause()
            set = { hr: 0, mn: 0, sc: 0 }
            this.rotate_all()

            clearInterval(interval)
            interval = null
        },

        play: function (e) {
            if (check_if_all_null(set)) return
            btn_click.play()
            pause = !pause
            !pause ? e.target.classList.add('pause') : e.target.classList.remove('pause')
            if (!pause) {
                const mn = get_node(`[data-name="mn"]`)
                const sc = get_node(`[data-name="sc"]`)
                if ((set.sc === 0 && (set.mn > 0 || set.hr > 0))) this.reset_animation(sc)
                if (set.mn === 0 && set.sc === 0 && set.hr > 0) this.reset_animation(mn)
                interval = setInterval(() => this.count(), 1000)
            }
            else {
                clearInterval(interval)
                interval = null
            }
        },

        count: function () {
            if (!check_if_all_null(set)) click.play()
            if (set.sc > 0) {
                set.sc--
            } else if (set.mn > 0) {
                set.mn--;
                set.sc = 59;
            } else if (set.hr > 0) {
                set.hr--;
                set.sc = 59;
                set.mn = 59;
            } else {
                this.reset()
            }
            this.rotate_all()
        },

        rotate_all: function () {
            Object.entries(set).forEach(el => {
                const node = get_node(`[data-name=${el[0]}]`)
                let deg = (el[1] * (360 / node.children.length))
                if (el[0] === 'sc' && set[el[0]] === 0 && (set.mn > 0 || set.hr > 0)) this.reset_animation(node)
                if (el[0] === 'mn' && set[el[0]] === 0 && set.sc === 0 && set.hr > 0) this.reset_animation(node)
                rotate_node(node, -deg)
            })
        },

        reset_animation: function (node) {
            setTimeout(() => {
                node.style.transition = 'none';
                node.style.transform = `rotate(${-360}deg)`;
                setTimeout(() => {
                    node.style.transition = 'transform 400ms linear';
                }, 10);
            }, 590);
        }
    }
}

