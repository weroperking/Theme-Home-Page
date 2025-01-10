function customPrompt(message = "Insert the value", defaultValue = "") {
    return new Promise((resolve, reject) => {
        let result = null;  // Store the result here

        // Create a modal container
        const container = document.createElement("div");
        container.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

        // Add modal content
        container.innerHTML = `
            <div class=" bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md" >
                <h2 class="text-white text-lg mb-4">${message}</h2>
                <input 
                    id="styled-prompt-input" 
                    type="text" 
                    value="${defaultValue}"
                    class="w-full px-3 py-2 bg-gray-700 text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div class="flex justify-end space-x-4 mt-4">
                    <button 
                        id="cancel-btn" 
                        class="px-4 py-2 text-gray-300 bg-gray-700 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500">
                        Cancel
                    </button>
                    <button 
                        id="ok-btn" 
                        class="px-4 py-2 text-gray-300 bg-gray-700 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        OK
                    </button>
                </div>
            </div>
        `;

        // Add modal to the DOM
        document.body.appendChild(container);

        // Get input and buttons
        const input = container.querySelector("#styled-prompt-input");
        const okButton = container.querySelector("#ok-btn");
        const cancelButton = container.querySelector("#cancel-btn");

        // Add event listeners for buttons
        okButton.addEventListener("click", () => {
            result = input.value; // Store the input value
            document.body.removeChild(container);  // Close modal
            resolve(result);  // Resolve the Promise with the input value
        });
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                result = input.value; // Store the input value
                document.body.removeChild(container);  // Close modal
                resolve(result);  // Resolve the Promise with the input value
            }
        })

        cancelButton.addEventListener("click", () => {
            document.body.removeChild(container);  // Close modal
            reject('User cancelled the prompt');  // Reject the Promise
        });
        input.focus()
    });
}


// Add a custom alert 
function customAlert(message = "Insert the value") {
    return new Promise((resolve, reject) => {
        let result = null;  // Store the result here

        // Create a modal container
        const container = document.createElement("div");
        container.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

        // Add modal content
        container.innerHTML = `
            <div class="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 class="text-white text-lg mb-4">${message}</h2>
                <div class="flex justify-end space-x-4 mt-4">
                    <button 
                        id="ok-btn" 
                        class="px-4 py-2 text-gray-300 bg-gray-700 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        OK
                    </button>
                </div>
            </div>
        `;

        // Add modal to the DOM
        document.body.appendChild(container);

        // Get input and buttons
        const okButton = container.querySelector("#ok-btn");
        okButton.focus()

        // Add event listeners for buttons
        okButton.addEventListener("click", () => {
            document.body.removeChild(container);  // Close modal
            resolve("Hi");  // Resolve the Promise with the input value
        });

    });
}


document.addEventListener("DOMContentLoaded", function () {
    // Call getLocation to fetch weather data on page load
    getLocation();
    const shortcutsList = document.getElementById("shortcutsList");
    const storedShortcuts = JSON.parse(localStorage.getItem("shortcuts")) || [];
    const searchInput = document.getElementById("searchInput");
    const searchIcon = document.getElementById("searchIcon");
    const searchMenu = document.querySelector(".searchMenu");
    let selectedEngine = "google";

    function createShortcutElement(name, url) {
        const li = document.createElement("li");
        li.dataset.url = url;
        li.classList.add(
            "flex",
            "items-center",
            "space-x-3",
            "cursor-pointer",
            "relative"
        );
        li.innerHTML = `
                <img src="${getFavicon(url)}" alt="${name}" class="w-8 h-8 rounded-full">
                <span>${name}</span>
                <button class="settings-btn text-gray-400 hover:text-gray-200 absolute right-0">
                    <i class=" text-lg fas fa-ellipsis-v"></i>
                </button>
                <div class="settings-menu hidden absolute right-0 top-full bg-gray-800 border border-gray-700 rounded-md mt-2">
                    <button class="edit-btn w-full p-2 text-left text-gray-300 hover:bg-gray-700">Edit</button>
                    <button class="remove-btn w-full p-2 text-left text-gray-300 hover:bg-gray-700">Remove</button>
                </div> 
                `;
        li.addEventListener("click", function (event) {
            if (
                !event.target.closest(".settings-btn") &&
                !event.target.closest(".settings-menu")
            ) {
                window.location.href = url;
            }
        });
        return li;
    }

    function getFavicon(url) {
        try {
            const hostname = new URL(url);
            return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
        } catch (e) {
            console.error("Invalid URL for favicon:", url);
            return "images/default-favicon.png";
        }
    }

    storedShortcuts.forEach(shortcut => {
        const li = createShortcutElement(shortcut.name, shortcut.url);
        shortcutsList.appendChild(li);
    });

    document
        .getElementById("addShortcutBtn")
        .addEventListener("click", async function () {
            const name = await customPrompt("Enter the name of the shortcut(Example) :");
            let url = await customPrompt("Enter the URL of the shortcut(www.example.com):");
            if (name && url) {
                url = ensureValidURL(url);
                const li = createShortcutElement(name, url);
                shortcutsList.appendChild(li);

                storedShortcuts.push({
                    name,
                    url
                });
                localStorage.setItem("shortcuts", JSON.stringify(storedShortcuts));
            }
        });

    document.addEventListener("click", function (event) {
        const settingsMenus = document.querySelectorAll(".settings-menu");
        settingsMenus.forEach(menu => {
            if (
                !menu.contains(event.target) &&
                !menu.previousElementSibling.contains(event.target)
            ) {
                menu.classList.add("hidden");
            }
        });

        if (event.target.closest(".settings-btn")) {
            const menu = event.target.closest(".settings-btn").nextElementSibling;
            menu.classList.toggle("hidden");
        }
    });

    document.addEventListener("click", function (event) {
        if (event.target.closest(".remove-btn")) {
            const li = event.target.closest("li");
            const url = li.dataset.url;
            const index = storedShortcuts.findIndex(shortcut => shortcut.url === url);
            if (index !== -1) {
                storedShortcuts.splice(index, 1);
                localStorage.setItem("shortcuts", JSON.stringify(storedShortcuts));
                li.remove();
            }
        }
    });

    document.addEventListener("click", async function (event) {
        if (event.target.closest(".edit-btn")) {
            const li = event.target.closest("li");
            const url = li.dataset.url;
            const index = storedShortcuts.findIndex(shortcut => shortcut.url === url);
            if (index !== -1) {
                const newName = await customPrompt(
                    "Enter the new name of the shortcut:",
                    storedShortcuts[index].name
                );
                let newUrl = await customPrompt(
                    "Enter the new URL of the shortcut (e.g., google.com):",
                    storedShortcuts[index].url
                );
                if (newName && newUrl) {
                    newUrl = ensureValidURL(newUrl);
                    storedShortcuts[index].name = newName;
                    storedShortcuts[index].url = newUrl;
                    localStorage.setItem("shortcuts", JSON.stringify(storedShortcuts));
                    li.querySelector("span").textContent = newName;
                    li.querySelector("img").src = getFavicon(newUrl);
                    li.dataset.url = newUrl;
                }
            }
        }
    });

    if (searchIcon && searchMenu) {
        searchIcon.addEventListener("click", () => {
            searchMenu.classList.toggle("hidden");
        });

        searchMenu.addEventListener("click", (event) => {
            if (event.target.closest("button")) {
                const engine = event.target.closest("button").dataset.engine;
                selectedEngine = engine;
                searchIcon.className = event.target
                    .closest("button")
                    .querySelector("i").className;
                searchMenu.classList.add("hidden");
            }
        });
    }

    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            const query = searchInput.value;
            let searchUrl = "";
            switch (selectedEngine) {
                case "google":
                    searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
                        query
                    )}`;
                    break;
                case "bing":
                    searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(
                        query
                    )}`;
                    break;
                case "yahoo":
                    searchUrl = `https://search.yahoo.com/search?p=${encodeURIComponent(
                        query
                    )}`;
                    break;
                case "duckduckgo":
                    searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
                    break;
                case "yandex":
                    searchUrl = `https://yandex.com/search/?text=${encodeURIComponent(
                        query
                    )}`;
                    break;
                case "ask":
                    searchUrl = `https://www.ask.com/web?q=${encodeURIComponent(query)}`;
                    break;
            }
            // Navigate to the search URL in the same tab
            window.location.href = searchUrl;
        }
    });

    const autocompleteData = [
        "Google",
        "Bing",
        "Yahoo",
        "DuckDuckGo",
        "Baidu",
        "Yandex",
        "Ask"
    ];
    searchInput.addEventListener("input", function () {
        const value = searchInput.value.toLowerCase();
        const suggestions = autocompleteData.filter(item =>
            item.toLowerCase().includes(value)
        );
        const datalist = document.createElement("datalist");
        datalist.id = "autocomplete";
        suggestions.forEach(suggestion => {
            const option = document.createElement("option");
            option.value = suggestion;
            datalist.appendChild(option);
        });
        searchInput.setAttribute("list", "autocomplete");
        document.body.appendChild(datalist);
    });

    async function fetchWeather(latitude, longitude) {
        //weather info
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();

            // Update the UI with the fetched data
            document.getElementById("temperature").textContent = `${data.current.temperature_2m}°C`;
            document.getElementById("weatherDescription").textContent = `Wind Speed: ${data.current.wind_speed_10m} m/s`;
        } catch (error) {
            console.error("Error fetching weather data:", error);
            customAlert("Could not fetch weather data. Please try again later.");
        }
    }

    function getLocation() {
        // Check if the permission flag is set in localStorage
        const permissionGranted = localStorage.getItem("locationPermissionGranted");
        console.log("Permission granted:", permissionGranted);

        if (permissionGranted) {
            // If permission was previously granted, fetch the weather directly
            navigator.geolocation.getCurrentPosition(
                position => {
                    fetchWeather(position.coords.latitude, position.coords.longitude);
                },
                error => {
                    console.error("Error getting location:", error);
                    customAlert(
                        "Unable to retrieve your location. Please check your location settings."
                    );
                }
            );
        } else {
            // Request permission
            if (navigator.geolocation) {
                navigator.permissions
                    .query({
                        name: "geolocation"
                    })
                    .then(permissionStatus => {
                        console.log("Permission status:", permissionStatus.state);
                        if (permissionStatus.state === "granted") {
                            // If permission is granted, store the flag
                            localStorage.setItem("locationPermissionGranted", "true");
                            navigator.geolocation.getCurrentPosition(
                                position => {
                                    console.log("Location obtained:", position);
                                    fetchWeather(
                                        position.coords.latitude,
                                        position.coords.longitude
                                    );
                                },
                                error => {
                                    console.error("Error getting location:", error);
                                    customAlert(
                                        "Unable to retrieve your location. Please check your location settings."
                                    );
                                }
                            );
                        } else if (permissionStatus.state === "prompt") {
                            // If permission is prompted, request it
                            navigator.geolocation.getCurrentPosition(
                                position => {
                                    // Store the flag if permission is granted
                                    localStorage.setItem("locationPermissionGranted", "true");
                                    console.log("Location obtained:", position);
                                    fetchWeather(
                                        position.coords.latitude,
                                        position.coords.longitude
                                    );
                                },
                                error => {
                                    console.error("Error getting location:", error);
                                    customAlert(
                                        "Unable to retrieve your location. Please check your location settings."
                                    );
                                }
                            );
                        } else {
                            // Permission denied
                            customAlert(
                                "Geolocation permission denied. Please enable it in your browser settings."
                            );
                        }
                    });
            } else {
                customAlert("Geolocation is not supported by this browser.");
            }
        }
    }
});


const checkSpeedButton = document.getElementById("checkSpeedButton")
checkSpeedButton.addEventListener("click", CheckInternetSpeed)
function CheckInternetSpeed() {
    var imageLink =
        "https://upload.wikimedia.org/wikipedia/commons/3/3e/Tokyo_Sky_Tree_2012.JPG",
        downloadSize = 8185374,
        time_start,
        time_end,
        downloadSrc = new Image();
    document.querySelector(".loader-content").classList.add("hide");
    document.querySelector(".loader").classList.remove("hide");
    time_start = new Date().getTime();
    var cacheImg = "?nn=" + time_start;
    downloadSrc.src = imageLink + cacheImg;
    downloadSrc.onload = function () {
        time_end = new Date().getTime();
        var timeDuration = (time_end - time_start) / 1000;
        (loadedBytes = downloadSize * 8), (totalSpeed = (loadedBytes /
            timeDuration /
            1024 /
            1024).toFixed(2));
        let i = 0,
            speedOut;
        const animate = () => {
            if (i < totalSpeed) {
                document.querySelector(".content").innerHTML =
                    i.toFixed(2) + "<small>Mbps</small>";
                setTimeout(animate, 20);
                i += 1.02;
            } else {
                document.querySelector(".content").innerHTML =
                    totalSpeed + "<small>Mbps</small>";
            }
        };
        animate();

        document.querySelector(".content").innerHTML =
            totalSpeed + "<small>Mbps</small>";
        document.querySelector(".loader-content").classList.remove("hide");
        document.querySelector(".loader-content").classList.add("result");
        document.querySelector(".loader").classList.add("hide");
        document.querySelector(".content").classList.remove("hide");
        e.target.innerText = "CHECK AGAIN";
    };

};


// Settings button functionality
document.getElementById("settingsBtn").addEventListener("click", () => {
    SettingsPoopUp()
        .then((updatedSettings) => {
            ApplyChanges(updatedSettings);
        })
        .catch((error) => {
            console.error(error);
        });
});


// Declare settings as a global variable
let settings = JSON.parse(localStorage.getItem("settings")) || {};

// Load settings on page load



window.onload = () => {
    if (Object.keys(settings).length > 0) {
        ApplyChanges(settings);
    }
};

function SettingsPoopUp() {
    return new Promise((resolve, reject) => {
        // Create a modal container
        const container = document.createElement("div");
        container.className =
            "fixed inset-0 bg-opacity-50 flex items-center justify-center z-50";

        // Add modal content
        container.innerHTML = `
            <div class="modal-content" >
                <h2 class="text-white text-2xl mb-6">Primarily Colors</h2>
                
                ${createColorInput("Background", settings.background || "#111825")}
                ${createColorInput("Widgets", settings.widgets || "#202936")}

                <label class="text-gray-300">Font Family:</label>
                <select class="w-full mb-4 px-3 py-2 bg-gray-700 text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Josefin Sans" ${settings.fontFamily === "Josefin Sans" ? "selected" : ""}>Josefin Sans (default)</option>
                    <option value="Futura" ${settings.fontFamily === "Futura" ? "selected" : ""}>Futura</option>
                    <option value="Garamond" ${settings.fontFamily === "Garamond" ? "selected" : ""} >Garamond</option>
                    <option value="Verdana" ${settings.fontFamily === "Verdana" ? "selected" : ""} >Verdana</option>
                    <option value="Georgia" ${settings.fontFamily === "Georgia" ? "selected" : ""} >Georgia</option>
                    <option value="Calibri" ${settings.fontFamily === "Calibri" ? "selected" : ""} >Calibri</option>
                    <option value="Comic Sans MS" ${settings.fontFamily === "Comic Sans MS" ? "selected" : ""} >Comic Sans MS</option>
                    <option value="Impact" ${settings.fontFamily === "Impact" ? "selected" : ""} >Impact</option>
                    <option value="Tahoma" ${settings.fontFamily === "Tahoma" ? "selected" : ""} >Tahoma</option>
                    <option value="Palatino" ${settings.fontFamily === "Palatino" ? "selected" : ""} >Palatino</option>
                    <option value="Century Gothic" ${settings.fontFamily === "Century Gothic" ? "selected" : ""} >Century Gothic</option>
                    <option value="Baskerville" ${settings.fontFamily === "Baskerville" ? "selected" : ""} >Baskerville</option>
                    <option value="Franklin Gothic" ${settings.fontFamily === "Franklin Gothic" ? "selected" : ""} >Franklin Gothic</option>
                    <option value="Arial Narrow" ${settings.fontFamily === "Arial Narrow" ? "selected" : ""} >Arial Narrow</option>
                    <option value="Lucida Grande" ${settings.fontFamily === "Lucida Grande" ? "selected" : ""} >Lucida Grande</option>
                    <option value="Trebuchet MS" ${settings.fontFamily === "Trebuchet MS" ? "selected" : ""} >Trebuchet MS</option>
                    <option value="Avenir" ${settings.fontFamily === "Avenir" ? "selected" : ""} >Avenir</option>
                    <option value="Bodoni" ${settings.fontFamily === "Bodoni" ? "selected" : ""} >Bodoni</option>
                    <option value="Gill Sans" ${settings.fontFamily === "Gill Sans" ? "selected" : ""} >Gill Sans</option>
                    <option value="Optima" ${settings.fontFamily === "Optima" ? "selected" : ""} >Optima</option>
                    <option value="Rockwell" ${settings.fontFamily === "Rockwell" ? "selected" : ""} >Rockwell</option>
                    <option value="Source Sans Pro" ${settings.fontFamily === "Source Sans Pro" ? "selected" : ""} >Source Sans Pro</option>
                    <option value="Raleway" ${settings.fontFamily === "Montserrat" ? "selected" : ""} >Raleway</option>
                    <option value="Montserrat" ${settings.fontFamily === "Montserrat" ? "selected" : ""} >Montserrat</option>
                    <option value="Lato" ${settings.fontFamily === "Lato" ? "selected" : ""} >Lato</option>
                    <option value="PT Sans" ${settings.fontFamily === "PT Sans" ? "selected" : ""} >PT Sans</option>
                    <option value="Museo Sans" ${settings.fontFamily === "Museo Sans" ? "selected" : ""} >Museo Sans</option>
                </select>

                <h2 class="text-white text-2xl mt-6 mb-4">Portfolio</h2>
                <label class="text-gray-300">URL:</label>
                <input type="text" value="${settings.portfolioUrl || ""}" class="w-full mb-4 px-3 py-2 bg-gray-700 text-gray-300 rounded focus:outline-none focus:ring-0" />

                <label class="text-gray-300">Logo:</label>
                <input type="text" value="${settings.logoUrl || ""}" class="w-full mb-4 px-3 py-2 bg-gray-700 text-gray-300 rounded focus:outline-none focus:ring-0" />

                <h2 class="text-white text-2xl mt-6 mb-4">Clock</h2>
                <label class="text-gray-300">Change Format:</label>
                <div class="flex space-x-4 mb-4">
                    <label class="flex items-center">
                        <input type="radio" name="clockFormat" value="12" ${settings.clockFormat === "12" ? "checked" : ""
            } class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />&nbsp; &nbsp;  12 Hour
                    </label>
                    <label class="flex items-center">
                        <input type="radio" name="clockFormat" value="24" ${settings.clockFormat === "24" ? "checked" : ""
            } class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />&nbsp; &nbsp; 24 Hour
                    </label>
                </div>

                <h2 class="text-white text-2xl mt-6 mb-4">Weather</h2>
                <label class="text-gray-300">Weather Icon:</label>
                <input type="text" value="${settings.weatherIcon || ""}" class="w-full mb-4 px-3 py-2 bg-gray-700 text-gray-300 rounded focus:outline-none focus:ring-0" />

                <h2 class="text-white text-2xl mt-6 mb-4">Offline Style</h2>
                
                <label class="text-gray-300">
                    <input type="checkbox" id="offline-style" ${settings.offlineStyle ? "checked" : ""} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                    &nbsp; &nbsp; Use offline style</label>
                <div class="flex justify-end space-x-4 mt-6">
                    <button id="rest-btn" class="btn-ok">Rest</button>
                    <button id="cancel-btn" class="btn-cancel">Cancel</button>
                    <button id="ok-btn" class="btn-ok">OK</button>
                </div>
            </div>
        `;

        // Add modal to the DOM
        document.body.appendChild(container);

        // Get input and buttons
        const okButton = container.querySelector("#ok-btn");
        const cancelButton = container.querySelector("#cancel-btn");
        const restButton = container.querySelector("#rest-btn");

        // Add event listeners for buttons
        okButton.addEventListener("click", () => {
            const colorInputs = container.querySelectorAll("input[type='color']");
            settings = {
                background: colorInputs[0].value,
                widgets: colorInputs[1].value,
                fontFamily: container.querySelector("select").value,
                portfolioUrl: ensureValidURL(
                    container.querySelectorAll("input[type='text']")[0].value
                ),
                logoUrl: ensureValidURL(
                    container.querySelectorAll("input[type='text']")[1].value
                ),
                clockFormat: container.querySelector("input[name='clockFormat']:checked")
                    ?.value || "12",
                weatherIcon: ensureValidURL(
                    container.querySelectorAll("input[type='text']")[2].value
                ),
                offlineStyle: container.querySelector("#offline-style").checked,
            };

            // Save settings to localStorage
            localStorage.setItem("settings", JSON.stringify(settings));
            document.body.removeChild(container); // Close modal
            resolve(settings); // Resolve the Promise with the settings
        });

        cancelButton.addEventListener("click", () => {
            document.body.removeChild(container); // Close modal
            reject("User cancelled the prompt"); // Reject the Promise
        });
        restButton.addEventListener("click", () => {
            localStorage.removeItem("settings")
            window.location.reload()
            document.body.removeChild(container); // Close modal
            reject("User cancelled the prompt"); // Reject the Promise
        });

        // Focus on the first input
        container.querySelector("input[type='color']").focus();
    });
}


// Apply settings to the page
function ApplyChanges(adjustments) {
    // Apply background color
    document.querySelector("#bg-main").style.background = adjustments.background;

    // Update clock format
    updateClock(adjustments.clockFormat);

    // Apply font family
    document.body.style.fontFamily = adjustments.fontFamily;

    // Apply logo URL
    const logoElement = document.querySelector("#logoURL");
    if (logoElement) {
        if (adjustments.logoUrl === "https://") {
            logoElement.src = "./imgs/logo.png"
        } else {
            logoElement.src = adjustments.logoUrl;
        }
    }

    // Apply portfolio URL
    const portfolioElement = document.querySelector("a");
    if (portfolioElement) {
        if (adjustments.portfolioUrl === "https://") {
            portfolioElement.href = "https://weroperking.github.io/personal"
        } else {
            portfolioElement.href = adjustments.portfolioUrl;
        }

    }

    // Apply widgets color
    document.querySelectorAll("#widget").forEach((widget) => {
        widget.style.background = adjustments.widgets;
    });

    // Apply weather icon
    const weatherIconElement = document.querySelector("#WeatherIcon");
    if (weatherIconElement) {
        if (adjustments.weatherIcon === "https://") {
            weatherIconElement.src = "imgs/sunny_cloudy.png"
        } else {
            weatherIconElement.src = adjustments.weatherIcon;
        }
    }

    // Apply offline style
    const scriptElement = document.querySelector("script[src*='tailwindcss']");
    if (adjustments.offlineStyle) {
        scriptElement.src = "./tailwindcsscdn.js";
    } else {
        scriptElement.src = "https://cdn.tailwindcss.com";
    }
}


// Helper function: Create color input
function createColorInput(label, defaultValue) {
    return `
        <label class="text-gray-300">${label} Color:</label>
        <input type="color" value="${defaultValue}" class="w-full mb-4 px-3 py-2 bg-gray-700 text-gray-300 rounded focus:outline-none focus:ring-0" />
    `;
}


let currentFormat = "12"; // Default format is 12-hour
function updateClock(format = currentFormat) {
    currentFormat = format; // Update the format for future calls

    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const year = now.getFullYear();
    const month = now.toLocaleString("default", {
        month: "long"
    });

    if (format === "12") {
        const isPM = hours >= 12;
        hours = hours % 12 || 12; // Convert to 12-hour format
        hours = String(hours).padStart(2, "0");
        document.getElementById("time").textContent = `${hours}:${minutes}:${seconds} ${isPM ? "PM" : "AM"}`;
    } else if ("24") {
        hours = String(hours).padStart(2, "0");
        document.getElementById("time").textContent = `${hours}:${minutes}:${seconds}`;
    } else {
        customAlert("This is not a valid format");
    }

    document.getElementById("date").textContent = `${month} ${year}`;
}

// Set up the clock to update every second
setInterval(() => updateClock(), 1000);
function ensureValidURL(url) {
    if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
    }
    return url;
}

const style = document.createElement('style');
style.innerHTML = `
    .modal-content {
        background-color: #262626;
        padding: 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        width: 100%;
        max-width: 1306px;
        height: 708px;
        overflow-y: auto;
    }
    input[type='text'], input[type='color'] {
        border: none;
    }
    input[type='text']:focus, input[type='color']:focus {
        border-color: #0649db;
        outline: none;
    }
    .default-color {
        display: inline-block;
        width: 32px;
        height: 32px;
        border: 1px solid #ccc;
        margin-left: 8px;
    }
    .btn-cancel, .btn-ok {
        padding: 0.5rem 1rem;
        color: #D1D5DB; 
        background-color: #374151; 
        border-radius: 0.375rem;
        transition: background-color 0.3s;
    }
    .btn-cancel:hover {
        background-color: #4B5563; 
    }
    .btn-ok:hover {
        background-color: #3B82F6; 
    }
`;
document.head.appendChild(style)

// To-Do List
const todoList = document.getElementById("todoList");
const newTaskInput = document.getElementById("newTaskInput");
const addTaskButton = document.getElementById("addTaskButton");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
    todoList.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.classList.add("flex", "items-center", "justify-between", "text-sm");
        li.innerHTML = `
            <span>${task}</span>
            <div>
                <button class="text-blue-500 hover:text-blue-700 edit-task" data-index="${index}">
                    <i class=" text-lg fas fa-edit"></i>
                </button>
                <button class="text-red-500 hover:text-red-700 remove-task" data-index="${index}">
                    <i class=" text-lg fas fa-trash"></i>
                </button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

renderTasks();

newTaskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            tasks.push(taskText);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            newTaskInput.value = "";
            renderTasks();
        }
    }
});

addTaskButton.addEventListener("click", () => {
    const taskText = newTaskInput.value.trim();
    if (taskText) {
        tasks.push(taskText);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        newTaskInput.value = "";
        renderTasks();
    }
});

todoList.addEventListener("click", async (event) => {
    if (event.target.closest(".remove-task")) {
        const index = event.target.closest(".remove-task").dataset.index;
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }

    if (event.target.closest(".edit-task")) {
        const index = event.target.closest(".edit-task").dataset.index;
        const newTaskText = await customPrompt("Edit your task:", tasks[index]);
        if (newTaskText !== null && newTaskText.trim() !== "") {
            tasks[index] = newTaskText.trim();
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
        }
    }
});
// Notes functionality

// Load saved notes from local storage on page load
const notes = document.getElementById("notes");
const saveNotesButton = document.getElementById("saveNotesButton");

// Load notes from local storage
notes.value = window.localStorage.getItem("notes") || "";
// Load notes or set to empty string if none exist

// Event listener for the save button
notes.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.shiftKey === true) {
        const notesContent = notes.value;
        // Get the current value of the notes textarea
        window.localStorage.setItem("notes", notesContent);
        // Save notes to local storage
        customAlert("Notes saved ");
        // Notify the user that notes have been saved
    }
})
saveNotesButton.addEventListener("click", () => {
    const notesContent = notes.value;
    // Get the current value of the notes textarea
    window.localStorage.setItem("notes", notesContent);
    // Save notes to local storage
    customAlert("Notes saved ");
    // Notify the user that notes have been saved
});