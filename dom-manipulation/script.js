document.addEventListener('DOMContentLoaded', () => {
    // Selecting DOM elements
    const newQuoteButton = document.getElementById('newQuote');
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');
    const categoryFilter = document.getElementById('categoryFilter');
    const importFile = document.getElementById('importFile');

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
            // Creating and appending the category element
            const categoryElement = document.createElement('p');
            categoryElement.innerHTML = `Category: ${quote.category}`;
            quoteDisplay.appendChild(categoryElement);

            // Creating and appending the quote element
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

        populateCategoryFilter();

        // Clear input fields after adding a quote
        newQuoteText.value = '';
        newQuoteCategory.value = '';
    }

    // Attaching addQuote function to window for onclick to work
    window.addQuote = addQuote;

    // Function to populate the category filter dropdown
    function populateCategoryFilter() {
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
            populateCategoryFilter();
            showRandomQuote();
            alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    }

    // Attaching importFromJsonFile function to window for onchange to work
    window.importFromJsonFile = importFromJsonFile;

    // Initial population of the category filter
    populateCategoryFilter();

    // Display the last viewed quote or a random quote
    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
        displayQuotes([JSON.parse(lastViewedQuote)]);
    } else {
        showRandomQuote();
    }
});
