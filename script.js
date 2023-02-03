let main = document.querySelector('.main');
let wholeMat = document.querySelector('.whole-mat');
let currentMat = document.querySelector('.current-mat');
let mainWholeMaterials=[], wholeMaterials=[], currentMaterials=[], wholeFoods=[], currentFoods=[], currentFoodsHtmls=[];
let wholeMaterialsHtml='', currentMaterialsHtml='';
let receiveBox = document.querySelector('.receive-box');
let getButton = document.querySelector('.get');
let receiveClose = document.querySelector('.receive-box .top');
let randomButton = document.querySelector('.random');
let infoBlack = document.querySelector('.info-black');

let XHR = new XMLHttpRequest();
XHR.open('GET', 'informations/foods/materials.json', false);
XHR.onload = function() {
    if (this.status == 200) {
        let materials = JSON.parse(this.responseText);
        materials.fix.forEach(x=>{wholeMaterials.push(`${x}`);})
        materials.first.forEach(x=>{wholeMaterials.push(`${x}`);})
        materials.second.forEach(x=>{wholeMaterials.push(`${x}`);})
        materials.third.forEach(x=>{wholeMaterials.push(`${x}`);})
    }
}
XHR.send();

mainWholeMaterials = wholeMaterials;
wholeMaterials.forEach(element=>{wholeMaterialsHtml += `<div title="${element}" class="mat">${element}<a href="#" class="icon-up"></a></div>\n`});
currentMaterials.forEach(element=>{currentMaterialsHtml += `<div title="${element}" class="mat">${element}<a href="#" class="icon-up"></a></div>\n`});
wholeMat.innerHTML = wholeMaterialsHtml;
currentMat.innerHTML = currentMaterialsHtml;

document.querySelectorAll(".icon-up").forEach(element=>{element.textContent="+"});
document.querySelectorAll(".icon-down").forEach(element=>{element.textContent="×"});

setInterval(updateDatabase, 3000);

updateDatabase();
main.addEventListener('click', mainClick);
getButton.addEventListener('click', getClick);
randomButton.addEventListener('click', randomButtonClick)



function mainClick(e) {
    let target = e.target;
    if (target.className == "icon-down") {
        delete currentMaterials[currentMaterials.indexOf(target.parentNode.getAttribute('title'))];
        wholeMaterials.push(target.parentNode.getAttribute('title'));
        updateLists();
    }
    else if (target.className == "icon-up") {
        delete wholeMaterials[wholeMaterials.indexOf(target.parentNode.getAttribute('title'))];
        currentMaterials.push(target.parentNode.getAttribute('title'));
        updateLists();
    }
    let wholeMatColor = wholeMat.innerHTML.indexOf('class="mat"') == -1 ? "rgba(255, 255, 255, 0.3)":"rgba(255, 255, 255, 0.7)";
    wholeMat.style.backgroundColor = wholeMatColor;
}

function updateLists() {
    wholeMaterialsHtml = '';
    currentMaterialsHtml = '';
    wholeMaterials.forEach(element=>{wholeMaterialsHtml += `<div title="${element}" class="mat">${element}<a href="#" class="icon-up"></a></div>\n`});
    wholeMat.innerHTML = wholeMaterialsHtml;
    currentMaterials.forEach(element=>{currentMaterialsHtml += `<div title="${element}" class="mat">${element}<a href="#" class="icon-down"></a></div>\n`});
    currentMat.innerHTML = currentMaterialsHtml;
    document.querySelectorAll(".icon-up").forEach(element=>{element.textContent="+"});
    document.querySelectorAll(".icon-down").forEach(element=>{element.textContent="×"});
}

function updateDatabase() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'informations/foods/foods.json', false);
    xhr.onload = function() {
        if (this.status == 200) {
            wholeFoods = [];
            JSON.parse(this.responseText).foods.forEach(food=>{wholeFoods.push(food)})
        }
    }
    xhr.send();
}

function receiveClick(e) {
    let target = e.target;
    if (target.getAttribute('data-tab') == "" && target.getAttribute('data-select') != "") {
        document.querySelectorAll('[data-tab]').forEach(element=>{element.removeAttribute('data-select')})
        target.setAttribute('data-select', '');
        document.querySelector('.receive-box .content').innerHTML = currentFoodsHtmls[target.getAttribute('data-tabNum')];
    }
}

function getClick() {
    wholeFoods.forEach(element=>{if (isIn(element.fixMat, currentMaterials)) {currentFoods.push(element);}})
    let tabNumber = currentFoods.length;
    if (tabNumber == 0) {
        alert('size uygun yemek bulunamadı!');
        return false;
    }
    let tabsHtml = '';
    for(let i = 0; i < tabNumber; i++) {
        if (i == 0) {
            tabsHtml += `<div data-tabNum = "0" data-tab = "" data-select="" class="tab-1">food1</div>`;
            continue
        }
        tabsHtml += `<div data-tabNum = "${i}" data-tab = "" class="tab-${i+1}">food${i+1}</div>`;
    }
    let sayac = 0;
    currentFoods.forEach(element=>{
        sayac += 1;
        let contentHtml = ``
        contentHtml += `
        <div style="background-image: url(${element.photo});background-position: bottom;background-size: contain;" class="header">
            ${sayac==1?"Sana En Uygun Yemek: ":""}${element.name.charAt(0).toUpperCase() + element.name.slice(1).toLowerCase()}
        </div>
        <p class="on-yazi">
            ${element.receive.top}
        </p>
        <h4 class="materials-h4">🠗Malzemeler🠗</h4>
        `;
        let receiveMaterialsHtml = '';
        element.receive.materials.forEach(x=>{receiveMaterialsHtml += isOn(':', x)?`<li style="font-weight: bold;color: red">${x}</li>`:`<li>${x}</li>`})
        contentHtml += `
        <ul class="material-list">
            ${receiveMaterialsHtml}
        </ul>
        `;
        let stepsHtml = '';
        element.receive.steps.forEach(y=>{stepsHtml += `<p>${y}</p>`})
        let notesHtml = '';
        element.notes.forEach(z=>{notesHtml+=`<p>${z}</p>`})
        contentHtml += `
        <div class="steps">
            <h3>🠗Yapılışı🠗</h3>
            ${stepsHtml}
        </div>
        <div class="notes">
            <h3>Notes</h3>
            ${notesHtml}
        </div>
        `;
        currentFoodsHtmls.push(contentHtml);
    })
    
    let blackHtml = `
    <div class="receive-box">
        <div class="top">
            <div class="tabs">
                ${tabsHtml}
            </div>
            <div class="close"><a href="#" class="material-symbols-outlined">
                cancel
            </a></div>
        </div>
        <div class="content">
            ${currentFoodsHtmls[0]}
        </div>
    </div>
    `;
    
    document.querySelector('.black').innerHTML = blackHtml;
    receiveBox = document.querySelector('.receive-box');
    receiveClose = document.querySelector('.receive-box .top');
    document.querySelector('.black').style.visibility = 'visible';
    receiveBox.addEventListener('click', receiveClick);
    receiveClose.addEventListener('click', receiveCloseClick);

}

function isIn(arr1, arr2) {
    let esik = arr1.length;
    arr1.forEach(x=>{
        arr2.forEach(y=>{
            esik -= y==x?1:0;
        })
    })
    if (esik == 0) {
        return true
    }
    else 
    {
        return false
    }
}

function receiveCloseClick(e) {
    let target = e.target;
    if (target.className == 'material-symbols-outlined') {
        document.querySelector('.black').style.visibility = 'hidden';
        currentFoodsHtmls = [];
        currentFoods = [];
    }
}

function randomButtonClick() {
    let randNum = Math.round(Math.random() * wholeFoods.length-1);
    randNum = randNum<0?0:randNum>wholeFoods.length?wholeFoods.length-1:randNum;
    currentFoods = [wholeFoods[randNum]];
    currentFoods.forEach(element=>{
        let contentHtml = ``
        contentHtml += `
        <div style="background-image: url(${element.photo});background-position: bottom;background-size: contain;" class="header">
            Sana En Uygun Yemek: ${element.name.charAt(0).toUpperCase() + element.name.slice(1).toLowerCase()}
        </div>
        <p class="on-yazi">
            ${element.receive.top}
        </p>
        <h4 class="materials-h4">🠗Malzemeler🠗</h4>
        `;
        let receiveMaterialsHtml = '';
        element.receive.materials.forEach(x=>{receiveMaterialsHtml += isOn(':', x)?`<li style="font-weight: bold;color: red">${x}</li>`:`<li>${x}</li>`})
        contentHtml += `
        <ul class="material-list">
            ${receiveMaterialsHtml}
        </ul>
        `;
        let stepsHtml = '';
        element.receive.steps.forEach(y=>{stepsHtml += `<p>${y}</p>`})
        let notesHtml = '';
        element.notes.forEach(z=>{notesHtml+=`<p>${z}</p>`})
        contentHtml += `
        <div class="steps">
            <h3>🠗Yapılışı🠗</h3>
            ${stepsHtml}
        </div>
        <div class="notes">
            <h3>Notes</h3>
            ${notesHtml}
        </div>
        `;
        currentFoodsHtmls.push(contentHtml);
    })
    
    let blackHtml = `
    <div class="receive-box">
        <div class="top">
            <div class="tabs">
                <div data-tabNum = "0" data-tab = "" data-select="" class="tab-1">food1</div>
            </div>
            <div class="close"><a href="#" class="material-symbols-outlined">
                cancel
            </a></div>
        </div>
        <div class="content">
            ${currentFoodsHtmls[0]}
        </div>
    </div>
    `;
    
    document.querySelector('.black').innerHTML = blackHtml;
    receiveBox = document.querySelector('.receive-box');
    receiveClose = document.querySelector('.receive-box .top');
    document.querySelector('.black').style.visibility = 'visible';
    receiveBox.addEventListener('click', receiveClick);
    receiveClose.addEventListener('click', receiveCloseClick);

}

function isOn(str1, str2) {
    for(let i = 0; i < str2.length; i++) {
        if (str2.charAt(i) == str1) {
            return true
        }
    }
    return false
}

function getInfo() {
    infoBlack.style.visibility = 'visible';
}
