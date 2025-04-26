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

function showTab(tabId, hideId) {
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
    const deactivateButton = document.querySelector(`.tab-button[onclick="showTab('${hideId}', '${tabId}')"]`);
    if (deactivateButton) {
        deactivateButton.classList.remove('active');
    }

    // Activate the corresponding button for the selected tab
    const activeButton = document.querySelector(`.tab-button[onclick="showTab('${tabId}', '${hideId}')"]`);
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
function updateSvgBackground(imagePath, imageWidth, imageHeight) {
    const daSvg = document.getElementById('svg-notification');
    daSvg.setAttribute('viewBox', '0 0 '+ imageWidth + ' '+ imageHeight);

    const svgBackgroundImage = document.getElementById('background-image');
    console.log("SVG Background Image:", svgBackgroundImage);
    if (svgBackgroundImage) {
        svgBackgroundImage.setAttribute('href', imagePath);
        svgBackgroundImage.setAttribute('width', imageWidth);
        svgBackgroundImage.setAttribute('height', imageHeight);
        console.log("Setting href:", imagePath);
    } else {
        console.error('SVG background image element not found.');
    }
    // Force a redraw
    //const parent = svgBackgroundImage.parentNode;
    //parent.removeChild(svgBackgroundImage);
    //parent.appendChild(svgBackgroundImage);
}

let imageWidth = 0;
let imageHeight = 0;

// Dynamically load images from the ./images/ directory into the gallery
function loadGalleryImages() {
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
            // Create a new Image object to load the selected image
            const img = new Image();
            img.src = imagePath;
            
            // Once the image is loaded, save its width and height
            img.onload = () => {
                imageWidth = img.width;
                imageHeight = img.height;
                updateSvgBackground(imagePath, imageWidth, imageHeight); // Update the SVG background image
                console.log(`Image dimensions: ${imageWidth}x${imageHeight}`);
                // You can store these dimensions in a variable or use them as needed
};
        });
        gallery.appendChild(img);
    });
}

// Call this function when the page loads to populate the gallery
loadGalleryImages();

// Customize the svg
const svg_notification = document.getElementById('svg-notification');
const svg_notification_title = document.getElementById('svg-notification-title');
const svg_notification_time_text = document.getElementById('svg-notification-time-text');
const svg_notification_time_now = document.getElementById('svg-notification-time-now'); 
const svg_notification_description = document.getElementById('svg-notification-description');
const svg_notification_description_sec = document.getElementById('svg-notification-description-sec');
const svg_notification_icon = document.getElementById('svg-notification-icon');

const notification_text = document.getElementById('notification-text');

const notification_group = document.getElementById('notification-group');
const notification_background_image = document.getElementById('background-image');
function update_notification() {
    svg_notification_title.textContent = selectedItem.trackName;
    

    // Get the text from the textarea
    const fullText = notification_text.value;
    const maxWidth = 800; // Set the maximum width for the first line
    const maxWidthSecondLine = 800; // Set the maximum width for the second line
    
    // Get reference to the description text element
    const descriptionElement = svg_notification_description;
    
    // Clear all children from the description element
    while (descriptionElement.firstChild) {
        descriptionElement.removeChild(descriptionElement.firstChild);
    }
    
    // Split the text into two lines if necessary
    let splitIndex = fullText.length;
    let firstLineText = fullText;
    let secondLineText = '';
    
    // Measure the width of the first line and split if necessary
    const tempTextNode = document.createTextNode(fullText);
    descriptionElement.appendChild(tempTextNode);
    let descriptionBBox = descriptionElement.getBBox();
    
    if (descriptionBBox.width > maxWidth) {
        while (splitIndex > 0) {
            tempTextNode.textContent = fullText.slice(0, splitIndex);
            descriptionBBox = descriptionElement.getBBox();
            if (descriptionBBox.width <= maxWidth) break;
            splitIndex--;
        }
        firstLineText = fullText.slice(0, splitIndex).trim();
        secondLineText = fullText.slice(splitIndex).trim();
    }
    
    // Set the first line as the text content of the <text> element
    descriptionElement.textContent = firstLineText;
    
    // Create the second line <tspan> if there is remaining text
    if (secondLineText) {
        const secondLineTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        secondLineTspan.setAttribute('x', '173'); // Align with the first line
        secondLineTspan.setAttribute('y', '179'); // Adjust the y-coordinate for the second line
    
        // Measure the width of the second line and truncate if necessary
        const tempSecondTextNode = document.createTextNode(secondLineText);
        secondLineTspan.appendChild(tempSecondTextNode);
        descriptionElement.appendChild(secondLineTspan);
        let secondLineBBox = secondLineTspan.getBBox();
    
        if (secondLineBBox.width > maxWidthSecondLine) {
            let secondSplitIndex = secondLineText.length;
            while (secondSplitIndex > 0) {
                tempSecondTextNode.textContent = secondLineText.slice(0, secondSplitIndex) + '...';
                secondLineBBox = secondLineTspan.getBBox();
                if (secondLineBBox.width <= maxWidthSecondLine) break;
                secondSplitIndex--;
            }
        }
    
        secondLineTspan.textContent = tempSecondTextNode.textContent; // Set the truncated text
    }

    // Update the image
    if (selectedItem) {
        console.log("Selected item:", selectedItem);

        const artworkUrl = selectedItem.artworkUrl512 || selectedItem.artworkUrl100 || './images/placeholder.png';
        const cacheBusterUrl = `${artworkUrl}?t=${new Date().getTime()}`; // Add cache buster
        console.log("Setting href with cache buster:", cacheBusterUrl);

        svg_notification_icon.setAttribute('href', cacheBusterUrl);

        // Force a redraw
        const parent = svg_notification_icon.parentNode;
        parent.removeChild(svg_notification_icon);
        parent.appendChild(svg_notification_icon);

        console.log("Current href:", svg_notification_icon.getAttribute('href'));
    } else {
        console.error("No selected item available.");
    }

    // Update the notification time
    const time_custom_input = document.getElementById('custom-time');
    if (time_custom_input) {
        svg_notification_time_text.textContent = time_custom_input.value;
        svg_notification_time_now.textContent = "";
    }
    const time_now_tab = document.getElementById('now-time-tab');
    if (time_now_tab.classList.contains('active')) {
        svg_notification_time_text.textContent = "";
        svg_notification_time_now.textContent = "now";
    }

    //get background image width and height
    let backgroundImageWidth = notification_background_image.getAttribute('width');
    let backgroundImageHeight = notification_background_image.getAttribute('height');

    let notificationWidth = 1065;
    let notificationHeight = 226;

    let ratio = (backgroundImageWidth / notificationWidth)*0.95;

    let newNotificationWidth = notificationWidth * ratio;
    let offsetX = (backgroundImageWidth - newNotificationWidth) / 2;
    let offsetY = (160/backgroundImageHeight)

    notification_group.setAttribute("transform", "scale("+ratio+") translate("+offsetX+", "+offsetY+")");
    console.log("ratio", ratio);

}