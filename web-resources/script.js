function SelectAll() {

    let button = document.getElementById("selectallbut");


    $('.middle :checkbox').each(function () {
        this.checked = button.checked;
    });
    button.checked = !button.checked;
    if (button.checked) {
        button.value = "Select all";
    } else {
        button.value = "Deselect all";
    }

}

function AddGrade() {
    let tbody = document.getElementById("tab").getElementsByTagName('tbody')[0];
    let row = tbody.insertRow(-1);
    let element = document.createElement("input");
    element.setAttribute("type", "checkbox");
    element.setAttribute("id", "biggerCheckBox");
    element.checked = true;
    element.onchange = CalculateAverage;
    row.insertCell(-1).appendChild(element);

    element = document.createElement("input");
    element.setAttribute("type", "text");
    element.onchange = CalculateAverage;
    row.insertCell(-1).appendChild(element);

    element = document.createElement("input");
    element.setAttribute("type", "text");
    element.value = "Custom";
    element.onchange = CalculateAverage;
    row.insertCell(-1).appendChild(element);

    element = document.createElement("input");
    element.setAttribute("style", "text-align:center");
    element.setAttribute("type", "number");
    element.setAttribute("min", "0");
    element.setAttribute("max", "6");
    element.setAttribute("step", "0.25");
    element.value = "0";
    element.onchange = CalculateAverage;
    row.insertCell(-1).appendChild(element);

    element = document.createElement("input");
    element.setAttribute("style", "text-align:center");
    element.setAttribute("type", "number");
    element.setAttribute("min", "0");
    element.setAttribute("max", "4");
    element.setAttribute("step", "1");
    element.value = "0";
    element.onchange = CalculateAverage;
    row.insertCell(-1).appendChild(element);

}

function CalculateAverage() {
    let key;
    let p = document.getElementById("test");
    let table = document.getElementById("tab").rows;
    let sum = 0;
    let sum_dict = {};
    let weight_dict = {};
    for (let item of table) {
        if (item.cells[0].innerHTML === ("ON" || "Nazwa" || "Przedmiot" || "Ocena" || "Waga")) continue;
        if (!item.cells[0].firstChild.checked) continue;
        let nazwa = item.cells[2].innerHTML.includes("<input type=\"text\">") ? item.cells[2].firstChild.value : item.cells[2].innerHTML;
        if (!(nazwa in sum_dict)) {
            sum_dict[nazwa] = 0
        }
        if (!(nazwa in weight_dict)) {
            weight_dict[nazwa] = 0
        }
        sum_dict[nazwa] += parseFloat(item.cells[3].firstChild.value) * parseFloat(item.cells[4].firstChild.value);
        weight_dict[nazwa] += parseInt(item.cells[4].firstChild.value);

        //sum += parseFloat(item.cells[3].firstChild.value) * parseFloat(item.cells[4].firstChild.value);
        //weights += parseInt(item.cells[4].firstChild.value);
    }
    for (key in sum_dict) {
        console.log(key, ": ", weight_dict[key] === 0 ? 0 : sum_dict[key] / weight_dict[key]);
        sum += weight_dict[key] === 0 ? 0 : sum_dict[key] / weight_dict[key];
    }

    p.innerText = "Średnia: " + parseFloat((sum / Object.entries(sum_dict).filter(([k, v]) => v > 0).length).toFixed(2));
}

function LoadJSON() {
    let arr = [];
    $(".middle :checkbox").each(function () {
        if ($(this).is(":checked")) {
            arr.push($(this).val())
        }
    });
    let vals = arr.join(",");

    const Http = new XMLHttpRequest();
    let url = location.protocol + '//' + location.hostname + ':' + location.port + '/grades';
    if (vals) {
        url = location.protocol + '//' + location.hostname + ':' + location.port + '/grades?filter=' + vals;
    }
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = () => {
        //console.log(Http.responseText);
        if (Http.readyState === 4) {
            CreateTableFromJSON(Http.responseText);
            CalculateAverage()
        }
    }
}


function CreateTableFromJSON(json) {
    let e = JSON.parse(json);
    document.getElementById('json2table').innerHTML = JSON.stringify(e);
    for (e, o = [], r = 0; r < e.length; r++) {
        for (let t in e[r]) -1 === o.indexOf(t) && o.push(t);

    }

    let n = document.createElement("table"), m = document.createElement("thead"), a = m.insertRow(-1);

    o.splice(0, 0, "ON");

    for (r = 0; r < o.length; r++) {
        let i = document.createElement("th");
        i.innerHTML = o[r];
        a.appendChild(i);
    }
    n.appendChild(m);
    let k = document.createElement("tbody");
    for (let r = 0; r < e.length; r++) {
        a = k.insertRow(-1);
        for (let c = 0; c < o.length; c++) {
            let cell = a.insertCell(-1);
            if (o[c] === "Przedmiot") {
                console.log(o[c])
            }
            if (o[c] === "ON") {
                let element = document.createElement("input");
                element.setAttribute("type", "checkbox");
                element.setAttribute("id", "biggerCheckBox");
                element.checked = true;
                element.onchange = CalculateAverage;
                cell.appendChild(element);
            } else if (o[c] === "Nazwa" || o[c] === "Przedmiot") {
                cell.innerHTML = e[r][o[c]];
                cell.setAttribute("style", "min-width:150px")
            } else {
                element = document.createElement("input");
                element.setAttribute("style", "text-align:center");
                element.setAttribute("type", "number");
                if (o[c] === "Ocena") {
                    element.setAttribute("min", "0");
                    element.setAttribute("max", "6");
                    element.setAttribute("step", "0.25");
                } else {
                    element.setAttribute("min", "0");
                    element.setAttribute("max", "4");
                    element.setAttribute("step", "1");
                }

                element.onchange = CalculateAverage;
                element.value = e[r][o[c]];
                cell.appendChild(element);
            }
        }
    }
    n.appendChild(k);
    let l = document.getElementById("showData");
    n.setAttribute('id', 'tab');
    l.innerHTML = "";
    l.appendChild(n);
    document.getElementById("addGradeButton").style.visibility = "visible"
}
