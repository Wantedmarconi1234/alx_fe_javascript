document.addEventListener('DOMContentLoaded', () => {
  // Selecting DOM elements
  const newQuoteButton = document.getElementById('newQuote');
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');

  // Samples of quotes
  let quotes = [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
      { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", category: "Action" },
      { text: "Whether you think you can or you think you can’t, you’re right.", category: "Mindset" },
      { text: "The best way to predict the future is to invent it.", category: "Innovation" }
  ];

  // Load quotes from localStorage if available
  if (localStorage.getItem('quotes')) {
      quotes = JSON.parse(localStorage.getItem('quotes'));
  }

  // Function to display a quote
  function displayQuote(quote) {
      quoteDisplay.innerHTML = '';

      // Creating and appending the category element
      const categoryElement = document.createElement('p');
      categoryElement.innerHTML = `Category: ${quote.category}`;
      quoteDisplay.appendChild(categoryElement);

      // Creating and appending the quote element
      const quoteElement = document.createElement('p');
      quoteElement.innerHTML = quote.text;
      quoteDisplay.appendChild(quoteElement);

      // Save the last viewed quote in session storage
      sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
  }

  // Function to display a random quote
  function showRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      displayQuote(quotes[randomIndex]);
  }

  // Adding a click event to change quote
  newQuoteButton.addEventListener('click', showRandomQuote);

  // Function to add a new quote
  function addQuote() {
      const quoteTextValue = newQuoteText.value;
      const newQuoteCategoryValue = newQuoteCategory.value;
      const newQuote = { text: quoteTextValue, category: newQuoteCategoryValue };

      quotes.push(newQuote);
      localStorage.setItem('quotes', JSON.stringify(quotes));

      // Clear input fields after adding a quote
      newQuoteText.value = '';
      newQuoteCategory.value = '';
  }

  // Attaching addQuote function to window for onclick to work
  window.addQuote = addQuote;

  // Display the last viewed quote if available in session storage
  const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastViewedQuote) {
      displayQuote(JSON.parse(lastViewedQuote));
  } else {
      showRandomQuote();
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
          quotes.push(...importedQuotes);
          localStorage.setItem('quotes', JSON.stringify(quotes));
          alert('Quotes imported successfully!');
      };
      fileReader.readAsText(event.target.files[0]);
  }

  // Attaching importFromJsonFile function to window for onchange to work
  window.importFromJsonFile = importFromJsonFile;
});
