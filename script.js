//! TODO: each chooser should green up when completed
//! TODO: hide the svg while not generated
//! TODO: add the background image after the svg is generated
let selectedItem = null;

function search() {
    const searchTerm = document.getElementById('searchTerm').value;
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=software&entity=software&limit=10`;
    

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('search-results');
            searchResults.innerHTML = '';

            data.results.forEach(item => {
                //  <li>
                //      <div class="itemDiv">
                //          <a>item.trackName</a>
                //          <img src="item.artworkUrl100" alt="item.trackName">
                //      </div>
                
                const li = document.createElement('li');
                const itemDiv = document.createElement('div');
                itemDiv.className = 'itemDiv';
                
                const a = document.createElement('a');
                a.textContent = item.trackName;
                
                const img = document.createElement('img');
                img.src = item.artworkUrl512;

                // Add click event to select the item
                itemDiv.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent the link from navigating immediately
                    selectedItem = item; // Save the selected item
                    console.log('Selected item:', selectedItem);
                    // Clear the seach searchResults and search term
                    searchResults.innerHTML = '';
                    document.getElementById('searchTerm').value = '';
                    select(); // Call select() to display the selected item
                });
                
                itemDiv.appendChild(img);
                itemDiv.appendChild(a);
                li.appendChild(itemDiv);
                searchResults.appendChild(li);
            });
        })
        .catch(error => console.error('Error:', error));
}
//! selectedItem is a global variable that stores the selected item. 
//! selectedApp is the container (div) where the selected item is displayed.

function select() {
    const searchContainer = document.getElementById('search-container');
    const selectedApp = document.getElementById('selected-app');
    const searchResults = document.getElementById('search-results');
    const appStatus = document.getElementById('app-status'); // New status element

    // Check if the elements exist
    if (!searchContainer || !selectedApp || !searchResults || !appStatus) {
        console.error('Required elements are missing in the DOM.');
        return;
    }

    if (selectedItem) {
        let chooserDiv = searchContainer.closest('.chooser'); // Get the parent chooser div
        chooserDiv.classList.add('done');
        console.log('Selected item:', selectedItem);
        // Clear the search-container
        searchContainer.innerHTML = '';
        searchResults.innerHTML = ''; // Clear searchResults
        // Display the selected-app with a remove button
        selectedApp.innerHTML = `
            <img src="${selectedItem.artworkUrl512}" alt="${selectedItem.trackName}">
            <h2>${selectedItem.trackName}</h2>
            <button id="removeButton" style="background: none; border: none; font-size: 30px; cursor: pointer;">&times;</button>
        `;
        appStatus.textContent = `Selected app: ${selectedItem.trackName}`; // Update status
        appStatus.style.color = 'green'; // Set status color to green

        // Add event listener to the remove button
        const removeButton = document.getElementById('removeButton');
        if (removeButton) {
            removeButton.addEventListener('click', () => {
                selectedItem = null; // Clear the selected item
                let chooserDiv = searchContainer.closest('.chooser'); // Get the parent chooser div
                chooserDiv.classList.remove('done');
                select(); // Call select() to reset the UI
            });
        } else {
            console.error('Remove button not found in the DOM.');
        }
    } else {
        console.log('No item selected');
        // Add the input field to the search-container
        searchContainer.innerHTML = `
            <input type="text" id="searchTerm" placeholder="Enter app name">
            <button onclick="search()">Search</button>
        `;
        // Clear the selected-app and searchResults
        selectedApp.innerHTML = '';
        searchResults.innerHTML = '';
        appStatus.textContent = 'No app selected'; // Reset status
        appStatus.style.color = 'red'; // Set status color to red
    }
}

select(); // Call select() to initialize the UI

// Select the textarea element
const notificationText = document.getElementById('notification-text');

// Add an event listener to detect changes in the textarea
notificationText.addEventListener('input', () => {
    let chooserDiv = notificationText.closest('.chooser'); // Get the parent chooser div
    if (notificationText.value.trim() !== '') {
        // Add the 'done' class to the parent chooser div if there is a value
        chooserDiv.classList.add('done');
    } else {
        // Remove the 'done' class if the value is empty
        chooserDiv.classList.remove('done');
    }
});


function show_tab(tabId, hideId) {
    // Remove active class from the tab specified by hideId
    if (hideId) {
        const hideElement = document.getElementById(hideId);
        if (hideElement) {
            hideElement.classList.remove('active');
        }
    }

    // Show the selected tab content
    const tabElement = document.getElementById(tabId);
    if (tabElement) {
        tabElement.classList.add('active');
    }

    // Remove active class from all tab buttons
    const deactivateButton = document.querySelector(`.tab-button[onclick="show_tab('${hideId}', '${tabId}')"]`);
    if (deactivateButton) {
        deactivateButton.classList.remove('active');
    }

    // Activate the corresponding button for the selected tab
    const activeButton = document.querySelector(`.tab-button[onclick="show_tab('${tabId}', '${hideId}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Manage input image
const inputImage = document.getElementById('input-image');
const imagePreview = document.getElementById('image-preview');

inputImage.onchange = evt => {
    const [file] = inputImage.files;
    if (file) {
        imagePreview.src = URL.createObjectURL(file);

        // Update the SVG background image
        const svgBackgroundImage = document.getElementById('svg image');
        console.log("SVG Background Image:", svgBackgroundImage);
        if (svgBackgroundImage) {
            const img = document.createElement('image-preview');

            svgBackgroundImage.setAttribute('href', URL.createObjectURL(img.src));
            console.log("Setting href:", URL.createObjectURL(img.src));
        } else {
            console.error('SVG background image element not found.');
        }
        // Force a redraw
        const parent = svgBackgroundImage.parentNode;
        parent.removeChild(svgBackgroundImage);
        parent.appendChild(svgBackgroundImage);
    }
};

let imageWidth = 0;
let imageHeight = 0;
const svgNotification = document.getElementById('svg-notification');

function update_svg_background(imagePath, imageWidth, imageHeight) {
    svgNotification.setAttribute('viewBox', '0 0 '+ imageWidth + ' '+ imageHeight);
    const svgBackgroundImage = document.getElementById('background-image');
    console.log("SVG Background Image:", svgBackgroundImage);
    if (notificationBackgroundImage) {
        notificationBackgroundImage.setAttribute('href', imagePath);
        notificationBackgroundImage.setAttribute('width', imageWidth);
        notificationBackgroundImage.setAttribute('height', imageHeight);
        console.log("Setting href:", imagePath);
    } else {
        console.error('SVG background image element not found.');
    }
}
// Dynamically load images from the ./images/ directory into the gallery
function load_gallery_images() {
    const gallery = document.getElementById('image-gallery');
    const images = [
        './images/IMG_6363.PNG',
        './images/IMG_6364.PNG'   
    ]; 

    images.forEach(imagePath => {
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = 'Gallery Image';
        img.addEventListener('click', () => {
            console.log(`Selected image: ${imagePath}`);
            imagePreview.src = imagePath;
            let chooserDiv = imagePreview.closest('.chooser'); // Get the parent chooser div
            chooserDiv.classList.add('done');
            // Create a new Image object to load the selected image
            const img = new Image();
            img.src = imagePath;
            
            // Once the image is loaded, save its width and height
            img.onload = () => {
                imageWidth = img.width;
                imageHeight = img.height;
                update_svg_background(imagePath, imageWidth, imageHeight); // Update the SVG background image
                console.log(`Image dimensions: ${imageWidth}x${imageHeight}`);
                // You can store these dimensions in a variable or use them as needed
};
        });
        gallery.appendChild(img);
    });
}

// Call this function when the page loads to populate the gallery
load_gallery_images();

// Customize the svg
const svgNotificationTitle = document.getElementById('svg-notification-title');
const svgNotificationTimeText = document.getElementById('svg-notification-time-text');
const svgNotificationTimeNow = document.getElementById('svg-notification-time-now'); 
const svgNotificationDescription = document.getElementById('svg-notification-description');
const svgNotificationDescriptionSec = document.getElementById('svg-notification-description-sec');
const svgNotificationIcon = document.getElementById('svg-notification-icon');

const notification_text = document.getElementById('notification-text');

const notificationGroup = document.getElementById('notification-group');
const notificationBackgroundImage = document.getElementById('background-image');

const svgNotificationBackgroundBar = document.getElementById('Background');

const roundedCornersRect = document.querySelector('#rounded-corners rect');

function update_notification() {
    let secondLineNeeded = false;
    // Get the text from the textarea
    secondLineNeeded = update_notification_text(selectedItem.trackName, notification_text.value);
    
    // Make the notification taller if a second line is needed
    if (secondLineNeeded) {
        svgNotificationBackgroundBar.setAttribute("height", "215");
        svgNotificationIcon.setAttribute("y", "54");
        roundedCornersRect.setAttribute('y', '54');
        console.log("Second line needed, increasing height");
    } else {
        svgNotificationBackgroundBar.setAttribute("height", "185");
        svgNotificationIcon.setAttribute("y", "39");
        roundedCornersRect.setAttribute('y', '39');
    }
    // Update the image
    let artworkUrl = selectedItem.artworkUrl512 || selectedItem.artworkUrl100 || './images/placeholder.png';
    update_notification_icon(artworkUrl);
    
    // Update the notification time
    const timeNowTab = document.getElementById('now-time-tab');
    const timeCustomInput = document.getElementById('custom-time');
    update_notification_time(timeNowTab.classList.contains('active'), timeCustomInput.value);

    //get background image width and height
    let backgroundImageWidth = notificationBackgroundImage.getAttribute('width');
    let backgroundImageHeight = notificationBackgroundImage.getAttribute('height');

    update_notification_transform(backgroundImageWidth, backgroundImageHeight);
}

function update_notification_text(title, description="") {
    // returns true if second line is needed

    svgNotificationTitle.textContent = title;
    
    if (description) {
        return update_notification_description(description);
    }
    
    return false; 
}

function update_notification_description(description) {
    // Clear all children from the description element
    while (svgNotificationDescription.firstChild) {
        svgNotificationDescription.removeChild(svgNotificationDescription.firstChild);
    }
    
    const maxWidth = 800; 
    let [firstLineText, secondLineText] = split_text(description, maxWidth);

    // Set the first line as the text content of the <text> element
    svgNotificationDescription.textContent = firstLineText;
    
    // Create the second line <tspan> if there is remaining text
    if (secondLineText) {
        const secondLineTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        secondLineTspan.setAttribute('x', '173'); // Align with the first line
        secondLineTspan.setAttribute('y', '179'); // Adjust the y-coordinate for the second line

        // Measure the width of the second line and truncate if necessary
        const tempSecondTextNode = document.createTextNode(secondLineText);
        secondLineTspan.appendChild(tempSecondTextNode);
        svgNotificationDescription.appendChild(secondLineTspan);
        let secondLineBBox = secondLineTspan.getBBox();

        if (secondLineBBox.width > maxWidth) {
            let secondSplitIndex = secondLineText.length;
            while (secondSplitIndex > 0) {
                tempSecondTextNode.textContent = secondLineText.slice(0, secondSplitIndex) + '...';
                secondLineBBox = secondLineTspan.getBBox();
                if (secondLineBBox.width <= maxWidth) break;
                secondSplitIndex--;
            }
        }
        
        secondLineTspan.textContent = tempSecondTextNode.textContent; // Set the truncated text
    }

    return secondLineText.length > 0; // Return true if there is a second line
}

function split_text(text, maxWidth) {
    // Split the text into two lines if necessary
    let firstLine = text;
    let secondLine = '';

    // Measure the width of the first line and split if necessary
    const tempTextNode = document.createTextNode(text);
    svgNotificationDescription.appendChild(tempTextNode);
    let descriptionBBox = svgNotificationDescription.getBBox();

    if (descriptionBBox.width > maxWidth) {
        let words = text.split(' ');
        let currentLine = '';

        for (let i = 0; i < words.length; i++) {
            let testLine = currentLine + (currentLine ? ' ' : '') + words[i];
            tempTextNode.textContent = testLine;
            descriptionBBox = svgNotificationDescription.getBBox();

            if (descriptionBBox.width > maxWidth) {
                // If adding the word exceeds maxWidth, finalize the first line
                firstLine = currentLine.trim();
                secondLine = words.slice(i).join(' ').trim();
                break;
            } else {
                currentLine = testLine;
            }
        }

        // If all words fit in the first line
        if (!secondLine) {
            firstLine = currentLine.trim();
        }
    }

    // Clean up the temporary text node
    svgNotificationDescription.removeChild(tempTextNode);

    return [firstLine, secondLine];
}

function update_notification_icon(artworkUrl){
    svgNotificationIcon.setAttribute('href', artworkUrl);
}

function update_notification_transform(backgroundImageWidth, backgroundImageHeight) {
    let notificationWidth = 1065;
    let notificationHeight = 226;
    
    let ratio = (backgroundImageWidth / notificationWidth)*0.95;
    
    let newNotificationWidth = notificationWidth * ratio;
    let offsetX = (backgroundImageWidth - newNotificationWidth) / 2;
    let offsetY = backgroundImageHeight*0.063+200;
    
    set_notification_transform(offsetX, offsetY, ratio);
}

function set_notification_transform(offsetX, offsetY, scale) {
    notificationGroup.setAttribute("transform", "scale("+scale+") translate("+offsetX+", "+offsetY+")");
}

function update_notification_time(nowBool, custom=""){
    if (nowBool) {
        svgNotificationTimeText.textContent = "";
        svgNotificationTimeNow.textContent = "now";
    } else {
        svgNotificationTimeText.textContent = custom;
        svgNotificationTimeNow.textContent = "";
    }
}
