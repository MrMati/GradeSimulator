function SelectAll() {

    var button = document.getElementById("selectallbut");


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
    var tbody = document.getElementById("tab").getElementsByTagName('tbody')[0];
    var row = tbody.insertRow(-1);
    var element = document.createElement("input");
    element.setAttribute("type", "checkbox");
    element.setAttribute("id", "biggerCheckBox");
    element.checked = true;
    element.onchange = CalculateAverage;
    row.insertCell(-1).appendChild(element);

    element = document.createElement("input");
    element.setAttribute("type", "text");
    row.insertCell(-1).appendChild(element);

    element = document.createElement("input");
    element.setAttribute("style", "text-align:center");
    element.setAttribute("type", "number");
    element.setAttribute("min", "0");
    element.setAttribute("max", "6");
    element.setAttribute("step", "0.25");
    element.value = 0;
    element.onchange = CalculateAverage;
    row.insertCell(-1).appendChild(element);
    console.log(element);

    element = document.createElement("input");
    element.setAttribute("style", "text-align:center");
    element.setAttribute("type", "number");
    element.setAttribute("min", "0");
    element.setAttribute("max", "4");
    element.setAttribute("step", "1");
    element.value = 0;
    element.onchange = CalculateAverage;
    row.insertCell(-1).appendChild(element);

}

function CalculateAverage() {
    var p = document.getElementById("test");
    var table = document.getElementById("tab").rows;
    var sum = 0;
    var sum_dict = {};
    var weight_dict = {};
    for (let item of table) {
        console.log(item.cells[2]);
        if (item.cells[0].innerHTML === ("ON" || "Przedmiot" || "Nazwa" || "Ocena" || "Waga")) continue;
        if (!item.cells[0].firstChild.checked) continue;
        if (!(item.cells[2].innerHTML in sum_dict)) {
            sum_dict[item.cells[2].innerHTML] = 0
        }
        if (!(item.cells[2].innerHTML in weight_dict)) {
            weight_dict[item.cells[2].innerHTML] = 0
        }
        sum_dict[item.cells[2].innerHTML] += parseFloat(item.cells[3].firstChild.value) * parseFloat(item.cells[4].firstChild.value);
        weight_dict[item.cells[2].innerHTML] += parseInt(item.cells[4].firstChild.value);

        //sum += parseFloat(item.cells[3].firstChild.value) * parseFloat(item.cells[4].firstChild.value);
        //weights += parseInt(item.cells[4].firstChild.value);
    }
    for (var key in sum_dict) {
        console.log(key, ": ", sum_dict[key] / weight_dict[key]);
        sum += sum_dict[key] / weight_dict[key];
    }
    p.innerText = "Średnia: " + parseFloat((sum / Object.keys(sum_dict).length).toFixed(2));
}

function LoadJSON() {
    var arr = []
    $(".middle :checkbox").each(function () {
        if ($(this).is(":checked")) {
            arr.push($(this).val())
        }
    })
    var vals = arr.join(",");

    const Http = new XMLHttpRequest();
    var url = location.protocol + '//' + location.hostname + ':' + location.port + '/grades';
    if (vals) {
        url = location.protocol + '//' + location.hostname + ':' + location.port + '/grades/subject/' + vals;
    }
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (e) => {
        //console.log(Http.responseText);
        CreateTableFromJSON(Http.responseText);
        CalculateAverage()
    }
}


function CreateTableFromJSON(json) {
    var e = JSON.parse(json);
    document.getElementById('json2table').innerHTML = JSON.stringify(e);
    for (e, o = [], r = 0; r < e.length; r++) {
        for (var t in e[r]) -1 === o.indexOf(t) && o.push(t);

    }

    var n = document.createElement("table"), m = document.createElement("thead"), a = m.insertRow(-1);

    o.splice(0, 0, "ON")

    for (r = 0; r < o.length; r++) {
        var i = document.createElement("th");
        i.innerHTML = o[r];
        a.appendChild(i);
    }
    n.appendChild(m);
    k = document.createElement("tbody");
    for (r = 0; r < e.length; r++) {
        a = k.insertRow(-1);
        for (var c = 0; c < o.length; c++) {
            var cell = a.insertCell(-1);
            if (o[c] === "Przedmiot") {
                console.log(o[c])
            }
            if (o[c] === "ON") {
                var element = document.createElement("input");
                element.setAttribute("type", "checkbox");
                element.setAttribute("id", "biggerCheckBox");
                element.checked = true;
                element.onchange = CalculateAverage;
                cell.appendChild(element);
            } else if (o[c] === "Nazwa" || o[c] === "Przedmiot") {
                cell.innerHTML = e[r][o[c]];
                cell.setAttribute("style", "min-width:150px")
            } else {
                var element = document.createElement("input");
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
    var l = document.getElementById("showData");
    n.setAttribute('id', 'tab');
    l.innerHTML = "", l.appendChild(n)
    document.getElementById("addGradeButton").style = "";
}
