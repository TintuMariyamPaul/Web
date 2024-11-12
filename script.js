document.addEventListener("DOMContentLoaded", () => {
    fetch("data.json")
        .then(response => response.json())
        .then(properties => {
            const renderProperties = (propertiesToRender) => {
                const propertyList = document.getElementById("property-list");
                propertyList.innerHTML = '';

                if (propertiesToRender.length === 0) {
                    // Display message if no properties match the search
                    const noResultsMessage = document.createElement("p");
                    noResultsMessage.innerText = "No properties found.";
                    noResultsMessage.classList.add("no-results-message");
                    propertyList.appendChild(noResultsMessage);
                    return;
                }
                
                propertiesToRender.forEach(property => {
                    const propertyDiv = document.createElement("div");
                    propertyDiv.classList.add("property");
                    
                    const propertyImage = property.featuredImage ? `
                        <img src="${property.featuredImage}" alt="${property.name}">
                    ` : '';
                    
                    propertyDiv.innerHTML = `
                        ${propertyImage}
                        <h3>${property.name}</h3>
                        <p>${property.price}</p>
                        <p>${property.category}</p>
                    `;
                    
                    propertyDiv.onclick = () => openModal(property);
                    propertyList.appendChild(propertyDiv);
                });
            };

            renderProperties(properties);

            const searchForm = document.getElementById("search-form");
            searchForm.onsubmit = (event) => {
                event.preventDefault();
                const searchTerm = document.getElementById("search-bar").value.toLowerCase();
                
                const filteredProperties = properties.filter(property => {
                    return property.name.toLowerCase().includes(searchTerm) || 
                           property.description.toLowerCase().includes(searchTerm);
                });

                renderProperties(filteredProperties);
            };

            const modal = document.getElementById("property-modal");
            const closeButton = document.querySelector(".close-button");
            closeButton.onclick = () => { modal.style.display = "none"; };

            document.getElementById("reservation-form").onsubmit = (event) => {
                event.preventDefault();
                
                // Show the confirmation alert
                alert("Viewing booked! We'll contact you soon...");
                
                // Clear the form fields after alert
                const form = event.target;
                form.reset();  // Reset all form elements to their default values
                
                // Close the modal
                modal.style.display = "none";
            };
        });

    function openModal(property) {
        const modal = document.getElementById("property-modal");
        document.getElementById("modal-title").innerText = property.name;
        document.getElementById("modal-price").innerText = `Price: ${property.price}`;
        document.getElementById("modal-energy-rating").innerText = `Energy Rating: ${property.berRating}`;
        document.getElementById("modal-location").innerText = `Location: ${property.location}`;
        document.getElementById("modal-bed-bath").innerText = `Bedrooms: ${property.bedrooms}, Bathrooms: ${property.bathrooms}`;
        document.getElementById("modal-description").innerText = property.description;

        const featuresList = document.getElementById("modal-features");
        featuresList.innerHTML = "";
        const featureItems = [`Type: ${property.type}`, `Category: ${property.category}`];
        featureItems.forEach(feature => {
            const li = document.createElement("li");
            li.innerText = feature;
            featuresList.appendChild(li);
        });

        const mediaDiv = document.getElementById("modal-media");
        mediaDiv.innerHTML = "";
        mediaDiv.style.display = "flex";
        mediaDiv.style.flexWrap = "wrap";
        
        property.otherMedia.forEach(media => {
            if (media.type === "image") {
                const img = document.createElement("img");
                img.src = media.src;
                img.alt = `${property.name} - Image`;
                mediaDiv.appendChild(img);
            }
        });

        modal.style.display = "block";
    }
});
