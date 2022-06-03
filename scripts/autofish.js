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
create('<p class="hasTopContent hasBottomContent">Autoreload if captcha fails<input class="checkbox" type="checkbox" id="captchaReloadBox" name="captchaReloadBox"></p>', 'topnav', 0);


create('<div class="captchaMessage">If you haven\'t already, install <a href="https://www.tampermonkey.net/" style="font-size: inherit;">TamperMonkey</a> and <a href="https://greasyfork.org/en/scripts/376404-recaptcha-clicker" style="font-size: inherit;">this script</a> to automatically skip Captchas</div>', 'g-recaptcha', 0);

create('<p class="infoSubHeader hasBottomContent" id="rareFishROI">Rare Fish ROI...</p>', 'createdTooltip', 2);
create('<p class="infoSubHeader" id="rareFishPriceChange">Rare fish price change...</p>', 'createdTooltip', 2);
create('<p class="infoSubHeader" id="clicksPerRareFish">Clicks per rare fish...</p>', 'createdTooltip', 2);
create('<p class="infoSubHeader" id="nextFish2">Next uncle counter...</p>', 'createdTooltip', 2);
create('<p class="hasTopContent">Minimum Fish<input type="number" class="numberBox inlineInput" id="maxFishNumber2" name="maxFishNumber2"></p>', 'createdTooltip', 2);
create('<p class="hasTopContent hasBottomContent">AutoRareFish<input class="checkbox" type="checkbox" id="autoRareFishBox" name="autoRareFishBox"></p>', 'createdTooltip', 2);

create('<p class="infoSubHeader hasBottomContent" id="uncleROI">Uncle ROI...</p>', 'createdTooltip', 1);
create('<p class="infoSubHeader" id="clicksPerUncle">Clicks per uncle...</p>', 'createdTooltip', 1);
create('<p class="infoSubHeader" id="nextFish">Next uncle counter...</p>', 'createdTooltip', 1);
create('<p class="hasTopContent">Minimum Fish<input type="number" class="numberBox inlineInput" id="maxFishNumber" name="maxFishNumber"></p>', 'createdTooltip', 1);
create('<p class="hasTopContent hasBottomContent">AutoUncle<input class="checkbox" type="checkbox" id="autoUncleBox" name="autoUncleBox"></p>', 'createdTooltip', 1);

create('<p class="infoSubHeader hasBottomContent" id="fishPerClick">Per click counter...</p>', 'createdTooltip', 0);
create('<abbr title="Estimate based on statistics. May be inaccurate if any requests are dropped."><p class="infoSubHeader" id="fishPerSecond">Per second counter...</p></abbr>', 'createdTooltip', 0);
create('<p class="hasTopContent">Autofish<input class="checkbox" type="checkbox" id="autoFishBox" name="autoFishBox"></p>', 'createdTooltip', 0);

var historicFish = new Array();
var historicFishDelta = new Array();
var historicFishIndex = 0;

var fishCount = 0;
var uncleCount = 0;
var unclePrice = 0;

var initialRareFishPrice = 0;
fetch('https://traoxfish.us-3.evennode.com/getrarefishcost', { method: 'GET', credentials: "same-origin", headers: { 'Content-Type': 'application/json', },
	}).then(response => { return response.json(); }).then(json => {
        initialRareFishPrice = json.cost;
    });
var rareFishCount = 0;
var rareFishPrice = 0;

var fishPerClick = 0;

var captchaAttempts = 0;

// Automatically calls goFishing and checks if there are sufficient fish to buy an uncle.
function autoFish() 
{ 
	var maxFish = parseFloat(document.getElementById("maxFishNumber").value);
	var maxFish2 = parseFloat(document.getElementById("maxFishNumber2").value);
	// if (maxFish = NaN)
	// {
	// 	maxFish = 0;
	// }

	if (document.getElementById("autoFishBox").checked)
	{
		goFishing(); 
	}
	
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
	
	
	if (document.getElementById("autoRareFishBox").checked)
	{
		var clicksToNextRareFish = Math.floor((rareFishPrice - (fishCount - maxFish2)) / fishPerClick);
		
		if (clicksToNextRareFish > 0)
		{
			document.getElementById("nextFish2").innerHTML = clicksToNextRareFish + " clicks until next Rare Fish";
		}
		else
		{
			document.getElementById("nextFish2").innerHTML = "Buying rare fish...";
		}
	}
	else
	{
		document.getElementById("nextFish2").innerHTML = "AutoRareFish is off";
	}

	document.getElementById("clicksPerUncle").innerHTML = (unclePrice / fishPerClick) + " clicks required per Uncle";
	document.getElementById("clicksPerRareFish").innerHTML = (rareFishPrice / fishPerClick) + " clicks required per Rare Fish";
	
	// Retrieve number of fish
	const data = {
        "username": getCookie("username")
    };
    fetch('https://traoxfish.us-3.evennode.com/getfish', { method: 'POST', credentials: "same-origin", headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(data),}).then(response => { return response.json(); }).then(json => {
			fishCount = json.fish;
    });
	
	// Calculate ROI
	fishPerClick = getFishPerClick(uncleCount, rareFishCount);
	document.getElementById("fishPerClick").innerHTML = fishPerClick + " fish per click";
	
	var newUncleFishPerClick = getFishPerClick(uncleCount + 1, rareFishCount);
	var uncleROI = unclePrice / (newUncleFishPerClick - fishPerClick);
	document.getElementById("uncleROI").innerHTML = "Return on investment in " + uncleROI + " clicks";
	
	var newRareFishFishPerClick = getFishPerClick(uncleCount, rareFishCount + 1);
	var rareFishROI = rareFishPrice / (newRareFishFishPerClick - fishPerClick);
	document.getElementById("rareFishROI").innerHTML = "Return on investment in " + rareFishROI + " clicks";
}

setInterval(autoFish, 400)

function update()
{
	document.cookie = "captchaReloadBox=" + document.getElementById("captchaReloadBox").checked;
	document.cookie = "autoFishBox=" + document.getElementById("autoFishBox").checked;
	document.cookie = "autoUncleBox=" + document.getElementById("autoUncleBox").checked;
	document.cookie = "maxFishNumber=" + document.getElementById("maxFishNumber").value;
	document.cookie = "autoRareFishBox=" + document.getElementById("autoRareFishBox").checked;
	document.cookie = "maxFishNumber2=" + document.getElementById("maxFishNumber2").value;
	
	
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
	
	
	document.getElementById("rareFishPriceChange").innerHTML = "Rare fish price has changed by " + (rareFishPrice - initialRareFishPrice) + " since the start of the current session (from " + initialRareFishPrice + " to " + rareFishPrice + ")";
}

function getFishPerClick(uncles, rareFish)
{
	return  Math.floor((1 + uncles) * (1 + 0.001 * rareFish));
}

setInterval(update, 2000)

function autoBuy()
{
	var maxFish = parseFloat(document.getElementById("maxFishNumber").value);
	if (fishCount > maxFish + unclePrice && document.getElementById("autoUncleBox").checked)
    {
        buyUncle();
    }
	var maxFish2 = parseFloat(document.getElementById("maxFishNumber2").value);
	if (fishCount > maxFish2 + rareFishPrice && document.getElementById("autoRareFishBox").checked)
    {
        buyRareFish();
    }
}

setInterval(autoBuy, 1000); // Buy uncles at a slower rate to avoid buying excess uncles due to lag

function updateFishPerSecond()
{
	fishPerSecond = fishPerClick * (1 / 0.4);
	document.getElementById("fishPerSecond").innerHTML = fishPerSecond + " fish per second";
}

setInterval(updateFishPerSecond, 100)


 function trySolveCaptcha()
 {
 	fetch('https://traoxfish.us-3.evennode.com/checkcaptchaed', { method: 'POST', credentials: "same-origin", headers: { 'Content-Type': 'application/json', },
     }).then(response => { return response.json(); }).then(json => { if (json.status == "success") {
             if (json.captchaed) {
                 // document.getElementById("recaptcha-anchor").click()
 				document.getElementsByClassName("submitcaptcha")[0].click()
				captchaAttempts++;
				if (captchaAttempts > 15 && document.getElementById("captchaReloadBox").checked)
				{
					window.location.reload();
				}
             }
			 else
			 {
				 captchaAttempts = 0;
			 }
         }
     });
 	// document.getElementById("recaptcha-anchor").click()
 }
 
 setInterval(trySolveCaptcha, 1000)
 
document.getElementById("captchaReloadBox").checked = JSON.parse(getCookie("captchaReloadBox"));
document.getElementById("autoFishBox").checked = JSON.parse(getCookie("autoFishBox"));
document.getElementById("autoUncleBox").checked = JSON.parse(getCookie("autoUncleBox"));
document.getElementById("maxFishNumber").value = getCookie("maxFishNumber");
document.getElementById("autoRareFishBox").checked = JSON.parse(getCookie("autoRareFishBox"));
document.getElementById("maxFishNumber2").value = getCookie("maxFishNumber2");
