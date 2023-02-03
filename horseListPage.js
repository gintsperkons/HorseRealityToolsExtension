(() => {


    var currentHorseObj = {};
    var currentHorse;

    const printResult = (result) => {
        console.log(result);
    }

    const saveData = () => {
        chrome.storage.local.set({
            [currentHorse]: currentHorseObj
        });
    }




    let pattern = new RegExp("horsereality.com/horses/stall/.+");
    if (!pattern.test(document.URL)) {
        return;
    }
    currentHorse = document.URL.split("/")[4].trim();

    chrome.storage.local.get(null, removeOld);
    chrome.storage.local.get(currentHorse, callNeeded);
})();