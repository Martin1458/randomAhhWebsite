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

    // Check if the elements exist
    if (!searchContainer || !selectedApp || !results) {
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
            <button id="removeButton">Remove</button>
        `;

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
    }
}

select(); // Call select() to initialize the UI