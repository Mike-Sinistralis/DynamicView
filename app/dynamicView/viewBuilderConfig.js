/*
    Config file for Sinistral's Dynamic View overlay. Refer to config.js for help in finding out what data keys return what data.
    To change what is rendered in each view, simple add/remove/edit entries inside of the view you wish to edit. headerDef's are your static data point labels, and bodyDef is what holds the actual data.
    So say you want to add attacks missed to the damageView. You would simply add:

    { text: "Misses", width: 3%, align:"center" } to the headerDef, and
    { text: combatantOptions.MISSES, width: 3%, align: "center" } to the bodyDef.
    You may substitue text for html as needed. HTML will always take precedence over text. If you are not using HTML, make sure you say the html field to null.
    Again, refer to config.js to see what options are available to you.

    If you want to edit encounterDef, make sure you use encounterOptions instead.


    You can also add entirely new views. Just follow the structure of the ones given. The view builder will pick up the changes and add it as an option.

*/

    /*
        Allows for dynamic sorting when changing view. This might be CPU intensive for some users. Leave this disabled if you are not using a overlay that uses the viewBuilder.
    */
var enableDynamicSort = false,

    /*
        Data attached to every view filter. Editing this will change every single view.
    */
    globalView = {
        headerDef: [
            { text: "Job", width: "1.5%", align: "center" },
            { text: "Name", width: "3%", align: "left" }
        ],
        bodyDef: [
            { html: "<img src='./images/default/{JobOrName}.png' style='width=1.5%;height:auto;' />", align: "center" },
            { text: combatantOptions.NAME, width: "3%",  align: "left" }
        ]
    },

    dynamicViewList = [
        /*
            A view meant to give detailed DPS data.
        */
        damageView = {
            headerDef: [
                { text: "DPS" , width: "3%", align: "center", span: 2 },
                { text: "Crit %", width: "1.5%", align: "left" },
                { text: "Acc %", width: "2%", align: "left" },
                { text: "Max Hit", width: "4%", align: "left"}
            ],
            bodyDef: [
                { text: combatantOptions.DPS, width: "1.5%", align: "left" },
                { text: combatantOptions.DAMAGE_PERCENT, width: "1.5%", align: "left" },
                { text: combatantOptions.CRITICAL_PERCENTAGE, width: "1.5%", align: "left" },
                { text: combatantOptions.TO_HIT, width: "2%", align: "left" },
                { text: combatantOptions.MAX_HIT, width: "4%", align: "left"}
            ],
            encounterDef: {
                text: "Time: {0}  /  DPS: {1}  /  Damage Dealt: {2}",
                html: null,
                options: [encounterOptions.DURATION, encounterOptions.DPS_ROUNDED, encounterOptions.DAMAGE]
            },
            sortDef: combatantOptions.DPS
        },

        /*
            A view meant to give detailed Healer data.
        */
        healedView = {
            headerDef: [
                { text: "HPS", width: "3%", align: "left", span: 2 },
                { text: "Heal Crit %", width: "2%", align: "left" },
                { text: "OverHeal %", width: "2%", align: "left" },
                { text: "Max Heal", width: "4%", align: "left"}
            ],
            bodyDef: [
                { text: combatantOptions.HPS, width: "1.5%", align: "left" },
                { text: combatantOptions.HEALED_PERCENTAGE, width: "2%", align: "left"},
                { text: combatantOptions.CRITICAL_HEALS_PERCENTAGE, width: "2%", align: "left" },
                { text: combatantOptions.OVERHEAL_PERCENT, width: "2%", align: "left" },
                { text: combatantOptions.MAXHEAL, width: "4%", align: "left"}
            ],
            encounterDef: {
                text: "Time: {0}  /  HPS: {1}  /  Healing Done: {2}",
                html: null,
                options: [encounterOptions.DURATION, encounterOptions.HPS_ROUNDED, encounterOptions.HEALED]
            },
            sortDef: combatantOptions.HPS
        },

        /*
            A view meant to help Tanks figure out their mitigation specs and how much healing they require per encounter.
        */
        tankView = {
            headerDef: [
                { text: "Block %", width: "3%", align: "left" },
                { text: "Parry %", width: "2%", align: "left" },
                { text: "Damage Taken", width: "2%", align: "left" },
                { text: "Healing Taken", width: "4%", align: "left"}
            ],
            bodyDef: [
                { text: combatantOptions.PARRY_RATE, width: "1.5%", align: "left" },
                { text: combatantOptions.BLOCK_RATE, width: "2%", align: "left"},
                { text: combatantOptions.DAMAGE_TAKEN, width: "2%", align: "left" },
                { text: combatantOptions.HEALS_TAKEN, width: "2%", align: "left" },
            ],
            encounterDef: {
                text: "Time: {0}  /  DPS: {1}  /  HPS: {2}",
                html: null,
                options: [encounterOptions.DURATION, encounterOptions.DPS_ROUNDED, encounterOptions.HPS_ROUNDED]
            },
            sortDef: combatantOptions.DAMAGE_TAKEN
        }
    ];