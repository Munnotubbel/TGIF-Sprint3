async function getData() {
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
        attendance(members)
    }

    if (document.title === "Loyalty - Senate" || document.title === "Loyalty - House") {

        loyalty(members)
    }
    if (document.title === "Congress 113 - Senate" || document.title === "Congress 113 - House") {
        buildFilter(members);
        createEvent(puffpuff)
        /* change(members); */
    }
    console.log("puffpuff länge" + puffpuff.length)
    console.log("Fetch Live Erfolgreich Beendet")
    //------------------------------------
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



//---------------------create member Table function ---------
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
            vote = members[z].votes_with_party_pct + " %"
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
            missedVotesPct = members[z].missed_votes_pct + " %"
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



//---------------------Add Data function ---------
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




//---------------Glance tables-------------------------------------------------

function callGlanceTable(members) {

    /*--------------------- Numbers of Party overall----------------*/
    var statG = stats.Glance;
    for (var i = 0; i < members.length; i++) {
        if (members[i].party === "R") {
            ++statG[1].number;
        } else if (members[i].party === "D") {
            ++statG[0].number;
        } else {
            ++statG[2].number;
        }
    }
    console.log()
    statG[3].number =
        statG[0].number + statG[1].number + statG[2].number;

    /*----------------- voWiPa_PCT with party ---------------*/
    var vwpHD = 0;
    var vwpHD = 0;
    var vwpHR = 0;
    var vwpHI = 0;
    for (var j = 0; j < members.length; j++) {
        if (members[j].party === "D") {
            if (typeof members[j].votes_with_party_pct != "undefined") {
                vwpHD += members[j].votes_with_party_pct;
            }
        } else if (members[j].party === "R") {
            if (typeof members[j].votes_with_party_pct != "undefined") {
                vwpHR += members[j].votes_with_party_pct;
            }
        } else {
            if (typeof members[j].votes_with_party_pct != "undefined") {
                vwpHI += members[j].votes_with_party_pct;
            }
        }
    }

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
        cell3.innerHTML = statG[k].percent;

    }
}
console.log("Glance Table Erfolgreich")

//------------Attendance-------------------------------------------------------------

function attendance(members) {
    for (var z = 0; z < stats.mem.length; z++)
        if (stats.mem[z].miVo_PCT !== "-") {
            stats.attendance.push(stats.mem[z])

        }

    // -------- Sort and Push it into low and high array -----------

    stats.attendance.sort((a, b) => {
        return a.miVo_PCT < b.miVo_PCT ? 1 : -1;
    });
    for (var b = 0; b < members.length / 10; b++) {
        stats.attendance_low.push(stats.attendance[b]);
    }
    stats.attendance.sort((a, b) => {
        return a.miVo_PCT * 100 > b.miVo_PCT * 100 ? 1 : -1;
    });


    for (var b = 0; b < members.length / 10; b++) {
        stats.attendance_max.push(stats.attendance[b]);
    }
    //-------------------- Fill Tables--------------------
    function fillAttendanceTables(tableID, arrInput) {
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
            cell2.innerHTML = arrInput[e].miVo;
            row.appendChild(cell3);
            cell3.innerHTML = arrInput[e].miVo_PCT;
        }
    }
    fillAttendanceTables(table1, stats.attendance_low);
    fillAttendanceTables(table2, stats.attendance_max);
    console.log("Attendance Erfolgreich")
}





//------------Loyalti-------------------------------------------------------------

function loyalty(members) {
    for (var z = 0; z < stats.mem.length; z++)
        if (stats.mem[z].voWiPa_PCT !== "-") {
            stats.loyalty.push(stats.mem[z])

        }

    stats.loyalty.sort((a, b) => {
        return (a.voWiPa_PCT > b.voWiPa_PCT) ? 1 : -1
    })

    for (var c = 0; c < ((members.length) / 10); c++) {
        stats.loyalty_low.push(stats.loyalty[c])
    };

    stats.loyalty.sort((a, b) => {
        return (a.voWiPa_PCT < b.voWiPa_PCT) ? 1 : -1
    })


    for (var c = 0; c < ((members.length) / 10); c++) {
        stats.loyalty_max.push(stats.loyalty[c])
    };


    //-------------------- Fill Tables--------------------
    function fillLoyaltyTables(tableID, arrInput) {
        for (var e = 0; e < arrInput.length; e++) {
            var tableLoy = document.getElementById(tableID);
            var row = document.createElement("tr");
            var cell1Loy = document.createElement("td");
            var cell2Loy = document.createElement("td");
            var cell3Loy = document.createElement("td");

            tableLoy.appendChild(row);
            row.appendChild(cell1Loy);
            cell1Loy.innerHTML =
                "<a href=" +
                arrInput[e].url +
                ">" +
                arrInput[e].name +
                "</a>";
            row.appendChild(cell2Loy);
            cell2Loy.innerHTML = arrInput[e].nuPaVo;
            row.appendChild(cell3Loy);
            cell3Loy.innerHTML = arrInput[e].voWiPa_PCT;
        }
    }
    fillLoyaltyTables(table1, stats.loyalty_low);
    fillLoyaltyTables(table2, stats.loyalty_max);
    console.log("Loyaltiy Erfolgreich")
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
    console.log(puffpuff);
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
        } else if (filterArr.length > 0 && stateArr.length > 0 && stateArr.includes(puffpuff[zl].state) && filterArr.includes(puffpuff[zl].party)) {
            filteredMembers.push((puffpuff[zl]))

        }

    }
    console.log(filteredMembers);
    addMemberTable(filteredMembers);

}



getData();