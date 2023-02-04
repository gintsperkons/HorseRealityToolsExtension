(() => {
    var horsePagePattern = new RegExp("horsereality.com/horses/\\d+/.*");


    var horseConfig = {};
    const printResult = (result) => {
        console.log(result);
    }

    const saveData = () => {
        chrome.storage.local.set({
            ["horseConfig"]: horseConfig
        });
    }

    const autoCare = () => {
        setTimeout(function() {
            tab = document.getElementById("tab_summary2").getElementsByClassName("table_con")[0]
            if (tab) {
                careList = tab.getElementsByClassName("half_block")[0].getElementsByClassName("horse_blocks");
                for (let i = 0; i < careList.length; i++) {
                    careList[i].click();
                }
            }
        }, 1500);
        setTimeout(function() {
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
        }, 3000);

    }



    const autoTrain = () => {
        setTimeout(function() {
            tab = document.getElementById("tab_training2").getElementsByClassName("table_con")[0]

            levelList = document.getElementsByClassName("grid_4 training_right")[0].getElementsByClassName("block")[3].getElementsByClassName("trainbar")
            lastVal = levelList[levelList.length - 1].getElementsByClassName("value")[0].textContent.replace("%", "").trim()


            if (tab) {
                terrainList = tab.getElementsByClassName("horsetraining")[0]
                timeList = tab.getElementsByClassName("horsetraining")[1]
                taskList = tab.getElementsByClassName("horsetraining")[2]
                energy = document.getElementById("energy").textContent.trim().split(" ")[1].replace("%", "").trim()

                terrainList = terrainList.getElementsByClassName("terrain-click")
                timeList = timeList.getElementsByClassName("duration-click")
                taskList = taskList.getElementsByClassName("traincon")

                if (!horseConfig["tools"]) {
                    return
                }
                tempTextList = ["toolTrainPrimaryTerrain", "toolTrainSecondaryTerrain", " toolTrainPrimaryTime", "toolTrainSecondaryTime"];
                for (const text of tempTextList) {
                    if (!horseConfig["tools"][text.trim()]) {
                        return
                    }
                }

                terrainTypePrimary = horseConfig["tools"]["toolTrainPrimaryTerrain"]
                terrainTypeSecondary = horseConfig["tools"]["toolTrainSecondaryTerrain"]
                durationTypePrimary = horseConfig["tools"]["toolTrainPrimaryTime"]
                durationTypeSecondary = horseConfig["tools"]["toolTrainSecondaryTime"]

                if (terrainTypePrimary != 3) {
                    terrainList[terrainTypePrimary].click()
                    timeList[durationTypePrimary].click()
                    itemFinal = "";
                    for (let i = 0; i < taskList.length; i++) {
                        elem = taskList[i];
                        val = taskList[i].getElementsByClassName("trainbar")[0].getElementsByClassName("value")[0].textContent.trim().replace("%", "");

                        if (val < 100) {
                            itemFinal = elem;
                            break
                        }
                        itemFinal = elem
                    }
                    itemFinalval = itemFinal.getElementsByClassName("trainbar")[0].getElementsByClassName("value")[0].textContent.trim().replace("%", "");
                    if (lastVal != 100 && itemFinalval == 100) {
                        return
                    }
                    if (itemFinalval < 100) {
                        itemFinal.getElementsByClassName("action-train")[0].click();
                        return
                    }

                }

                if (terrainTypePrimary == 3) {
                    terrainList[terrainTypePrimary].click()
                    itemFinal = "";
                    itemFinal = tab.getElementsByClassName("duration-click")[durationTypePrimary].getElementsByClassName("_train-round")[0]
                    itemFinal.click();
                    return
                }
                if (terrainTypeSecondary != 3) {
                    terrainList[terrainTypeSecondary].click()
                    timeList[durationTypeSecondary].click()
                    itemFinal = "";
                    for (let i = 0; i < taskList.length; i++) {
                        elem = taskList[i];
                        val = taskList[i].getElementsByClassName("trainbar")[0].getElementsByClassName("value")[0].textContent.trim().replace("%", "");

                        if (val < 100) {
                            itemFinal = elem;
                            break
                        }
                        itemFinal = elem
                    }
                    itemFinalval = itemFinal.getElementsByClassName("trainbar")[0].getElementsByClassName("value")[0].textContent.trim().replace("%", "");
                    if (itemFinalval <= 100) {
                        itemFinal.getElementsByClassName("action-train")[0].click();
                        return
                    }
                }

                if (terrainTypeSecondary == 3) {
                    terrainList[terrainTypeSecondary].click()
                    itemFinal = "";
                    itemFinal = tab.getElementsByClassName("duration-click")[durationTypeSecondary].getElementsByClassName("_train-round")[0]
                    itemFinal.click();
                }
            }
        }, 1500);
        setTimeout(function() {
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
        }, 3000);

    }

    const callNeeded = (result) => {
        if (!result["horseConfig"]) {
            horseConfig = {};
            return;
        } else {
            horseConfig = result["horseConfig"];
        }
        if (horseConfig["tools"]) {
            if (horseConfig["tools"]["autoCare"]) {
                autoCare()
            }
            if (horseConfig["tools"]["autoTrain"]) {
                autoTrain()
            }
        }
    }




    chrome.storage.local.get("horseConfig", callNeeded)


})();