sleep=a=>new Promise(b=>setTimeout(b,a));

document.addEventListener("DOMContentLoaded", ()=>{
    const input = document.getElementById("input");
    const output = document.getElementById("output");

    const next_happy = document.getElementById("next-happy");
    const previous_happy = document.getElementById("previous-happy");
    
    const run_graph = document.getElementById("run-graph");
    const current_percent = document.getElementById("current-percent");

    const base = 10;
    const max_values = 25;

    input.addEventListener("beforeinput", event=>{
        if (event.data == null) return;
        let i = event.data.length;
        while (i--) {
            if (!"1234567890".includes(event.data.charAt(i))) {
                event.preventDefault();
                return;
            }
        }
    });

    function happyNumberCheck() {
        output.innerHTML = "";
        let num = +input.value;
        let originalNum = num;
        let i = 0;
        while (num != 1 && num != 4 && num != 0) {
            let sum = 0;

            let values = [];
            while (num > 0) {
                let rem = num%base;
                values.unshift(`${rem}<sup>2</sup>`);

                num = Math.floor(num / base);
                sum += rem*rem;
            }
            num = sum;
            output.innerHTML += `${values.join("&nbsp;+&nbsp;")}&nbsp;=&nbsp;${num}<br>`;
            if (i >= max_values) {
                output.innerHTML += `...<br>`
                break;
            }
            i ++;
        }

        let isHappy = num == 1;
        output.innerHTML = `<span id="is-happy-${isHappy}">${originalNum}</span><br><br><span class="math">${output.innerHTML}</span>`;
        return isHappy;
    }

    happyNumberCheck();

    input.addEventListener("input", event=>{
        if (!input.value) {
            input.value = "0";
        }
        input.value = Number.parseInt(input.value);
        happyNumberCheck();
    });

    next_happy.addEventListener("click", async event=>{
        do {
            input.value = +input.value + 1;
        } while (!happyNumberCheck(+input.value))
    });

    previous_happy.addEventListener("click", event=>{
        do {
            if (+input.value <= 1) {
                return;
            }
            input.value = +input.value - 1;
        } while (!happyNumberCheck(+input.value))
    });

    var graph_running = false;

    var graph_data;
    function graph_start() {
        input.value = 1;
        graph_data = {
            num_happy: 0,
            num_unhappy: 0,
            percentage_data: []
        }
    }

    function graph_tick() {
        if (happyNumberCheck()) {
            graph_data.num_happy ++;
        } else {
            graph_data.num_unhappy ++;
        }
        input.value = +input.value + 1;

        let percent_happy = (graph_data.num_happy / (graph_data.num_happy + graph_data.num_unhappy));
        
        graph_data.percentage_data.push(percent_happy);

        current_percent.innerText = `${Math.round(percent_happy * 10000000) / 100000}% of numbers are happy`;
    }

    function graph_stop() {
        current_percent.innerText = "";

        let data = ["Number Processed,Fraction Happy"]
        for (let i = 0; i < graph_data.percentage_data.length; i++) {
            const datapoint = graph_data.percentage_data[i];
            data.push(`${i},${datapoint}`);
        }
        data = data.join('\n');

        let saveElement = document.createElement("a");
        saveElement.href = `data:application/octet-stream,${encodeURIComponent(data)}`;
        saveElement.download = "graph_data.csv";
        saveElement.click();
    }

    run_graph.addEventListener("click", event=>{
        graph_running = !graph_running;
        
        input.disabled = next_happy.disabled = previous_happy.disabled = graph_running;

        if (graph_running) {
            run_graph.innerText = "Stop Graph";

            graph_start();
            (function fn() {
                graph_tick();
                if (graph_running) {
                    setTimeout(fn, 0);
                } else {
                    graph_stop();
                }
            })();
        } else {
            run_graph.innerText = "Run Graph";
        }
    })
});