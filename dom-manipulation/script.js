document.addEventListener('DOMContentLoaded', () => {
    const newQuoteButton = document.getElementById('newQuote');
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');
    const categoryFilter = document.getElementById('categoryFilter');
    const importFile = document.getElementById('importFile');

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

        populateCategory();

        newQuoteText.value = '';
        newQuoteCategory.value = '';
    }

    window.addQuote = addQuote;

    function populateCategory() {
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
            populateCategory();
            showRandomQuote();
            alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    }

    window.importFromJsonFile = importFromJsonFile;

    populateCategory();

    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
        displayQuotes([JSON.parse(lastViewedQuote)]);
    } else {
        showRandomQuote();
    }
});
