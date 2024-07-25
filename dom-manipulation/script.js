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

        
        function showRandomQuote (){
        // setting up random index to change quotes
        const randomIndex =  Math.floor(Math.random() * quotes.length);
        // displaying quote
        quoteDisplay.innerHTML = quotes[randomIndex].text;
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