const apilink = './travel_recommendation_api.json'; 

const searchButton = document.getElementById('btnSearch'); 
const errorMessage = document.getElementById('errorMessage');
const imageContainer = document.getElementById('imageContainer'); 
const resetButton = document.getElementById('reset'); 
const searchInput = document.getElementById('search'); 

searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    fetchImages(); 
});

resetButton.addEventListener('click', function() {
    searchInput.value = ''; 
    errorMessage.textContent = ''; 
    imageContainer.innerHTML = ''; 
});

function fetchImages() {
    console.log("Fetching images from:", apilink);

    fetch(apilink)
        .then(response => {
            console.log("Response status:", response.status);
            if (!response.ok) {
                throw new Error('No network response');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data from API:', data);
            const userInput = searchInput.value.toLowerCase().trim();

       
            if (['country', 'countries'].includes(userInput)) {
                renderImages(data.countries);
            } else if (['temple', 'temples'].includes(userInput)) {
                renderImages(data.temples);
            } else if (['beach', 'beaches'].includes(userInput)) {
                renderImages(data.beaches);
            } else {
                errorMessage.textContent = 'Invalid search term. Please enter "country", "temple", or "beach".';
                imageContainer.innerHTML = ''; 
            }
        })
        .catch(error => {
            console.error('An error occurred:', error);
            errorMessage.textContent = 'An error occurred while fetching data. Please try again later.';
        });
}

function renderImages(images) {
    imageContainer.innerHTML = '';

    if (!images || images.length === 0) {
        imageContainer.innerHTML = '<p>No images found for this search.</p>';
        return;
    }

    images.forEach(item => {
        const imageItem = document.createElement('div');
        imageItem.classList.add('image-item');

        if (item.cities) {
            item.cities.forEach(city => {
                imageItem.innerHTML += `
                    <img src="${city.imageUrl}" alt="${city.name}">
                    <p>${city.description}</p>
                `;
            });
        } else {
            imageItem.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <p>${item.description}</p>
            `;
        }

        imageContainer.appendChild(imageItem);
    });
}
