sleep=a=>new Promise(b=>setTimeout(b,a));

document.addEventListener("DOMContentLoaded", ()=>{
    const input = document.getElementById("input");
    const output = document.getElementById("output");
    const next_happy = document.getElementById("next-happy");

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
    })
});