/* Extracted fishing.js file from www.traox.dev
 * Unmodified, all rights reserved.
 * May 15 2022
 */

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function sendFish() {
    var fish = document.getElementById("sendfishamount").value;
    var reciever = document.getElementById("sendfishto").value;

    const data = {
        "username": getCookie("username"),
        "loginkey": getCookie("loginkey"),
        "fish": fish,
        "reciever": reciever
    };

    var validInfo = false;

    if (fish != undefined && reciever != undefined && fish > 0) {
        validInfo = true;
    } else {
        document.getElementById("sentstatus").textContent = "Couldn't send fish!";
        document.getElementById("sentstatus").style.color = "#ea7b7b";
        delay(2000).then(() => {
            document.getElementById("sentstatus").innerHTML = "<br>";
        });
    }

    if (validInfo) {
        fetch('https://traoxfish.us-3.evennode.com/sendfish', {
            method: 'POST',
            credentials: "same-origin",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(response => {
            return response.json();
        }).then(json => {
            if (json.status == "success") {
                document.getElementById("sentstatus").textContent = "Fish successfully sent!";
                document.getElementById("sentstatus").style.color = "#84ea84";
                document.getElementById("sendfishamount").value = "";
                document.getElementById("sendfishto").value = "";
                delay(2000).then(() => {
                    document.getElementById("sentstatus").innerHTML = "<br>";
                });
            } else {
                document.getElementById("sentstatus").textContent = json.error;
                document.getElementById("sentstatus").style.color = "#ea7b7b";
                delay(2000).then(() => {
                    document.getElementById("sentstatus").innerHTML = "<br>";
                })
            }
            getFish()
        });
    }

}

document.getElementById('rarefishinfo').addEventListener('click',function (event){
    event.stopPropagation();
 });

function viewRareFish() {
    document.getElementById("rarefishmenu").style.display = "initial";
}

function closeRareFish() {
    document.getElementById("rarefishmenu").style.display = "none";
}

function buyUncle() {
    const data = {
        "username": getCookie("username"),
        "loginkey": getCookie("loginkey")
    };
    fetch('https://traoxfish.us-3.evennode.com/buyuncle', {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => {
        return response.json();
    }).then(json => {
        if (json.status == "success") {
            document.getElementById("unclecount").textContent = "You have " + json.uncles.toLocaleString("en-US") + " uncles! Wow!"
            getFish();
        } else {
            document.getElementById("unclestatus").textContent = json.error;
            delay(2000).then(() => {
                document.getElementById("unclestatus").innerHTML = "<br>";
            });
        }
    });
}

function getUncles() {
    const data = {
        "username": getCookie("username"),
        "loginkey": getCookie("loginkey")
    };
    fetch('https://traoxfish.us-3.evennode.com/getuncles', {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => {
        return response.json();
    }).then(json => {
        if (json.uncles != undefined && json.uncles > 0) {
            document.getElementById("unclecount").textContent = "You have " + json.uncles.toLocaleString("en-US") + " uncles! Wow!";
            document.getElementById("unclebutton").textContent = "Buy Uncle for " + json.nextuncle.toLocaleString("en-US") + " fish!";
        } else {
            document.getElementById("unclecount").textContent = "You have no uncles! :("
        }
    });
}

document.getElementById("sendfishamount").oninput = function() {
    this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1');
}

function buyRareFish() {
    const data = {
        "username": getCookie("username"),
        "loginkey": getCookie("loginkey")
    };
    fetch('https://traoxfish.us-3.evennode.com/buyrarefish', {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => {
        return response.json();
    }).then(json => {
        if (json.status == "success") {
            document.getElementById("rarefishcount").textContent = "You have " + json.rarefish.toLocaleString("en-US") + " rare fish! Wow!"
            document.getElementById("rarefishcount2").textContent = "You have " + json.rarefish.toLocaleString("en-US") + " rare fish! Wow!"
            document.getElementById("rarefishstatus").textContent = "Rare fish bought!";
            document.getElementById("rarefishstatus").style.color = "#84ea84";
            delay(2000).then(() => {
                document.getElementById("rarefishstatus").innerHTML = "<br>";
            });
        } else {
            document.getElementById("rarefishstatus").textContent = json.error;
            document.getElementById("rarefishstatus").style.color = "#ea7b7b";
            delay(2000).then(() => {
                document.getElementById("rarefishstatus").innerHTML = "<br>";
            });
        }
    });
}

function sellRareFish() {
    const data = {
        "username": getCookie("username"),
        "loginkey": getCookie("loginkey")
    };
    fetch('https://traoxfish.us-3.evennode.com/sellrarefish', {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => {
        return response.json();
    }).then(json => {
        if (json.status == "success") {
            document.getElementById("fishcount").textContent = "You have " + json.fish.toLocaleString("en-US") + " fish! Wow!"
            document.getElementById("rarefishstatus").textContent = "Rare fish sold!";
            document.getElementById("rarefishstatus").style.color = "#84ea84";
            delay(2000).then(() => {
                document.getElementById("rarefishstatus").innerHTML = "<br>";
            });
            getRareFishAmount();
        } else {
            document.getElementById("rarefishstatus").textContent = json.error;
            document.getElementById("rarefishstatus").style.color = "#ea7b7b";
            delay(2000).then(() => {
                document.getElementById("rarefistatus").innerHTML = "<br>";
            });
        }
    });
}

function getRareFishAmount() {
    const data = {
        "username": getCookie("username"),
        "loginkey": getCookie("loginkey")
    };
    fetch('https://traoxfish.us-3.evennode.com/getrarefish', {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => {
        return response.json();
    }).then(json => {
        if (json.rarefish != undefined && json.rarefish != 0) {
            document.getElementById("rarefishcount").textContent = "You have " + json.rarefish.toLocaleString("en-US") + " rare fish! Wow!"
            document.getElementById("rarefishcount2").textContent = "You have " + json.rarefish.toLocaleString("en-US") + " rare fish! Wow!"
        } else {
            document.getElementById("rarefishcount").textContent = "You have no rare fish! :("
            document.getElementById("rarefishcount2").textContent = "You have no rare fish! :("
        }
    });
}

function getLeaderboardType() {
    return document.getElementById("leaderboardtype").value;
}

function updateLeaderboards() {

    var location = "";
    if (getLeaderboardType() == "fish") {
        location = 'https://traoxfish.us-3.evennode.com/leaderboards';
    } else if (getLeaderboardType() == "uncles") {
        location = 'https://traoxfish.us-3.evennode.com/leaderboards/uncles';
    } else {
        location = 'https://traoxfish.us-3.evennode.com/leaderboards/rarefish';
    }

    fetch(location, {
        method: 'GET',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'No-Store'
        },
    }).then(response => {

        return response.json();
    }).then(json => {
        var i = 0;
        var leaderboard = document.getElementById("leaderboard");
        for (var fisher in json) {
            try {
                leaderboard.children.item(i).textContent = json[fisher].substring(0, json[fisher].length - 1).split(" - ")[0] + " - " + Number(json[fisher].substring(0, json[fisher].length - 1).split(" - ")[1]).toLocaleString("en-US");
                if (json[fisher].substring(json[fisher].length - 1) == "y") {
                    leaderboard.children.item(i).style.color = "#84ea84";
                } else {
                    leaderboard.children.item(i).style.color = "#eeeeee";
                }
            } catch (e) {}
            i++
        }
    });
}

function updateRareFishCost() {
    fetch('https://traoxfish.us-3.evennode.com/getrarefishcost', {
        method: 'GET',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => {
        return response.json();
    }).then(json => {
        document.getElementById("rarefishcost").textContent = "Current rare fish cost: " + json.cost.toLocaleString("en-US") + " fish."
    });
}

function getLeaderboards() {
    
    var location = "";
    if (getLeaderboardType() == "fish") {
        location = 'https://traoxfish.us-3.evennode.com/leaderboards';
    } else if (getLeaderboardType() == "uncles") {
        location = 'https://traoxfish.us-3.evennode.com/leaderboards/uncles';
    } else {
        location = 'https://traoxfish.us-3.evennode.com/leaderboards/rarefish';
    }

    fetch(location, {
        method: 'GET',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'No-Store'
        },
    }).then(response => {
        var child = leaderboard.lastElementChild; 
        while (child) {
            leaderboard.removeChild(child);
            child = leaderboard.lastElementChild;
        }
        return response.json();
    }).then(json => {
        for (var fisher in json) {
            var leaderboard = document.getElementById("leaderboard");
            var item = document.createElement("li");
            try {
                item.textContent = json[fisher].substring(0, json[fisher].length - 1).split(" - ")[0] + " - " + Number(json[fisher].substring(0, json[fisher].length - 1).split(" - ")[1]).toLocaleString("en-US");
                if (json[fisher].substring(json[fisher].length - 1) == "y") {
                    item.style.color = "#84ea84";
                } else {
                    item.style.color = "#eeeeee";
                }
            } catch (e) {}
            username = item.textContent.split(" - ")[0];

            leaderboard.appendChild(item);
        }
    });
}

function logout() {
    document.cookie = "loginkey=";
    document.cookie = "username=";
}

function checkIfLoggedIn() {
    const data = {
        "username": getCookie("username"),
        "loginkey": getCookie("loginkey")
    };
    fetch('https://traoxfish.us-3.evennode.com/checkkey', {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => {
        return response.json();
    }).then(json => {
        if (json.status != "true") {
            window.location.replace("https://www.traox.dev/fish");
        }
    });

}

function keepOnline() {
    const data = {
        "username": getCookie("username"),
        "loginkey": getCookie("loginkey")
    };
    fetch('https://traoxfish.us-3.evennode.com/online', {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => {
        return response.json();
    }).then(json => {

    });
}

delay(5).then(() => {
    checkIfLoggedIn();
    getFish();
    getUncles();
    getLeaderboards();
    getRareFishAmount();

    setInterval(function(){ 
        checkIfLoggedIn();
        getFish();
        getUncles();
        keepOnline();
        updateRareFishCost();
        getRareFishAmount();
    }, 2000);

    setInterval(function(){ 
        updateLeaderboards();
        checkIfCaptchaed();
    }, 1000);

    setInterval(function(){ 
        getLeaderboards();
    }, 10000);
});

function getFish() {
    const data = {
        "username": getCookie("username")
    };
    fetch('https://traoxfish.us-3.evennode.com/getfish', {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => {
        return response.json();
    }).then(json => {
        if (json.fish != undefined) {
            document.getElementById("fishcount").textContent = "You have " + json.fish.toLocaleString("en-US") + " fish! Wow!"
        } else {
            document.getElementById("fishcount").textContent = "You have no fish! :("
        }
    });
}

const form  = document.getElementById('g-captcha');

form.addEventListener('submit', (event) => {
    const formData = new FormData(document.querySelector('form'))
    var cap = "";
    for (var pair of formData.entries()) {
        cap = (pair[1])
    }
    const data = {
        "g-recaptcha-response": cap
    };
    event.preventDefault();
    fetch('https://traoxfish.us-3.evennode.com/captcha', {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => {
        return response.json();
    }).then(json => {
        if (json.status == "success") {
            document.getElementById('captcha').style.display = "none";
            grecaptcha.reset()
            delete formData.entries()[0][1];
        }
    });
});

function checkIfCaptchaed() {
    fetch('https://traoxfish.us-3.evennode.com/checkcaptchaed', {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => {
        return response.json();
    }).then(json => {
        if (json.status == "success") {
            if (json.captchaed) {
                document.getElementById('captcha').style.display = "initial";
            }
        }
    });
}

function instantTooltips(textFrom, delta) {

    delta = parseFloat(delta) ? parseFloat(delta) : 5;

    function reposition(e) {

      var tooltip = this.nextSibling;

      tooltip.style.top = (e.pageY + delta - 24) + 'px';
      tooltip.style.left = (e.pageX + delta) + 'px';
    }

    var toTitle = document.querySelectorAll('[' + textFrom + ']'),

      span = document.createElement('span'),

      textProp = 'textContent' in document ? 'textContent' : 'innerText',

      parent, spanClone;

    span.classList.add('createdTooltip');

    [].forEach.call(toTitle, function(elem) {

      parent = elem.parentNode;

      spanClone = span.cloneNode();

      spanClone[textProp] = elem.getAttribute(textFrom);

      parent.insertBefore(spanClone, elem.nextSibling);

      elem.addEventListener('mousemove', reposition);

      elem.setAttribute(textFrom, '');
    });
  }



instantTooltips('title', 15);



function goFishing() {
    const data = {
        "username": getCookie("username"),
        "loginKey": getCookie("loginkey")
    };
    fetch('https://traoxfish.us-3.evennode.com/fish', {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => {
        return response.json();
    }).then(json => {
        if (json.status == "success") {
            document.getElementById("fishcount").textContent = "You have " + json.fish.toLocaleString("en-US") + " fish! Wow!"
        }
    });
}