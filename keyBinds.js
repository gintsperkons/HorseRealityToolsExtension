(() => {
    var horsePagePattern = new RegExp("horsereality.com/horses/\\d+/.*");


    var horseConfig = {};
    var currentHorseObj = {};




    const callNeeded = (result) => {
        document.addEventListener("keyup", handleHorseKeyEvents)
        console.log("te")
    }



    const handleHorseKeyEvents = (event) => {
        console.log("te")
        e = event
        chrome.storage.local.get("horseConfig", (result) => {
            var target = event.target.tagName;
            if (target == "INPUT") {
                return;
            }
            if (!result["horseConfig"]) {
                horseConfig = {};
                return;
            } else {
                horseConfig = result["horseConfig"];
            }
            if (!horseConfig["keybinds"]) {
                return;
            }
            if (e.code === horseConfig["keybinds"]["horsePageAll"] && window.location.href != "https://v2.horsereality.com/horses/stall/all") {
                window.open("https://v2.horsereality.com/horses/stall/all", "_self");
            }
            if (e.code === horseConfig["keybinds"]["marketHomePage"] && window.location.href != "https://v2.horsereality.com/market") {
                window.open("https://v2.horsereality.com/market", "_self");
            }
            if (e.code === horseConfig["keybinds"]["bankPage"] && window.location.href != "https://v2.horsereality.com/bank") {
                window.open("https://v2.horsereality.com/bank", "_self");
            }
            if (e.code === horseConfig["keybinds"]["laboratoryPage"] && window.location.href != "https://v2.horsereality.com/laboratory") {
                window.open("https://v2.horsereality.com/laboratory", "_self");
            }
            if (e.code === horseConfig["keybinds"]["ridingSchoolPage"] && window.location.href != "https://v2.horsereality.com/ridingschool") {
                window.open("https://v2.horsereality.com/ridingschool", "_self");
            }
            if (e.code === horseConfig["keybinds"]["vetarinaryPage"] && window.location.href != "https://v2.horsereality.com/veterinary") {
                window.open("https://v2.horsereality.com/veterinary", "_self");
            }
            if (e.code === horseConfig["keybinds"]["currencyExchangePage"] && window.location.href != "https://www.horsereality.com/currency-exchange") {
                window.open("https://www.horsereality.com/currency-exchange", "_self");
            }
            if (e.code === horseConfig["keybinds"]["cityPage"] && window.location.href != "https://v2.horsereality.com/city") {
                window.open("https://v2.horsereality.com/city", "_self");
            }
            if (e.code === horseConfig["keybinds"]["wikiPage"] && window.location.href != "https://horsereality.wiki") {
                window.open("https://horsereality.wiki", "_self");
            }
            if (e.code === horseConfig["keybinds"]["profilePage"] && window.location.href != document.getElementsByClassName("user-nav")[0].getElementsByClassName("btn")[0].href) {
                document.getElementsByClassName("user-nav")[0].getElementsByClassName("btn")[0].click();
            }
            if (e.code === horseConfig["keybinds"]["trainHorse"] && horsePagePattern.test(window.location.href)) {
                console.log("train")
            }
            if (e.code === horseConfig["keybinds"]["careForHorse"] && horsePagePattern.test(window.location.href)) {
                console.log("care")
            }
            if (e.code === horseConfig["keybinds"]["tabSummary"] && horsePagePattern.test(window.location.href)) {
                document.getElementById("tab_summary").click();
            }
            if (e.code === horseConfig["keybinds"]["tabTraining"] && horsePagePattern.test(window.location.href)) {
                document.getElementById("tab_training").click();
            }
            if (e.code === horseConfig["keybinds"]["tabGenetics"] && horsePagePattern.test(window.location.href)) {
                document.getElementById("tab_genetics").click();
            }
            if (e.code === horseConfig["keybinds"]["tabAchievements"] && horsePagePattern.test(window.location.href)) {
                document.getElementById("tab_achievements").click();
            }
            if (e.code === horseConfig["keybinds"]["tabOffspring"] && horsePagePattern.test(window.location.href)) {
                document.getElementById("tab_offspring").click();
            }
            if (e.code === horseConfig["keybinds"]["tabHealth"] && horsePagePattern.test(window.location.href)) {
                document.getElementById("tab_health").click();
            }
            if (e.code === horseConfig["keybinds"]["tabUpdate"] && horsePagePattern.test(window.location.href)) {
                document.getElementById("tab_update").click();
            }
            if (e.code === horseConfig["keybinds"]["nextHorse"] && horsePagePattern.test(window.location.href)) {
                result = document.getElementsByClassName("horse_arrows")[0].getElementsByTagName("a");
                if (result.length == 1) {
                    arrowName = result[0].getElementsByTagName("img")[0].className;
                    if (arrowName == "right") {
                        result[0].click();
                    }
                }
                if (result.length == 2) {
                    result[1].click();
                }
            }
            if (e.code === horseConfig["keybinds"]["previousHorse"] && horsePagePattern.test(window.location.href)) {
                result = document.getElementsByClassName("horse_arrows")[0].getElementsByTagName("a");
                if (result.length == 1) {
                    arrowName = result[0].getElementsByTagName("img")[0].className;
                    if (arrowName == "left") {
                        result[0].click();
                    }
                }
                if (result.length == 2) {
                    result[0].click();
                }
            }
            if (e.code === horseConfig["keybinds"]["updateTagline"] && horsePagePattern.test(window.location.href)) {
                currentHorse = document.URL.split("/")[4].trim();
                chrome.storage.local.get(currentHorse, (result) => { console.log(result) });
            }
            if (e.code === horseConfig["keybinds"][""] && horsePagePattern.test(window.location.href)) {

            }

        })



    }


    let pattern = new RegExp("horsereality.com/");
    if (!pattern.test(document.URL)) {
        return;
    }
    callNeeded({})


})();