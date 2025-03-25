let selectedItem = null;

function search() {
    const searchTerm = document.getElementById('searchTerm').value;
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=software&entity=software&limit=10`;
    

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const results = document.getElementById('results');
            results.innerHTML = '';

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
                    // Clear the seach results and search term
                    results.innerHTML = '';
                    document.getElementById('searchTerm').value = '';
                    select(); // Call select() to display the selected item
                });
                
                itemDiv.appendChild(img);
                itemDiv.appendChild(a);
                li.appendChild(itemDiv);
                results.appendChild(li);
            });
        })
        .catch(error => console.error('Error:', error));
}
//! selectedItem is a global variable that stores the selected item. 
//! selectedApp is the container (div) where the selected item is displayed.

function select() {
    const searchContainer = document.getElementById('search-container');
    const selectedApp = document.getElementById('selected-app');
    const results = document.getElementById('results');
    const appStatus = document.getElementById('app-status'); // New status element

    // Check if the elements exist
    if (!searchContainer || !selectedApp || !results || !appStatus) {
        console.error('Required elements are missing in the DOM.');
        return;
    }

    if (selectedItem) {
        console.log('Selected item:', selectedItem);
        // Clear the search-container
        searchContainer.innerHTML = '';
        results.innerHTML = ''; // Clear results
        // Display the selected-app with a remove button
        selectedApp.innerHTML = `
            <img src="${selectedItem.artworkUrl100}" alt="${selectedItem.trackName}">
            <h2>${selectedItem.trackName}</h2>
            <button id="removeButton" style="background: none; border: none; font-size: 20px; cursor: pointer;">&times;</button>
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
        // Clear the selected-app and results
        selectedApp.innerHTML = '';
        results.innerHTML = '';
        appStatus.textContent = 'No app selected'; // Reset status
        appStatus.style.color = 'red'; // Set status color to red
    }
}

select(); // Call select() to initialize the UI

function showTab(tabId) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));

    // Show the selected tab content and activate the corresponding button
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab-button[onclick="showTab('${tabId}')"]`).classList.add('active');
}

// Manage input image
const inputImage = document.getElementById('input-image');
const imagePreview = document.getElementById('image-preview');
inputImage.onchange = evt => {
    const [file] = inputImage.files;
    if (file) {
        imagePreview.src = URL.createObjectURL(file);
    }
};

// Dynamically load images from the ./images/ directory into the gallery
function loadGalleryImages() {
    const gallery = document.getElementById('image-gallery');
    const images = [
        './images/image1.jpg',
        './images/image2.jpg',
        './images/image3.jpg',
        './images/image4.jpg',
        './images/image5.jpg',
        './images/image6.jpg'
    ]; 

    images.forEach(imagePath => {
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = 'Gallery Image';
        img.addEventListener('click', () => {
            console.log(`Selected image: ${imagePath}`);
            imagePreview.src = imagePath;
        });
        gallery.appendChild(img);
    });
}

// Call this function when the page loads to populate the gallery
loadGalleryImages();
