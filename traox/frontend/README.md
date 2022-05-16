# Frontend

The frontend application is a website located at [here](https://www.traox.dev/fish/).

You may view the source code this documentation is based on [here](source.js).

## Functions

There are many functions with varying purposes.

### `getCookie(cname)`

Retrieves the value of a cookie, given its `cname` (`name`).

### `delay(time)`

Delays the current thread by `time` milliseconds.

### `sendFish()`

Communicates data about your fish count to the server.

### `viewRareFish()`

Brings up the menu displaying your rare fish.

### `closeRareFish()`

Closes the menu displaying your rare fish.

### `buyUncle()`

Attempts to purchase an uncle by communication to the server.

### `getUncles()`

Retrieves and modifies the DOM to display the amount of uncles you have.

### `buyRareFish()`

Attempts to purchase a rare fish by communication to the server.

### `sellRareFish()`

Attempts to sell a rare fish by communication to the server.

### `getRareFishAmount()`

Retrieves and modifies the DOM to display the amount of rare fish you have.

### `getLeaderboardType()`

Returns the leaderboard type the user wants to view (`Fish`, `Rare Fish`, or `Uncles`).

### `updateLeaderboards()`

Updates the leaderboard based on the value returned by `getLeaderboardType()`.

### `updateRareFishCost()`

Updates the rare fish cost display.

### `getLeaderboards()`

Retireves and modifies the DOM to display the initial leaderboard data.

### `logout()`

Logs the user out by resetting their cookies.

### `checkIfLoggedIn()`

Checks if the user is currently logged in.

### `keepOnline()`

A periodic handshake with the server that keeps the user logged in with their credentials.

### `getFish()`

Retrieves and modifies the DOM to display the amount of fish you have.

### `checkIfCaptchaed()`

Verifies whether the user has been captchaed.

### `instantTooltips(textFrom, delta)`

Creates hoverable tooltips.

### `goFishing()`

The function resposible for sending a request in the server to update the amount of fish you have. For full documentation, see [here](goFishing.md).

## Module-Executed Code

Alongside functions lays code that is executed when the module is loaded.

### `rarefishinfo`

A `click` event listener is registered to `rarefishinfo` which just stops the event's propagation.

### `sendfishamount`

`oninput` is set to modify the value: `this.value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1')`.

`.replace(/[^0-9]/g, '')` replaces all non-numerical characters with empty space.

`.replace(/(\..*)\./g, '$1')` defines a capturing group and then matches a `.`, followed by matching any non-line terminator character, followed by matching the previous character zero to an infinite number of times. Outside of the capture group, a `.` is matched once more. This appears to accomplish nothing but removing a single trailing `.`.

### Initialization

When the page is first loaded, a five milisecond delay is waited out before:

- Checking if the user is logged in (`checkIfLoggedIn()`).
- The current amount of fish are retrieved (`getFish()`).
- The current amount of uncles are retrieved (`getUncles()`).
- The leaderboards are intiialized (`getLeaderboards()`).
- The current amount of rare fish are retrieved (`getRareFishAmount()`).
- An interval that repeats every two seconds is declared, which:
  - Checks if the user is logged in (`checkIfLoggedIn()`).
  - Updates the current amount of fish (`getFish()`).
  - Updates the current amount of uncles (`getUncles()`).
  - Keeps the user online (`keepOnline()`).
  - Updates the rare fish cost (`updateRareFishCost()`).
  - Updates the current amount of rare fish (`getRareFishAmount()`).
- An interval that repeats every one second is declared, which:
  - Updates the leaderboards (`updateLeaderboards()`).
  - Checks if the user has been Captcha'd (`checkIfCaptchaed()`).
- An interval that repeats every ten seconds is declared, which:
  - Reinitilized the leaderboards (`getLeaderboards()`).

### `g-captcha` / `form`

`g-captcha` has an event listener listening to `submit` registered. This listener removes the Captcha pop-up if the Captcha is completed successfully, and the data is sent to the server.

### `instantTooltips(textFrom, delta)`

`instantTooltips` is called as `instantTooltips(textFrom, delta)`.
