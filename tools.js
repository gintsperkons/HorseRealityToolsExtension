(() => {
    var horsePagePattern = new RegExp("horsereality.com/horses/\\d+/.*");


    var horseConfig = {};
    const printResult = (result) => {
        console.log(result);
    }

    const saveData = () => {
        chrome.storage.local.set({
            [currentHorse]: currentHorseObj
        });
    }




    const callNeeded = (result) => {}




    callNeeded({})


})();