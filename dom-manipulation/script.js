document.addEventListener('DOMContentLoaded', () => {
    const newQuoteButton = document.getElementById('newQuote');
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');
    const categoryFilter = document.getElementById('categoryFilter');
    const importFile = document.getElementById('importFile');
    const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';
    const SYNC_INTERVAL = 60000; // Sync every 60 seconds

    let quotes = localStorage.getItem('quotes') ? JSON.parse(localStorage.getItem('quotes')) : [];

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

        sessionStorage.setItem('lastViewedQuote', JSON.stringify(filteredQuotes[0]));
    }

    function showRandomQuote() {
        const filteredQuotes = filterQuotes();
        if (filteredQuotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            displayQuotes([filteredQuotes[randomIndex]]);
        }
    }

    newQuoteButton.addEventListener('click', showRandomQuote);

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

        populateCategories();

        newQuoteText.value = '';
        newQuoteCategory.value = '';
    }

    window.addQuote = addQuote;

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

    async function syncQuotes() {
        const serverQuotes = await fetchQuotesFromServer();
        const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
        const mergedQuotes = resolveConflicts(localQuotes, serverQuotes);
        localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
        quotes = mergedQuotes;
        populateCategories();
        showRandomQuote();
        showNotification('Data has been updated from the server.');
    }

    function resolveConflicts(localQuotes, serverQuotes) {
        const localTextSet = new Set(localQuotes.map(quote => quote.text));
        const mergedQuotes = [...localQuotes, ...serverQuotes.filter(quote => !localTextSet.has(quote.text))];
        return mergedQuotes;
    }

    setInterval(syncQuotes, SYNC_INTERVAL);

    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.innerText = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }

    function populateCategories() {
        const categories = [...new Set(quotes.map(quote => quote.category))];
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
        if (lastSelectedCategory) {
            categoryFilter.value = lastSelectedCategory;
        }
    }

    function filterQuotes() {
        const selectedCategory = categoryFilter.value;
        localStorage.setItem('lastSelectedCategory', selectedCategory);
        if (selectedCategory === 'all') {
            return quotes;
        }
        return quotes.filter(quote => quote.category === selectedCategory);
    }

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

        URL.revokeObjectURL(url);
    }

    window.exportToJsonFile = exportToJsonFile;

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes = [...quotes, ...importedQuotes];
            localStorage.setItem('quotes', JSON.stringify(quotes));
            populateCategories();
            showRandomQuote();
            alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    }

    window.importFromJsonFile = importFromJsonFile;

    populateCategories();

    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
        displayQuotes([JSON.parse(lastViewedQuote)]);
    } else {
        showRandomQuote();
    }
});
