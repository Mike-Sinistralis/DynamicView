viewBuilder = (function(){

    var currentView = 0,
        currentData = null,

        encounterData = null,
        conbatantTable = null,

        defCache = {
            encounterDef: null,
            headerDef: null,
            bodyDef: null
        },

        defType = {
            ENCOUNTER: "encounterDef",
            HEADER: "headerDef",
            BODY: "bodyDef"
        }

    function getCurrentView(def)
    {
        var view,
            viewArray;

        if(def == defType.ENCOUNTER)
        {
            return dynamicViewList[currentView].encounterDef;
        }

        view = globalView[def];

        viewIterable = dynamicViewList[currentView][def];

        for(var i = 0; i < viewIterable.length; i++)
        {
            view.push(viewIterable[i]);
        }

        defCache[def] = view;

        return view;
    }

    function buildViewHeader()
    {
        var tableHeader = document.createElement("thead"),
            headerRow = tableHeader.insertRow(),
            currentView = defCache.headerDef || getCurrentView(defType.HEADER);
        
        tableHeader.id = "combatantTableHeader";

        for(var i = 0; i < currentView.length; i++) {
            var cell = document.createElement("th");

            if(currentView[i].text) 
            {
                cell.innerText = currentView[i].text;
            } 
            else
            {
                cell.innerHTML = currentView[i].html;
            }

            cell.style.width = currentView[i].width;
            cell.style.maxWidth = currentView[i].width;

            if(currentView[i].span) 
            {
                cell.colSpan = currentView[i].span;
            }

            if(currentView[i].align) 
            {
                cell.style.textAlign = currentView[i].align;
            }

            headerRow.appendChild(cell);
        }

        combatantTable.tHead = tableHeader;
    }

    function buildViewBody()
    {

    }

    function buildViewEncounter()
    {
        var encounterTemplate,
            preRenderedStore,
            currentView = defCache.encounterDef || getCurrentView(defType.ENCOUNTER);

        if(currentView.html)
        {
            encounterTemplate = currentView.html;
            encounterData.innerHTML = loadOptions(encounterTemplate, currentView.options, getEncounterData(currentData));
        }
        else
        {
            encounterTemplate = currentView.text;
            encounterData.innerText = loadOptions(encounterTemplate, currentView.options, getEncounterData(currentData));
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
    };

    ViewBuilder.prototype.setView = function(viewIndex) {
        currentView = viewIndex;

        defCache.encounterDef = null;
        defCache.headerDef = null;
        defCache.bodyDef = null;

        this.update();
    };

    ViewBuilder.prototype.init = function() {
        encounterData = document.getElementById("encounterData");
        combatantTable = document.getElementById("combatantTable");
    };

    return new ViewBuilder();
}());

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