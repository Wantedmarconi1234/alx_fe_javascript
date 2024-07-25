document.addEventListener('DOMContentLoaded', () => {
    // selecting dom elements
    const newQuote = document.getElementById('newQuote');
    const quoteDisplay = document.getElementById('quoteDisplay');
    let newQuoteText = document.getElementById('newQuoteText');
    let newQuoteCategory = document.getElementById('newQuoteCategory');

    // samples of quotes
    const quotes = [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
        { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", category: "Action" },
        { text: "Whether you think you can or you think you can’t, you’re right.", category: "Mindset" },
        { text: "The best way to predict the future is to invent it.", category: "Innovation" }
    ];

    //   setting a default quote
      quoteDisplay.innerHTML = quotes[0].text

        
      function showRandomQuote() {
        // Setting up random index to change quotes
        const randomIndex = Math.floor(Math.random() * quotes.length);
    
        // Clearing previous content
        quoteDisplay.innerHTML = '';
    
        // Creating and appending the category element
        const categoryElement = document.createElement('p');
        categoryElement.innerHTML = `Category: ${quotes[randomIndex].category}`;
        quoteDisplay.appendChild(categoryElement);
    
        // Creating and appending the quote element
        const quoteElement = document.createElement('p');
        quoteElement.innerHTML = quotes[randomIndex].text;
        quoteDisplay.appendChild(quoteElement);
    }
    
      //   adding a click event to change 
      newQuote.addEventListener('click', showRandomQuote)

      
      function createAddQuoteForm(){
        let quoteTextValue = newQuoteText.value;
        let newQuoteCategoryValue = newQuoteCategory.value;
        const newQuote = {text: quoteTextValue, category: newQuoteCategoryValue}
        quotes.push(newQuote);
        
        // Clear input fields after adding a quote
        newQuoteText.value = '';
        newQuoteCategory.value = '';
      }

      function addQuote(){
        createAddQuoteForm()
      }

       // Attaching addQuote function to window for onclick to work
      window.addQuote = addQuote;
      
}) 