function Books(){

  // Books object has 3 properties: Books.data, Books.page, Books.maxResult
  this.data ;  // is the data return from Ajax call
  this.page = 0  // is the current page
  this.maxResult // Number of Items GoogleBookApi return, min=10,max=40 according to API docs

  // and Books has 3 methods : Books.search , Books.displayToTable, Books.sortBy

  // Books.search() performs a API Get request to the server based on the parameters provided
  // searchBy = intitle or inauthor . Books.search() can search the keyword by title or by author
  this.search = function(keyword, searchBy){
    $("#message").css("display", "block");
    $('#books-table tbody tr').remove();

    var _this = this  // assigning _this = Books
    _this.maxResult = $('input[name="quantity"]').val()

    $.ajax({
            method: "GET",
            url: "https://www.googleapis.com/books/v1/volumes?",
            data: {
                q: searchBy + ':' + keyword,
                startIndex: _this.page * _this.maxResult,
                maxResults: _this.maxResult
            },
            error: function(message) {
                $("#errorMessage").css("display", "block");
                $("#errorMessage").text('"An error occured, please try again later: ' + message.statusText);
            }
        })
        .then(function(responseData) {
            $("#errorMessage").css("display", "none");
            $("#message").css("display", "none");
            _this.data = responseData;
            _this.displayToTable()
        }) // End of ajax call

  } // End of search()

  // Refresh table data and display new book_list result
  this.displayToTable = function(){
      $('#books-table tbody tr').remove();
      var _this = this
      var startIndex = _this.page * _this.maxResult
      var book_list = _this.data.items
      $.each(book_list, function(i, item) {
          var newRow = '';
          newRow += '<tr>'
          newRow += '<td>' + ( startIndex + i+1) + '</td>'
          newRow += '<td>' + item.volumeInfo.title + '</td>'
          newRow += '<td>' + item.volumeInfo.subtitle + '</td>'
          newRow += '<td>' + item.volumeInfo.authors + '</td>'
          newRow += '<td>' + item.volumeInfo.publishedDate + '</td>'
          newRow += '</tr>'
          $('#books-table tbody').append(newRow);
      });
  } // End of displayToTable

  // Books.sortBy() will sort Books.data.items according to the sorterName
  // sorterName can be title, author or publishedDate
  this.sortBy = function(sorterName, inverse){
    var _this = this
    switch (sorterName) {
        case 'title':
            _this.data.items.sort(function(a, b) {
                return a.volumeInfo.title > b.volumeInfo.title ?
                    inverse ? -1 : 1 :
                    inverse ? 1 : -1;
            });
            break;
        case 'author':
            _this.data.items.sort(function(a, b) {
                return a.volumeInfo.authors > b.volumeInfo.authors ?
                    inverse ? -1 : 1 :
                    inverse ? 1 : -1;
                  });
            break;
        case 'publishedDate':
            _this.data.items.sort(function(a, b) {
                return a.volumeInfo.publishedDate > b.volumeInfo.publishedDate ?
                    inverse ? -1 : 1 :
                    inverse ? 1 : -1;
                  });
            break;
    }
  } // End of sortBy


} // End of Books
