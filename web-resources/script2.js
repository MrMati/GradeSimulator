
function CalculateFinalAverage() {
    var p = document.getElementById("test"); 
    var table = document.getElementById("tab").rows;
    var sum = 0; var weights = 0;
    for (let item of table) {
        if(item.cells[0].innerHTML === ("ON" || "Nazwa" || "Ocena" || "Waga")) continue;
            if(!item.cells[0].firstChild.checked) continue;

            sum += parseFloat(item.cells[2].firstChild.value);
            weights += 1
        }
        p.innerText = "Średnia: " + parseFloat((sum / weights).toFixed(2));
    }

    function LoadFinalJSON() {

        const Http = new XMLHttpRequest();
        var url=location.protocol + '//' + location.hostname + ':' + location.port + '/grades/final';
        Http.open("GET", url);
        Http.send();
        Http.onreadystatechange = (e) => {
            //console.log(Http.responseText);
            CreateTableFromFinalJSON(Http.responseText);
            CalculateFinalAverage()
        }
    }


    function CreateTableFromFinalJSON(json) {
        var e = JSON.parse(json);
        document.getElementById('json2table').innerHTML = JSON.stringify(e);
        for (e, o = [], r = 0; r < e.length; r++) {
            for (var t in e[r])-1 === o.indexOf(t) && o.push(t); 

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

            if(o[c] === "ON") {
                var element=document.createElement("input");
                element.setAttribute("type", "checkbox");
                element.setAttribute("id", "biggerCheckBox");
                element.checked = true;
                element.onchange = CalculateAverage;
                cell.appendChild(element);
            } else if(o[c] === "Nazwa") {
                cell.innerHTML = e[r][o[c]];
                cell.setAttribute("style", "min-width:150px")
            } else {
                var element=document.createElement("input");
                element.setAttribute("style", "text-align:center");
                element.setAttribute("type", "number");
                if(o[c] === "Ocena") {
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
    n.setAttribute('id', 'tab'); l.innerHTML = "", l.appendChild(n) 
    document.getElementById("addGradeButton").style = "";
}
