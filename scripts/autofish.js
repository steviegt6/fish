const newCss = `
.infoSubHeader {
    margin-top: -20px;
    color: #959595;
    transition: color 0.5s ease-in-out;
}

.infoSubHeader:hover {
    color: white;
}

.captchaMessage {
	margin-top: 50px;
	width: 450px;
	font-size: 100%;
    font-weight: 300;
    color: white;
    font-family: Arial;	
    background: black;
    padding: 5px;

}

.hasTopContent {
	margin-top: 0px;
}

.hasBottomContent {
	margin-bottom: 0px;
}

.checkbox {
	width: 22px;
	height: 22px;
}

.numberBox {
	width: 15em;
	height: 22px;
}

.inlineInput {
	margin-left: 8px;
}
`;

const tamperCss = `
.fishbutton,
.unclebutton,
.rarefishbutton {
		margin-top: -10px;
}

#fishcount,
#unclecount
/*#rarefishcount*/ {
	margin-bottom: 0px;
}
`;

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function injectCss(style) {
    var cascadingShitShow = document.createElement("style");
    cascadingShitShow.innerText = style;
    document.head.appendChild(cascadingShitShow);
}

function create(htmlStr, eclass, index) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    insertAfter(frag, document.getElementsByClassName(eclass)[index]);
}

// Inject new CSS for our styling.
injectCss(newCss)

// Modifies CSS from traox.dev to account for our new elements.
injectCss(tamperCss);

// Inserts new elements to the webpage to display information and control the autofisher.
create('<div class="captchaMessage">If you haven\'t already, install <a href="https://www.tampermonkey.net/" style="font-size: inherit;">TamperMonkey</a> and <a href="https://greasyfork.org/en/scripts/376404-recaptcha-clicker" style="font-size: inherit;">this script</a> to automatically skip Captchas</div>', 'g-recaptcha', 0);

create('<p class="infoSubHeader hasBottomContent" id="clicksPerUncle">Clicks per uncle...</p>', 'createdTooltip', 1);
create('<p class="infoSubHeader" id="nextFish">Next uncle counter...</p>', 'createdTooltip', 1);
create('<p class="hasTopContent">Minimum Fish<input type="number" class="numberBox inlineInput" id="maxFishNumber" name="maxFishNumber"></p>', 'createdTooltip', 1);
create('<p class="hasTopContent hasBottomContent">AutoUncle<input class="checkbox" type="checkbox" id="autoUncleBox" name="autoUncleBox"></p>', 'createdTooltip', 1);

create('<p class="infoSubHeader hasBottomContent" id="fishPerClick">Per click counter...</p>', 'createdTooltip', 0);
create('<p class="infoSubHeader" id="fishPerSecond">Per second counter...</p>', 'createdTooltip', 0);
create('<p class="hasTopContent">Autofish<input class="checkbox" type="checkbox" id="autoFishBox" name="autoFishBox"></p>', 'createdTooltip', 0);


document.getElementById("autoFishBox").checked = getCookie("autoFishBox");
document.getElementById("autoUncleBox").checked = getCookie("autoUncleBox");
document.getElementById("maxFishNumber").value = getCookie("maxFishNumber");


var fishCount = 0;
var uncleCount = 0;
var unclePrice = 0;

var rareFishCount = 0;
var rareFishPrice = 0;

var fishPerClick = 0;

// Automatically calls goFishing and checks if there are sufficient fish to buy an uncle.
function autoFish() 
{ 
	var maxFish = parseFloat(document.getElementById("maxFishNumber").value);

	if (!document.getElementById("autoFishBox").checked)
		return;
	
    goFishing(); 
    
	
	if (document.getElementById("autoUncleBox").checked)
	{
		var clicksToNextUncle = Math.floor((unclePrice - (fishCount - maxFish)) / fishPerClick);
		
		if (clicksToNextUncle > 0)
		{
			document.getElementById("nextFish").innerHTML = clicksToNextUncle + " clicks until next Uncle";
		}
		else
		{
			document.getElementById("nextFish").innerHTML = "Buying uncles...";
		}
	}
	else
	{
		document.getElementById("nextFish").innerHTML = "AutoUncle is off";
	}

	document.getElementById("clicksPerUncle").innerHTML = (unclePrice / fishPerClick) + " clicks required per Uncle";
	
	// Retrieve number of fish
	const data = {
        "username": getCookie("username")
    };
    fetch('https://traoxfish.us-3.evennode.com/getfish', { method: 'POST', credentials: "same-origin", headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(data),}).then(response => { return response.json(); }).then(json => {
			fishCount = json.fish;
    });
}

function update()
{
	document.cookie = "autoFishBox=" + document.getElementById("autoFishBox").checked;
	document.cookie = "autoUncleBox=" + document.getElementById("autoUncleBox").checked;
	document.cookie = "maxFishNumber=" + document.getElementById("maxFishNumber").value;
	
	
	const data = {
        "username": getCookie("username"),
        "loginkey": getCookie("loginkey")
    };
	
	// Retrieve number of uncles and assign to uncleCount.
    fetch('https://traoxfish.us-3.evennode.com/getuncles', { method: 'POST', credentials: "same-origin", headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(data),}).then(response => { return response.json(); }).then(json => {
			uncleCount = json.uncles; 
			unclePrice = json.nextuncle;
	});
	
    fetch('https://traoxfish.us-3.evennode.com/getrarefish', { method: 'POST', credentials: "same-origin", headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(data), }).then(response => { return response.json(); }).then(json => { 
			rareFishCount = json.rarefish;
    });
	
	fetch('https://traoxfish.us-3.evennode.com/getrarefishcost', { method: 'GET', credentials: "same-origin", headers: { 'Content-Type': 'application/json', },
	}).then(response => { return response.json(); }).then(json => {
        rareFishPrice = json.cost;
    });

	fishPerClick = Math.floor((1 + uncleCount) * (1 + 0.001 * rareFishCount));
	document.getElementById("fishPerClick").innerHTML = fishPerClick + " fish per click";
}

function autoUncle()
{
	var maxFish = parseFloat(document.getElementById("maxFishNumber").value);
	if (fishCount > maxFish + unclePrice)
    {
        buyUncle();
    }
}

setInterval(autoFish, 400)
setInterval(autoUncle, 1000); // Buy uncles at a slower rate to avoid buying excess uncles due to lag
setInterval(update, 2000)




 function trySolveCaptcha()
 {
 	fetch('https://traoxfish.us-3.evennode.com/checkcaptchaed', { method: 'POST', credentials: "same-origin", headers: { 'Content-Type': 'application/json', },
     }).then(response => { return response.json(); }).then(json => { if (json.status == "success") {
             if (json.captchaed) {
                 // document.getElementById("recaptcha-anchor").click()
 				document.getElementsByClassName("submitcaptcha")[0].click()
             }
         }
     });
 	// document.getElementById("recaptcha-anchor").click()
 }
 
 setInterval(trySolveCaptcha, 1000)
