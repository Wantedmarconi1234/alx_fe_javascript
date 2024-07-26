document.addEventListener('DOMContentLoaded', () => {
    // Selecting DOM elements
    const newQuoteButton = document.getElementById('newQuote');
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');
    const categoryFilter = document.getElementById('categoryFilter');
    const importFile = document.getElementById('importFile');
    const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API URL
    const SYNC_INTERVAL = 60000; // Sync every 60 seconds

    // Load quotes from localStorage if available
    let quotes = localStorage.getItem('quotes') ? JSON.parse(localStorage.getItem('quotes')) : [];

    // Function to display quotes
    function displayQuotes(filteredQuotes) {
        quoteDisplay.innerHTML = '';

        if (filteredQuotes.length === 0) {
            quoteDisplay.innerHTML = '<p>No quotes available for this category.</p>';
            return;
        }

        filteredQuotes.forEach(quote => {
            const categoryElement = document.createElement('p');
            categoryElement.innerHTML = `Category: ${quote.category}`;
            quoteDisplay.appendChild(categoryElement);

            const quoteElement = document.createElement('p');
            quoteElement.innerHTML = quote.text;
            quoteDisplay.appendChild(quoteElement);
        });

        // Save the last viewed quote in session storage
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(filteredQuotes[0]));
    }

    // Function to display a random quote from filtered quotes
    function showRandomQuote() {
        const filteredQuotes = filterQuotes();
        if (filteredQuotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            displayQuotes([filteredQuotes[randomIndex]]);
        }
    }

    // Adding a click event to change quote
    newQuoteButton.addEventListener('click', showRandomQuote);

    // Function to add a new quote
    function addQuote() {
        const quoteTextValue = newQuoteText.value;
        const newQuoteCategoryValue = newQuoteCategory.value;
        if (!quoteTextValue || !newQuoteCategoryValue) {
            alert('Please enter both quote text and category.');
            return;
        }
        const newQuote = { text: quoteTextValue, category: newQuoteCategoryValue };

        quotes.push(newQuote);
        localStorage.setItem('quotes', JSON.stringify(quotes));

        populateCategories(); // Update category filter

        // Clear input fields after adding a quote
        newQuoteText.value = '';
        newQuoteCategory.value = '';
    }

    // Attaching addQuote function to window for onclick to work
    window.addQuote = addQuote;

    // Function to fetch quotes from the server
    async function fetchQuotesFromServer() {
        try {
            const response = await fetch(SERVER_URL);
            const serverQuotes = await response.json();
            return serverQuotes.map(item => ({ text: item.title, category: 'Server' })); // Adjust to your data structure
        } catch (error) {
            console.error('Error fetching quotes from server:', error);
            return [];
        }
    }

    // Function to post quotes to the server
    async function postQuotesToServer(quotes) {
        try {
            const response = await fetch(SERVER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quotes)
            });
            return await response.json();
        } catch (error) {
            console.error('Error posting quotes to server:', error);
        }
    }

    // Function to sync quotes with the server
    async function syncQuotes() {
        const serverQuotes = await fetchQuotesFromServer();
        const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
        const mergedQuotes = resolveConflicts(localQuotes, serverQuotes);
        localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
        quotes = mergedQuotes;
        populateCategories();
        showRandomQuote();
        showNotification('Quotes synced with server!');
    }

    // Function to resolve conflicts between local and server quotes
    function resolveConflicts(localQuotes, serverQuotes) {
        const localTextSet = new Set(localQuotes.map(quote => quote.text));
        const mergedQuotes = [...localQuotes, ...serverQuotes.filter(quote => !localTextSet.has(quote.text))];
        return mergedQuotes;
    }

    // Set interval to sync quotes periodically
    setInterval(syncQuotes, SYNC_INTERVAL);

    // Function to show notification messages
    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.innerText = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }

    // Function to populate the category filter dropdown
    function populateCategories() {
        const categories = [...new Set(quotes.map(quote => quote.category))];
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        // Set the last selected category if available
        const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
        if (lastSelectedCategory) {
            categoryFilter.value = lastSelectedCategory;
        }
    }

    // Function to filter quotes based on the selected category
    function filterQuotes() {
        const selectedCategory = categoryFilter.value;
        localStorage.setItem('lastSelectedCategory', selectedCategory);
        if (selectedCategory === 'all') {
            return quotes;
        }
        return quotes.filter(quote => quote.category === selectedCategory);
    }

    // Function to export quotes to a JSON file
    function exportToJsonFile() {
        const dataStr = JSON.stringify(quotes, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'quotes.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the URL object
        URL.revokeObjectURL(url);
    }

    // Attaching exportToJsonFile function to window for onclick to work
    window.exportToJsonFile = exportToJsonFile;

    // Function to import quotes from a JSON file
    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes = [...quotes, ...importedQuotes];
            localStorage.setItem('quotes', JSON.stringify(quotes));
            populateCategories(); // Update category filter
            showRandomQuote();
            alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    }

    // Attaching importFromJsonFile function to window for onchange to work
    window.importFromJsonFile = importFromJsonFile;

    // Initial population of the category filter
    populateCategories();

    // Display the last viewed quote or a random quote
    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
        displayQuotes([JSON.parse(lastViewedQuote)]);
    } else {
        showRandomQuote();
    }
});
