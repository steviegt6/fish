const nextFishCss = `
.infoSubHeader {
    margin-top: -20px;
    /* margin-bottom: -10px; */
    color: #959595;
    transition: color 0.5s ease-in-out;
}

.infoSubHeader:hover {
    color: white;
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

// Inserts new elements to the webpage to display information and control the autofisher.
injectCss(nextFishCss)
create('<p class="infoSubHeader" id="nextFish">Next uncle counter...</p>', 'createdTooltip', 1);

create('<p class="infoSubHeader" id="fishPerClick"><abbr title="May fluctuate if connection is inconsistent">Per click counter...</abbr></p>', 'createdTooltip', 0);
create('<p class="infoSubHeader" id="fishPerSecond">Per second counter...</p>', 'createdTooltip', 0);
create('<p>Autofish<input type="checkbox" id="autoFishBox" name="autoFishBox" value="true"></p>', 'createdTooltip', 0);




var i = 0;

var fishCount = 0;
var uncleCount = 0;
var unclePrice = 0;

// Automatically calls goFishing and checks if there are sufficient fish to buy an uncle.
function autoFish() 
{ 
    goFishing(); 
    i++;

    if (i > 100)
    {
        buyUncle();
        i -= 100;
    }

    document.getElementById("nextFish").innerHTML = (100 - i) + " clicks until next Uncle";
	
	// Retrieve number of fish
	const data1 = {
        "username": getCookie("username")
    };
    fetch('https://traoxfish.us-3.evennode.com/getfish', { method: 'POST', credentials: "same-origin", headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(data1),}).then(response => { return response.json(); }).then(json => {
			var oldFish = fishCount;
			
			fishCount = json.fish;
			
			var fishPerClick = fishCount - oldFish;
			
			document.getElementById("fishPerClick").innerHTML = fishPerClick + " fish per click";
    });
}

function fetchStats()
{
	
	
	
	const data2 = {
        "username": getCookie("username"),
        "loginkey": getCookie("loginkey")
    };
	
	// Retrieve number of uncles and assign to uncleCount.
    fetch('https://traoxfish.us-3.evennode.com/getuncles', { method: 'POST', credentials: "same-origin", headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(data2),}).then(response => { return response.json(); }).then(json => {
			uncleCount = json.uncles; 
			unclePrice = json.nextuncle;
	});

}

setInterval(autoFish, 500)

setInterval(fetchStats, 2000)
