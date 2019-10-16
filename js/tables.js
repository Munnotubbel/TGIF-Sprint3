async function getDataSen() {
    if (document.title === "Congress 113 - Senate" || document.title === "Attendance - Senate" || document.title === "Loyalty - Senate") {

        const response = await fetch(
            "https://api.propublica.org/congress/v1/115/senate/members.json", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": "kst4bl191LeYjLbPO06qK3hOs0CEuH9BfnLKCaE5"
                }
            }
        );
        var data = await response.json();
        var members = data.results[0].members;
        tableFunction(members)
        var puffpuff = stats.mem;

        if (document.title === "Congress 113 - Senate" || document.title === "Congress 113 - House") {
            addMemberTable(stats.mem)

        };

        if (document.title === "Attendance - Senate" || document.title === "Attendance - House" ||
            document.title === "Loyalty - Senate" || document.title === "Loyalty - House") {
            callGlanceTable(members)
        }

        if (document.title === "Attendance - Senate" || document.title === "Attendance - House") {
            attendance('miVo_PCT', 'miVo')
        }

        if (document.title === "Loyalty - Senate" || document.title === "Loyalty - House") {

            attendance('voWiPa_PCT', 'nuPaVo')
        }
        if (document.title === "Congress 113 - Senate" || document.title === "Congress 113 - House") {
            buildFilter(members);
            createEvent(puffpuff)
            /* change(members); */
        }
        console.log("Fetch Live Erfolgreich Beendet")
        //------------------------------------
    }
};



async function getDataHou() {
    if (document.title === "Congress 113 - House" || document.title === "Attendance - House" || document.title === "Loyalty - House") {
        const response = await fetch("https://api.propublica.org/congress/v1/115/house/members.json", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": "kst4bl191LeYjLbPO06qK3hOs0CEuH9BfnLKCaE5"
            }
        });
        var data = await response.json();
        var members = data.results[0].members;
        tableFunction(members)
        var puffpuff = stats.mem;

        if (document.title === "Congress 113 - Senate" || document.title === "Congress 113 - House") {
            addMemberTable(stats.mem)

        };

        if (document.title === "Attendance - Senate" || document.title === "Attendance - House" ||
            document.title === "Loyalty - Senate" || document.title === "Loyalty - House") {
            callGlanceTable(members)
        }

        if (document.title === "Attendance - Senate" || document.title === "Attendance - House") {
            attendance('miVo_PCT', 'miVo')
        }

        if (document.title === "Loyalty - Senate" || document.title === "Loyalty - House") {

            attendance('voWiPa_PCT', 'nuPaVo')
        }
        if (document.title === "Congress 113 - Senate" || document.title === "Congress 113 - House") {
            buildFilter(members);
            createEvent(puffpuff)
            /* change(members); */
        }

        console.log("Fetch Live Erfolgreich Beendet")
        //------------------------------------
    }
}



console.log("Name der Seite: " + document.title)


function getFullName(first, middle, last) {

    if (middle === null) {
        middle = " "
    } else {
        middle.charAt(0) + ". "
    }
    var full = first.charAt(0) + ". " + middle + " " + last;
    return full;
};

function round(x) {
    return Number.parseFloat(x).toFixed(2);
};

function roundfull(x) {
    return Number.parseFloat(x).toFixed(0);
}

var table1 = "tableLeft";
var table2 = "tableRight"



//--------------create member Table function ------------------------------create member Table function
function tableFunction(members) {


    for (var z = 0; z < members.length; z++) {
        let fullName = getFullName(
            members[z].first_name,
            members[z].middle_name,
            members[z].last_name
        );

        let vote = 0;

        if (typeof members[z].votes_with_party_pct == "undefined") {
            vote = "-"
        } else {
            vote = (members[z].votes_with_party_pct * 100)
        }

        let missedVotes = 0
        if (typeof members[z].missed_votes == "undefined") {
            missedVotes = "-"
        } else {
            missedVotes = members[z].missed_votes
        }

        let missedVotesPct = 0;
        if (typeof members[z].missed_votes_pct == "undefined") {
            missedVotesPct = "-"
        } else {
            missedVotesPct = members[z].missed_votes_pct * 100
        }

        let numPartyVotes = roundfull(((members[z].votes_with_party_pct / 100) * ((1 - ((members[z].missed_votes_pct) / 100)) * (members[z].total_votes))));



        stats.mem.push({
            name: fullName,
            party: members[z].party,
            url: members[z].url,
            seni: members[z].seniority,
            state: members[z].state,
            voWiPa_PCT: vote,
            miVo: missedVotes,
            miVo_PCT: missedVotesPct,
            nuPaVo: numPartyVotes,

        })
    }

    console.log("Member Daten erfolgreich gesammelt")
}



//---------------------Add Data function ------------------------------------Add Data function
function addMemberTable(whichArr) {
    for (var e = 0; e < whichArr.length; e++) {
        var table = document.getElementById("table");
        var row = document.createElement("tr");
        var cell1 = document.createElement("td");
        var cell2 = document.createElement("td");
        var cell3 = document.createElement("td");
        var cell4 = document.createElement("td");
        var cell5 = document.createElement("td");
        table.appendChild(row);
        row.appendChild(cell1);
        cell1.innerHTML =
            "<a href=" + whichArr[e].url + ">" + whichArr[e].name + "</a>";
        row.appendChild(cell2);
        cell2.innerHTML = whichArr[e].party;
        row.appendChild(cell3);
        cell3.innerHTML = whichArr[e].state;
        row.appendChild(cell4);
        cell4.innerHTML = whichArr[e].seni;
        row.appendChild(cell5);
        cell5.innerHTML = whichArr[e].voWiPa_PCT;
    }
    console.log("Table Erfolgreich Erzeugt")
}




//---------------Glance tables-------------------------------------------------Glance tables

function callGlanceTable(members) {
    var statG = stats.Glance;
    var vwpHD = 0;
    var vwpHD = 0;
    var vwpHR = 0;
    var vwpHI = 0;
    for (var j = 0; j < members.length; j++) {
        if (members[j].party === "D") {
            ++statG[0].number;
            if (typeof members[j].votes_with_party_pct != "undefined") {
                vwpHD += members[j].votes_with_party_pct;
            }
        } else if (members[j].party === "R") {
            ++statG[1].number;
            if (typeof members[j].votes_with_party_pct != "undefined") {
                vwpHR += members[j].votes_with_party_pct;
            }
        } else {
            ++statG[2].number;
            if (typeof members[j].votes_with_party_pct != "undefined") {
                vwpHI += members[j].votes_with_party_pct;
            }
        }
    }
    statG[3].number =
        statG[0].number + statG[1].number + statG[2].number;
    statG[0].percent = round(vwpHD / statG[0].number);
    statG[1].percent = round(vwpHR / statG[1].number);
    var y = vwpHI / statG[2].number;

    if (statG[2].number === 0) {
        statG[2].percent = 0;
    } else {
        statG[2].percent = round(vwpHI / statG[2].number);
    };


    statG[3].percent = round((vwpHD + vwpHR + vwpHI) / statG[3].number);


    /*----------------- post Glance Table ---------------*/

    for (var k = 0; k < statG.length; k++) {
        var glanceTable = document.getElementById("glanceTable");
        var row = document.createElement("tr");
        var cell1 = document.createElement("td");
        var cell2 = document.createElement("td");
        var cell3 = document.createElement("td");

        glanceTable.appendChild(row);
        row.appendChild(cell1);
        cell1.innerHTML = statG[k].name;
        row.appendChild(cell2);
        cell2.innerHTML = statG[k].number;
        row.appendChild(cell3);
        cell3.innerHTML = statG[k].percent + " %";

    }
}
console.log("Glance Table Erfolgreich")

//------------10% Tables-------------------------------------------------------------10% Tables

function attendance(spalte3Wert, spalte2Wert) {
    for (var z = 0; z < stats.mem.length; z++)
        if (stats.mem[z][spalte3Wert] !== "-") {
            stats.gabArr.push(stats.mem[z])

        }

    var result = stats.gabArr.reduce((unique, o) => {
        if (!unique.some(obj => obj[spalte3Wert] === o[spalte3Wert])) {
            unique.push(o);
        }
        return unique;
    }, []);

    if (document.title === "Attendance - Senate" || document.title === "Attendance - House") {
        stats.gabArr.sort((a, b) => {
            return a[spalte3Wert] * 100 < b[spalte3Wert] * 100 ? 1 : -1;
        });
    } else {
        stats.gabArr.sort((a, b) => {
            return a[spalte3Wert] * 100 > b[spalte3Wert] * 100 ? 1 : -1;
        });
    }


    var d = 0;
    for (var b = 0; b < (result.length) * 0.1 + d; b++) {
        for (var c = 1; c < (result.length) * 0.1; c++) {
            if (stats.gabArr[b][spalte3Wert] == stats.gabArr[c][spalte3Wert]) {
                d++
            }
        }
        stats.gabArr_low.push(stats.gabArr[b])
    }


    if (document.title === "Attendance - Senate" || document.title === "Attendance - House") {
        stats.gabArr.sort((a, b) => {
            return a[spalte3Wert] * 100 > b[spalte3Wert] * 100 ? 1 : -1;
        });
    } else {
        stats.gabArr.sort((a, b) => {
            return a[spalte3Wert] * 100 < b[spalte3Wert] * 100 ? 1 : -1;
        });
    }
    var e = 0;
    for (var b = 0; b < (result.length) * 0.1 + e; b++) {
        for (var c = 1; c < (result.length) * 0.1; c++) {
            if (stats.gabArr[b][spalte3Wert] == stats.gabArr[c][spalte3Wert]) {
                e++
            }
        }
        stats.gabArr_max.push(stats.gabArr[b])
    }

    var min = stats.gabArr_low;
    var max = stats.gabArr_max;
    //-------------------- Fill Tables--------------------
    function fillAttendanceTables(tableID, arrInput, spalte2Wert, spalte3Wert) {
        for (var e = 0; e < arrInput.length; e++) {
            var table = document.getElementById(tableID);
            var row = document.createElement("tr");
            var cell1 = document.createElement("td");
            var cell2 = document.createElement("td");
            var cell3 = document.createElement("td");

            table.appendChild(row);
            row.appendChild(cell1);
            cell1.innerHTML =
                "<a href=" +
                arrInput[e].url +
                ">" +
                arrInput[e].name +
                "</a>";
            row.appendChild(cell2);
            cell2.innerHTML = arrInput[e][spalte2Wert];
            if (arrInput[e][spalte3Wert] !== "-") {
                row.appendChild(cell3);
                cell3.innerHTML = arrInput[e][spalte3Wert] / 100 + " %";
            }
        }
    }
    fillAttendanceTables(table1, min, spalte2Wert, spalte3Wert);
    fillAttendanceTables(table2, max, spalte2Wert, spalte3Wert);
    console.log("10% Tables Erfolgreich")
}

//-----------------------------Filter Functions-------------------------
//-------create filter Arrays with all States & partys out of JASON-----

function buildFilter(members) {
    for (var i = 0; i < members.length; i++) {
        if (stats.statesTable.includes(members[i].state)) {

        } else {
            stats.statesTable.push(members[i].state);
            stats.statesTable.sort()
        }
    }

    for (var i = 0; i < members.length; i++) {
        if (stats.polPartys.includes(members[i].party)) {

        } else {
            stats.polPartys.push(members[i].party);
            stats.polPartys.sort()
        }
    }


    //----------------- build up checkbox filter-----------------   

    for (var e = 0; e < stats.statesTable.length; e++) {
        var dropDown = document.getElementById("dropDownFilterState");
        var checkbox = document.createElement("li");
        dropDown.appendChild(checkbox);
        checkbox.innerHTML =
            '<input type="checkbox" class="checkbox" id="check_' + stats.statesTable[e] + '" value="' + stats.statesTable[e] + '">' + stats.statesTable[e];
    }
    console.log("Filter Erfolgreich erzeugt")
}

function createEvent(puffpuff) {
    let elem = document.getElementsByClassName('checkbox');
    for (var i = 0; i < elem.length; i++) {
        elem[i].addEventListener("change", function () {
            change(puffpuff)
        });
    }
}


function change(puffpuff) {
    document.getElementById("table").innerHTML = "";
    let filterArr = [];
    let stateArr = [];
    for (var t = 0; t < stats.polPartys.length; t++) { // checks if Party-checkboxes  are checked 
        if (document.getElementById("check" + stats.polPartys[t]).checked) {
            filterArr.push(document.getElementById("check" + stats.polPartys[t]).value);
        }
    }
    for (var i = 0; i < stats.statesTable.length; i++) { // checks if State-checkboxes  are checked 
        if (document.getElementById("check_" + stats.statesTable[i]).checked) {
            stateArr.push(document.getElementById("check_" + stats.statesTable[i]).value);
        }

    }

    console.log("selected Partys: " + filterArr);
    console.log("selected States: " + stateArr);
    var filteredMembers = []
    for (var zl = 0; zl < puffpuff.length; zl++) { //posts Table depending on checkboxes

        if (filterArr.length === 0 && puffpuff.length === 0) {
            filteredMembers.push((puffpuff[zl]))

        } else if (filterArr.length > 0 && stateArr.length === 0 && filterArr.includes(puffpuff[zl].party)) {
            filteredMembers.push((puffpuff[zl]))

        } else if (filterArr.length === 0 && stateArr.length > 0 && stateArr.includes(puffpuff[zl].state)) {
            filteredMembers.push((puffpuff[zl]))

        } else if (filterArr.length > 0 && stateArr.length > 0 &&
            stateArr.includes(puffpuff[zl].state) && filterArr.includes(puffpuff[zl].party)) {
            filteredMembers.push((puffpuff[zl]))


        }

    }

    addMemberTable(filteredMembers);

}



getDataSen();
getDataHou();