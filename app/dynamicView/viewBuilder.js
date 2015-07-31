viewBuilder = (function(){

	var viewType = {
	    	DAMAGE: "Damage",
	    	HEALING: "Healing",
	    	TANKING: "Tanking"
		},
		currentView = viewType.DAMAGE,
		currentData = null,

		encounterData = null,
		conbatantTable = null,

   		lastHeaderView = null,
   		lastBodyView = null,
   		cachedHeader = null,
   		cachedBody = null;

	function parseActFormat(str, dictionary) 
	{
	    var result = "";

	    while(str.indexOf("{") > -1)
	    {
	    	
	    }

	    var currentIndex = 0;
	    do {
	        var openBraceIndex = str.indexOf('{', currentIndex);
	        if (openBraceIndex < 0) {
	            result += str.slice(currentIndex);
	            break;
	        }
	        else {
	            result += str.slice(currentIndex, openBraceIndex);
	            var closeBraceIndex = str.indexOf('}', openBraceIndex);
	            if (closeBraceIndex < 0) {
	                // parse error!
	                console.log("parseActFormat: Parse error: missing close-brace for " + openBraceIndex.toString() + ".");
	                return "ERROR";
	            }
	            else {
	                var tag = str.slice(openBraceIndex + 1, closeBraceIndex);
	                if (typeof dictionary[tag] !== 'undefined') {
	                    result += dictionary[tag];
	                } else {
	                    console.log("parseActFormat: Unknown tag: " + tag);
	                    result += "ERROR";
	                }
	                currentIndex = closeBraceIndex + 1;
	            }
	        }
	    } while (currentIndex < str.length);

	    return result;
	}

	function updateEncounter(data) 
	{
    	encounterData.innerText = parseActFormat(encounterDefine, data.Encounter)
	}

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
		var headerDefinition,
			appendingHeader;

		if(lastHeaderView !== currentView)
		{
			headerDefinition = globalView.headerDef;

			switch(currentView)
			{
				case viewType.DAMAGE:
					appendingHeader = damageView.headerDef;
					break;
				case viewType.HEALING:
					appendingHeader = healingView.headerDef;
					break;
				case viewType.TANKING:
					appendingHeader = tankingView.headerDef;
					break;
			}

			lastHeaderView = currentView;
			cachedHeader = headerDefinition.concat(appendingHeader);
		}

		return cachedHeader;
	}

	function buildViewBody()
	{
		var bodyDefinition,
			appendingBody;

		if(lastBodyView !== currentView)
		{
			bodyDefinition = globalView.bodyDef;

			switch(currentView)
			{
				case viewType.DAMAGE:
					appendingBody = damageView.bodyDef;
					break;
				case viewType.HEALING:
					appendingBody = healingView.bodyDef;
					break;
				case viewType.TANKING:
					appendingBody = tankingView.bodyDef;
					break;
			}

			lastBodyView = currentView;
			cachedBody = bodyDefinition.concat(appendingBody);
		}

		return cachedBody;
	}

	function buildEncounter()
	{

	}



	function ViewBuilder() {};

	ViewBuilder.prototype.update = function(data) {
		if(data)
		{
			currentData = data;
		}
		//TODO: Build Everything
	};

	ViewBuilder.prototype.setView = function(view) {
		currentView = view;
	};

	ViewBuilder.prototype.init = function() {
		encounterData = document.getElementById("encounterData");
		combatantTable = document.getElementById("combatantTable");
	};

    return new ViewBuilder();
}());