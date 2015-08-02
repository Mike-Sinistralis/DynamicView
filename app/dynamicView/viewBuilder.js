viewBuilder = (function(){

    var currentView = dynamicViewList[0],
        currentData = null,

        encounterData = null,
        conbatantTable = null,

        lastHeaderView = null,
        lastBodyView = null,
        cachedHeader = null,
        cachedBody = null,

        preRenderedView = {
            encounter: {
                text: "",
                html: ""
            },
            header: {
                text: "",
                html: ""
            },
            body: {
                text: "",
                html: ""
            }
        };

function updateCombatantListHeader() {
    var tableHeader = document.createElement("thead"),
        headerRow = tableHeader.insertRow(),

        //TODO:
        headerDefine = viewBuilder.buildViewHeader();

    tableHeader.id = "combatantTableHeader";

    for(var i = 0; i < headerDefine.length; i++) {
        var cell = document.createElement("th");

        if(headerDefine[i].text) 
        {
            cell.innerText = headerDefine[i].text;
        } 
        else
        {
            cell.innerHTML = headerDefine[i].html;
        }

        cell.style.width = headerDefine[i].width;
        cell.style.maxWidth = headerDefine[i].width;

        if(headerDefine[i].span) 
        {
            cell.colSpan = headerDefine[i].span;
        }

        if(headerDefine[i].align) 
        {
            cell.style.textAlign = headerDefine[i].align;
        }

        headerRow.appendChild(cell);
    }

    table.tHead = tableHeader;
}

function updateCombatantList(data) {
    var table = document.getElementById('combatantTable');
    var oldTableBody = table.tBodies.namedItem('combatantTableBody');
    var newTableBody = document.createElement("tbody");
    newTableBody.id = "combatantTableBody";
    var bodyDefine = viewBuilder.buildViewBody();

    var combatantIndex = 0;
    for (var combatantName in data.Combatant) {
        var combatant = data.Combatant[combatantName];
        combatant.JobOrName = combatant.Job || combatantName;
        var egiSearch = combatant.JobOrName.indexOf("-Egi (");
        if (egiSearch != -1) {
            combatant.JobOrName = combatant.JobOrName.substring(0, egiSearch);
        }
        else if (combatant.JobOrName.indexOf("Eos (") == 0) {
            combatant.JobOrName = "Eos";
        }
        else if (combatant.JobOrName.indexOf("Selene (") == 0) {
            combatant.JobOrName = "Selene";
        }
        else if (combatant.JobOrName.indexOf("Carbuncle (") != -1) {
            // currently no carbuncle pics
        }
        else if (combatant.JobOrName.indexOf(" (") != -1) {
            combatant.JobOrName = "choco";
        }


        var tableRow = newTableBody.insertRow(newTableBody.rows.length);
        for (var i = 0; i < bodyDefine.length; i++) {
            var cell = tableRow.insertCell(i);
            // テキスト設定
            if (typeof bodyDefine[i].text !== 'undefined') {
                var cellText;
                if (typeof bodyDefine[i].text === 'function') {
                    cellText = bodyDefine[i].text(combatant, combatantIndex);
                } else {
                    cellText = parseActFormat(bodyDefine[i].text, combatant);
                }
                cell.innerText = cellText;
            } else if (typeof bodyDefine[i].html !== 'undefined') {
                var cellHTML;
                if (typeof bodyDefine[i].html === 'function') {
                    cellHTML = bodyDefine[i].html(combatant, combatantIndex);
                } else {
                    cellHTML = parseActFormat(bodyDefine[i].html, combatant);
                }
                cell.innerHTML = cellHTML;
            }
            // 幅設定
            cell.style.width = bodyDefine[i].width;
            cell.style.maxWidth = bodyDefine[i].width;
            // 行構え設定
            if (typeof (bodyDefine[i].align) !== 'undefined') {
                cell.style.textAlign = bodyDefine[i].align;
            }
            // エフェクト実行
            if (typeof bodyDefine[i].effect === 'function') {
                bodyDefine[i].effect(cell, combatant, combatantIndex);
            }
        }
        combatantIndex++;
    }

    // tbody が既に存在していたら置換、そうでないならテーブルに追加
    if (oldTableBody != void (0)) {
        table.replaceChild(newTableBody, oldTableBody);
    }
    else {
        table.appendChild(newTableBody);
    }
}

    function buildViewHeader()
    {

    }

    function buildViewBody()
    {

    }

    function buildViewEncounter()
    {
        var encounterTemplate,
            preRenderedStore;

        if(currentView.encounterDef.html)
        {
            encounterTemplate = currentView.encounterDef.html;
            preRenderedView.encounter.html = loadOptions(encounterTemplate, currentView.encounterDef.options, getEncounterData(currentData));
        }
        else
        {
            encounterTemplate = currentView.encounterDef.text;
            preRenderedView.encounter.text = loadOptions(encounterTemplate, currentView.encounterDef.options, getEncounterData(currentData));
        }
    }

    function renderView()
    {
        if(preRenderedView.encounter.html)
        {
            encounterData.innerHTML = preRenderedView.encounter.html;
        }
        else
        {
            encounterData.innerText = preRenderedView.encounter.text;
        }

        if(preRenderedView.header.html)
        {

        }
        else
        {

        }

        if(preRenderedView.body.html)
        {

        }
        else
        {

        }
    }



    function ViewBuilder() {};

    ViewBuilder.prototype.update = function(data) {
        if(data)
        {
            currentData = data;
        }
        buildViewEncounter();
        buildViewHeader();
        buildViewBody();
        renderView();
    };

    ViewBuilder.prototype.setView = function(viewIndex) {
        currentView = dynamicViewList[viewIndex];
        this.update();
    };

    ViewBuilder.prototype.init = function() {
        encounterData = document.getElementById("encounterData");
        combatantTable = document.getElementById("combatantTable");
    };

    return new ViewBuilder();
}());