(() => {


    var currentHorseObj = {};
    var currentHorse;
    var currentTab;
    var horseConfig = {};
    var lastValue = 0;
    var failCount = 0;
    const monthInSeconds = 2629743;
    const observerConfig = { attributes: true, attributeFilter: ["style"] };


    const trainingLevelsToShorts = {
        //Basic
        "Handling": "Base1",
        "Basic Commands": "Base2",
        "Ground Training": "Base3",
        "Riding": "Base4",
        //Dressage 
        "Training Level": "TrL",
        "First Level": "FiL",
        "Second Level": "SeL",
        "Third Level": "ThL",
        "Fourth Level": "FoL",
        "Prix. St. George": "PSG",
        "Intermediate I": "INT1",
        "Intermediate II": "Int2",
        "Grand Prix": "GrP",
        //Driving 
        "Training Level": "TrL",
        "First Level": "FiL",
        "Second Level": "SeL",
        "Third Level": "ThL",
        "Fourth Level": "FoL",
        "CAI - B": "CAI-B",
        "CAI - A": "CAI-A",
        "Championships": "Champ",
        //Endurance
        "First Level": "FiL",
        "Second Level": "SeL",
        "Third Level": "ThL",
        "Fourth Level": "FoL",
        "CEI 1": "CEI1",
        "CEI 2": "CEI2",
        "CEI 3": "CEI3",
        "CEI 4": "CEI4",
        //Eventing 
        "Training Level": "TrL",
        "First Level": "FiL",
        "Second Level": "SeL",
        "Third Level": "ThL",
        "Fourth Level": "FoL",
        "CC 1": "CC1",
        "CC 2": "CC2",
        "CC 3": "CC3",
        "CC 4": "CC4",
        //Racing 
        "Routine 1": "R1",
        "Routine 2": "R2",
        "Routine 3": "R3",
        "Routine 4": "R4",
        "Routine 5": "R5",
        //Jumping 
        "Training Level": "TrL",
        "First Level": "FiL",
        "Second Level": "SeL",
        "Third Level": "ThL",
        "Fourth Level": "FoL",
        "IRC 1": "IRC1",
        "IRC 2": "IRC2",
        "IRC 3": "IRC3",
        "IRC 4": "IRC4",
        "Grand Prix": "GrP",
        //Reining
        "Training Level": "TrL",
        "First Level": "FiL",
        "Second Level": "SeL",
        "Third Level": "ThL",
        "Fourth Level": "FoL",
        "ISC 1": "ISC1",
        "ISC 2": "ISC2",
        "ISC 3": "ISC3",
        "ISC 4": "ISC4",
        "Grand Prix": "GrP",
    }

    const tabList = { "SUMMARY": "tab_summary2", "TRAINING": "tab_training2", "GENETICS": "tab_genetics2", "ACHIEVEMENTS": "tab_achievements2", "OFFSPRING": "tab_offspring2", "HEALTH": "tab_health2", "UPDATE": "tab_update2" };

    const printResult = (result) => {
        console.log(result);
    }

    const saveData = () => {
        chrome.storage.local.set({
            [currentHorse]: currentHorseObj
        });
    }

    const updateLast = () => {
        if (!currentHorseObj) {
            currentHorseObj = {};
        }
        let nowDate = Math.floor(Date.now() / 1000);
        currentHorseObj["lastUpdated"] = nowDate;
        saveData();
    }

    const getOveralData = () => {
        let tab = document.getElementsByClassName("horse_left")[0];
        currentHorseObj["name"] = tab.getElementsByTagName("h1")[0].textContent.trim();
        currentHorseObj["tagline"] = tab.getElementsByTagName("p")[0].textContent.trim();
        currentHorseObj["gender"] = tab.getElementsByTagName("h1")[0].getElementsByTagName("img")[0].getAttribute("alt").trim();
        let infotext = tab.getElementsByClassName("infotext")[0];
        currentHorseObj["lifeNumber"] = infotext.getElementsByClassName("right")[0].textContent.replace("#", "").trim();
        currentHorseObj["breed"] = infotext.getElementsByClassName("right")[1].textContent.trim();
        var age = 0;
        var ageTextParts = infotext.getElementsByClassName("right")[2].textContent.trim().split(",");

        for (const part of ageTextParts) {
            if (part.includes("year")) {
                age += part.split("year")[0].trim() * 12
            }
            if (part.includes("month")) {
                age += part.split("month")[0].trim() * 1
            }
        }
        currentHorseObj["age"] = age;
        currentHorseObj["birthDay"] = infotext.getElementsByClassName("right")[3].textContent.trim();
        currentHorseObj["horseHeight"] = infotext.getElementsByClassName("right")[4].textContent.trim();
        splitURL = document.URL.split("/")
        delete splitURL[5]
        link = ""
        for (let i = 0; i < 5; i++) {
            link += splitURL[i] + "/";
        }
        currentHorseObj["url"] = link
        saveData();
    }

    const getSummaryData = () => {
        if (!currentHorseObj["summary"]) {
            currentHorseObj["summary"] = {};
        }
        tab = document.getElementById(tabList["SUMMARY"])
        blockList = tab.getElementsByClassName("half_block")[1].getElementsByClassName("horse_blocks")
        for (let block of blockList) {
            imgText = block.getElementsByTagName("img")[0].getAttribute("alt")
            textDiv = block.getElementsByClassName("horse_blocktext")[0]
            if (!textDiv) {
                continue
            }
            if (imgText.trim() === "Breed this mare") {
                currentHorseObj["summary"]["pregnant"] = textDiv.textContent.trim()
            }
        }
        if (currentHorseObj["summary"]["pregnant"] === "" || !currentHorseObj["summary"]["pregnant"]) {
            currentHorseObj["summary"]["pregnant"] = "Can't or isn't breed"
        }
        saveData();
    }

    const getTrainingData = () => {
        if (!currentHorseObj["training"]) {
            currentHorseObj["training"] = {};
        }
        tab = document.getElementById(tabList["TRAINING"])
        currentHorseObj["training"]["currentTraining"] = tab.getElementsByClassName("training_right")[0].getElementsByClassName("top")[2].textContent.trim()
        levelList = tab.getElementsByClassName("training_right")[0].getElementsByClassName("block")[3].getElementsByClassName("barcon")
        for (let level of levelList) {
            currentHorseObj["training"]["currentTrainingLevel"] = level.getElementsByClassName("traintext")[0].textContent.trim()
            currentProgress = level.getElementsByClassName("trainbar")[0].textContent.trim().replace("%", "")
            if (currentProgress < 100) {
                break
            }
        }
        if (currentProgress == 100 && trainingLevelsToShorts[currentHorseObj["training"]["currentTrainingLevel"]] === "Base4") {
            currentHorseObj["training"]["currentTrainingLevel"] = "Base Complete";
        }
        finalLevelNames = ["GrP", "R5", "CC4", "CEI4", "Champ"]
        for (const name of finalLevelNames) {
            if (currentProgress == 100 && (trainingLevelsToShorts[currentHorseObj["training"]["currentTrainingLevel"]] === name)) {
                currentHorseObj["training"]["currentTrainingLevel"] = "Finish";
                break;
            }
        }

        saveData();
    }

    const getGeneticData = () => {
        if (!currentHorseObj["genetics"]) {
            currentHorseObj["genetics"] = {};
        }
        tab = document.getElementById(tabList["GENETICS"])
        genetics = tab.getElementsByClassName("genetics")[1]
        tableGP = tab.getElementsByClassName("genetic_table_row")[13]
        currentHorseObj["genetics"]["geneticPotential"] = genetics.getElementsByClassName("top")[0].getElementsByClassName("right")[0].textContent.split(" ")[2].trim()
        currentHorseObj["genetics"]["acceleration"] = tableGP.getElementsByClassName("left")[0].getElementsByClassName("genetic_stats")[0].textContent
        currentHorseObj["genetics"]["agility"] = tableGP.getElementsByClassName("left")[0].getElementsByClassName("genetic_stats")[1].textContent
        currentHorseObj["genetics"]["balance"] = tableGP.getElementsByClassName("left")[0].getElementsByClassName("genetic_stats")[2].textContent
        currentHorseObj["genetics"]["bascule"] = tableGP.getElementsByClassName("left")[0].getElementsByClassName("genetic_stats")[3].textContent
        currentHorseObj["genetics"]["pullingPower"] = tableGP.getElementsByClassName("left")[0].getElementsByClassName("genetic_stats")[4].textContent
        currentHorseObj["genetics"]["speed"] = tableGP.getElementsByClassName("right")[0].getElementsByClassName("genetic_stats")[0].textContent
        currentHorseObj["genetics"]["sprint"] = tableGP.getElementsByClassName("right")[0].getElementsByClassName("genetic_stats")[1].textContent
        currentHorseObj["genetics"]["stamina"] = tableGP.getElementsByClassName("right")[0].getElementsByClassName("genetic_stats")[2].textContent
        currentHorseObj["genetics"]["strength"] = tableGP.getElementsByClassName("right")[0].getElementsByClassName("genetic_stats")[3].textContent
        currentHorseObj["genetics"]["surefootedness"] = tableGP.getElementsByClassName("right")[0].getElementsByClassName("genetic_stats")[4].textContent
        currentHorseObj["genetics"]["advice"] = tab.getElementsByClassName("genetic_table_row")[14].textContent.trim().split("\n")[0]
        currentHorseObj["genetics"]["bestTraining"]
        wordListTemp = ["Dressage", "Jumping", "Reining", "Eventing", "Endurance", "Racing", "Driving"]
        text = currentHorseObj["genetics"]["advice"].split("I think that ")[1]
        words = text.trim().replaceAll(",", "").replaceAll(".", "").split(" ")
        for (let i = 0; i < words.length; i++) {
            if (wordListTemp.includes(words[i])) {
                currentHorseObj["genetics"]["bestTraining"] = words[i]
            }
        }
        saveData();
    }

    const getAchievementData = () => {
        if (!currentHorseObj["achievements"]) {
            currentHorseObj["achievements"] = {};
        }
        tab = document.getElementById(tabList["ACHIEVEMENTS"])
        table = tab.getElementsByClassName("genetic_table_row")[0]
        currentHorseObj["achievements"]["walk"] = table.getElementsByClassName("left")[0].getElementsByClassName("genetic_stats")[0].textContent
        currentHorseObj["achievements"]["trot"] = table.getElementsByClassName("left")[0].getElementsByClassName("genetic_stats")[1].textContent
        currentHorseObj["achievements"]["canter"] = table.getElementsByClassName("left")[0].getElementsByClassName("genetic_stats")[2].textContent
        currentHorseObj["achievements"]["gallop"] = table.getElementsByClassName("left")[0].getElementsByClassName("genetic_stats")[3].textContent
        currentHorseObj["achievements"]["posture"] = table.getElementsByClassName("right")[0].getElementsByClassName("genetic_stats")[0].textContent
        currentHorseObj["achievements"]["head"] = table.getElementsByClassName("right")[0].getElementsByClassName("genetic_stats")[1].textContent
        currentHorseObj["achievements"]["neck"] = table.getElementsByClassName("right")[0].getElementsByClassName("genetic_stats")[2].textContent
        currentHorseObj["achievements"]["back"] = table.getElementsByClassName("right")[0].getElementsByClassName("genetic_stats")[3].textContent
        currentHorseObj["achievements"]["shoulders"] = table.getElementsByClassName("right")[0].getElementsByClassName("genetic_stats")[4].textContent
        currentHorseObj["achievements"]["frontlegs"] = table.getElementsByClassName("right")[0].getElementsByClassName("genetic_stats")[5].textContent
        currentHorseObj["achievements"]["hindquarters"] = table.getElementsByClassName("right")[0].getElementsByClassName("genetic_stats")[6].textContent
        currentHorseObj["achievements"]["socks"] = table.getElementsByClassName("right")[0].getElementsByClassName("genetic_stats")[7].textContent
        saveData();
    }

    const getOffspringData = () => {
        if (!currentHorseObj["offsprings"]) {
            currentHorseObj["offsprings"] = {};
        }
        tab = document.getElementById(tabList["OFFSPRING"])
        currentHorseObj["offsprings"]["count"] = tab.getElementsByClassName("stable_block")[0].getElementsByClassName("row_960").length
        saveData();
    }

    const getHealthData = () => {
        if (!currentHorseObj["health"]) {
            currentHorseObj["health"] = {};
        }
        tab = document.getElementById(tabList["HEALTH"])

        textList = tab.getElementsByTagName("p")[0].innerHTML.split("<br>")
        try {
            currentHorseObj["health"]["fertility"] = textList[0].split("</strong>")[1].trim()
        } catch {
            currentHorseObj["health"]["fertility"] = "unknown"
        }

        currentHorseObj["health"]["colicResistance"] = textList[4].split("</strong>")[1].trim()
        currentHorseObj["health"]["hoofQuality"] = textList[5].split("</strong>")[1].trim()
        currentHorseObj["health"]["backProblems"] = textList[6].split("</strong>")[1].trim()
        currentHorseObj["health"]["respiratoryDisease"] = textList[7].split("</strong>")[1].trim()
        currentHorseObj["health"]["resistanceToLameness"] = textList[8].split("</strong>")[1].trim()
        saveData();
    }

    const getUpdateData = () => {
        if (!currentHorseObj["update"]) {
            currentHorseObj["update"] = {};
        }
        tab = document.getElementById(tabList["UPDATE"])
        saveData();
    }


    const runActiveTabGetter = (tab) => {
        getOveralData();
        switch (tab) {
            case tabList["SUMMARY"]:
                getSummaryData();
                break;
            case tabList["TRAINING"]:
                getTrainingData();
                break;
            case tabList["GENETICS"]:
                getGeneticData();
                break;
            case tabList["ACHIEVEMENTS"]:
                getAchievementData();
                break;
            case tabList["OFFSPRING"]:
                getOffspringData();
                break;
            case tabList["HEALTH"]:
                getHealthData();
                break;
            case tabList["UPDATE"]:
                getUpdateData();
                break;

            default:
                break;
        }
    }

    const getActivatedTab = (mutationList, observer) => {
        for (const mutation of mutationList) {
            lastValue += 1;
            setTimeout(() => {
                failCount += 1;
                if (failCount == lastValue && mutation.target.style.display === "block") {
                    currentTab = mutation.target.getAttribute("id");
                    runActiveTabGetter(currentTab);
                }
            }, 200)
        }

    }

    const observer = new MutationObserver(getActivatedTab);

    const getCurrentTab = () => {
        const targetList = document.getElementsByClassName('tabtext');
        for (const target of targetList) {
            observer.observe(target, observerConfig);
        }
        for (const target of targetList) {
            if (target.getElementsByClassName("table_con").length > 0) {
                currentTab = target.getAttribute("id");
                break;
            }
        }
        runActiveTabGetter(currentTab);
    }

    const removeOld = (result) => {
        newDict = {}
        for (let key of Object.keys(result)) {
            if (!result[key]["lastUpdated"]) {
                continue;
            }
            if ((result[key]["lastUpdated"] + monthInSeconds <= result[key]["lastUpdated"])) {
                chrome.storage.local.remove(key, () => {})
            }

        }
        chrome.storage.local.set(newDict);

    }




    const callNeeded = (result) => {
        currentHorseObj = result[currentHorse]
        removeOld(result)
        updateLast();
        getCurrentTab();
    }




    let pattern = new RegExp("horsereality.com/horses/\\d+/.*");
    if (!pattern.test(document.URL)) {
        return;
    }
    currentHorse = document.URL.split("/")[4].trim();

    chrome.storage.local.get(null, removeOld);
    chrome.storage.local.get(currentHorse, callNeeded);
})();