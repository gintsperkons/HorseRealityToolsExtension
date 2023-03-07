(() => {
    (() => {


        var currentHorseObj = {};
        var currentHorse;
        var horseConfig = {};

        const printResult = (result) => {
            console.log(result);
        }

        const saveData = () => {
            chrome.storage.local.set({
                ["horseConfig"]: horseConfig
            });
        }

        (function(console) {

            console.save = function(data, filename) {

                if (!data) {
                    console.error('Console.save: No data')
                    return;
                }

                if (!filename) filename = 'console.json'

                if (typeof data === "object") {
                    data = JSON.stringify(data, undefined, 4)
                }

                var blob = new Blob([data], { type: 'text/json' }),
                    e = document.createEvent('MouseEvents'),
                    a = document.createElement('a')

                a.download = filename
                a.href = window.URL.createObjectURL(blob)
                a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
                e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
                a.dispatchEvent(e)
            }
        })(console)


        const toCSV = (jsonData) => {
            result = "Name,Lifenumber,Breed,Birthday,Age,Horse height,Tagline,Url\n"
            for (const key of Object.keys(jsonData)) {
                result += jsonData[key]["name"] + ",";
                result += jsonData[key]["lifeNumber"] + ",";
                result += jsonData[key]["breed"] + ",";
                result += jsonData[key]["birthDay"] + ",";
                result += jsonData[key]["age"] + ",";
                result += jsonData[key]["horseHeight"] + ",";
                result += jsonData[key]["tagline"] + ",";
                result += jsonData[key]["url"];
                result += "\n"
            }
            return result;
        }

        const addTemplateLists = () => {
            if (!horseConfig["templates"]) {
                return;
            }

            for (const item of document.getElementsByClassName("templateList")) {
                console.log(horseConfig["templates"][item.getAttribute("name")])
                if (!horseConfig["templates"][item.getAttribute("name")]) {
                    continue;
                }
                for (key of Object.keys(horseConfig["templates"][item.getAttribute("name")])) {
                    el = document.createElement("option");
                    el.data = horseConfig["templates"][item.getAttribute("name")][key]
                    el.value = key;
                    el.textContent = key;
                    item.appendChild(el);
                }
            }
        }


        const setConfig = (result) => {
            if (!result) {
                horseConfig = {};
            } else if (!result["horseConfig"]) {
                horseConfig = {};
            } else {
                horseConfig = result["horseConfig"];
            }
            if (horseConfig["tools"]) {
                if (horseConfig["tools"]["autoCare"] != document.getElementById("autoCare").checked) {
                    document.getElementById("autoCare").click()
                }
                if (horseConfig["tools"]["autoTrain"] != document.getElementById("autoTrain").checked) {
                    document.getElementById("autoTrain").click()
                }
            }
            showCurrent();
            addTemplateLists();
            addListeners();
        }

        const showCurrent = () => {
            if (!horseConfig["selectedTab"]) {
                horseConfig["selectedTab"] = "keybinds"
            }
            for (const element of document.getElementsByClassName("tabTitle")) {
                if (element.getAttribute("tab-name") === horseConfig["selectedTab"]) {
                    element.style.color = "#1e69ff";
                }
            }
            for (const element of document.getElementsByClassName("tabContent")) {
                element.style.display = "none";
            }
            document.getElementById(horseConfig["selectedTab"]).style.display = "block"
            saveData();
        }

        const handleTitleEvents = (event) => {
            target = event.target;

            for (const element of document.getElementsByClassName("tabTitle")) {
                element.style.color = ""
            }
            horseConfig["selectedTab"] = target.getAttribute("tab-name");
            showCurrent();
        }

        const removeKeyBind = (bind) => {
            if ((!horseConfig["keybinds"]) || (!horseConfig["keybinds"][bind])) {
                return;
            }
            delete horseConfig["keybinds"][bind];
            saveData();
        }

        const setKeyBind = (bind, key) => {
            if (!horseConfig["keybinds"]) {
                horseConfig["keybinds"] = {}
            }
            horseConfig["keybinds"][bind] = key
            saveData();
        }

        const inputTextChange = (e) => {
            if (!horseConfig["templates"]) {
                horseConfig["templates"] = {}
            }
            if (!horseConfig["templates"][e.target.id]) {
                horseConfig["templates"][e.target.id] = {}
            }
            var count = 0;
            if (document.getElementById(e.target.id + "List").value == "addNew") {
                count = 1;

                while (true) {
                    if (!horseConfig["templates"][e.target.id][count]) {
                        if (!document.getElementById(e.target.id + "List").querySelector("option[value='" + count + "']")) {

                            console.log(count)
                            el = document.createElement("option");
                            el.value = count;
                            el.textContent = count;
                            document.getElementById(e.target.id + "List").appendChild(el);
                        }
                        document.getElementById(e.target.id + "List").value = count;
                        break;
                    }
                    count = 1 + (count * 1);
                }
            } else {
                count = document.getElementById(e.target.id + "List").value
            }
            console.log(count)
            horseConfig["templates"][e.target.id][count] = e.target.value
            saveData()
        }

        const selectElementChangeValue = (e) => {

            inputId = e.target.id.replace("List", "");
            el = document.getElementById(inputId);
            if (e.target.value == "addNew") {
                el.value = "";
                return
            }
            dataElement = document.querySelector("option[value='" + e.target.value + "']")
            el.value = dataElement.data;
            console.log(e);
            saveData()
        }

        const removeTemplate = (list, value) => {
            if (value == "addNew") {
                return
            }
            list = list.replace("List", "")
            if ((!horseConfig["templates"]) || (!horseConfig["templates"][list])) {
                return;
            }
            document.querySelector("option[value='" + value + "']").remove()
            delete horseConfig["templates"][list][value]
            saveData()
        }

        const setTrainingInfo = (e) => {
            if (!horseConfig["tools"]) {
                horseConfig["tools"] = {}
            }
            horseConfig["tools"][e.target.id.replace("List", "")] = e.target.value
            saveData()
        }

        const addListeners = () => {
            for (const element of document.getElementsByClassName("tabTitle")) {
                element.addEventListener("click", handleTitleEvents);
            }
            for (const but of document.getElementsByClassName("keySetButton")) {
                if (horseConfig["keybinds"] && horseConfig["keybinds"][but.getAttribute("bindName")] && but.getAttribute("bindName")) {
                    but.textContent = horseConfig["keybinds"][but.getAttribute("bindName")]
                }
                if (!but.textContent) {
                    but.textContent = "click to set key";
                }
                but.addEventListener("click", () => {
                    but.textContent = "push a key";
                    document.addEventListener("keyup", (event) => {
                        but.textContent = event.code;
                        setKeyBind(but.getAttribute("bindName"), event.code);
                    }, { once: true })
                })
            }
            for (const but of document.getElementsByClassName("keyRemoveButton")) {
                but.addEventListener("click", () => {
                    document.querySelector("button[bindName=" + but.getAttribute("bindName") + "].keySetButton").textContent = "click to set key";
                    removeKeyBind(but.getAttribute("bindName"));
                });
            }
            for (const but of document.getElementsByClassName("exportButton")) {
                but.addEventListener("click", () => {
                    fileType = but.getAttribute("exportConfig").split("-")[0];
                    fileContentType = but.getAttribute("exportConfig").split("-")[1];
                    if (fileContentType === "all" && fileType === "JSON") {
                        chrome.storage.local.get(currentHorse, (result) => {
                            data = result;
                            delete data["horseConfig"]
                            console.save(data, "horse-all.json");
                        });
                    }
                    if (fileContentType === "all" && fileType === "CSV") {
                        chrome.storage.local.get(currentHorse, (result) => {
                            data = result;
                            delete data["horseConfig"]
                            data = toCSV(data);
                            console.save(data, "horse-all.csv");
                        });
                    }
                })
            }
            for (const input of document.getElementsByClassName("templateInput")) {
                input.addEventListener("input", inputTextChange)
            }
            for (const templateList of document.getElementsByClassName("templateList")) {
                templateList.addEventListener("change", selectElementChangeValue)
            }
            for (const templateList of document.getElementsByClassName("toolTrainList")) {
                if (!horseConfig["tools"]) {} else if (!horseConfig["tools"][templateList.id.replace("List", "")]) {} else {
                    templateList.value = horseConfig["tools"][templateList.id.replace("List", "")]
                }
                templateList.addEventListener("change", setTrainingInfo)
            }
            for (const but of document.getElementsByClassName("removeTemplateButton")) {
                but.addEventListener("click", () => {
                    document.getElementById(but.getAttribute("templateName")).value = "";
                    el = document.getElementById(but.getAttribute("templateName") + "List")
                    removeTemplate(but.getAttribute("templateName") + "List", el.value);
                    el.value = "addNew";
                });
            }
        }

        const changeValue = () => {
            console.log(document.getElementById("trainCheckbox"));
        }

        const callNeeded = (result) => {
            chrome.storage.local.get("horseConfig", setConfig);
            for (const box of document.querySelectorAll("input[type=checkbox]")) {
                box.addEventListener("change", () => {
                    if (!horseConfig["tools"]) {
                        horseConfig["tools"] = {};
                    }
                    horseConfig["tools"][box.id] = box.checked;
                    saveData();
                })
            }


        }

        let pattern = new RegExp("horsereality.com/horses/stall/.+");
        if (pattern.test(document.URL)) {
            currentHorse = document.URL.split("/")[4].trim();
            chrome.storage.local.get(currentHorse, callNeeded);
        } else {
            callNeeded({});
        }


    })();
})();