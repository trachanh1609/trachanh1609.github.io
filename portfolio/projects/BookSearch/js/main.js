$(document).ready(function() {

    var books = new Books()  // initiate Books object
    var searchBy
    var keyword

    // Handle Click Event when SearchButton is clicked
    $('#searchButton').click(function(){
      searchBy = $('input[name="searchBy"]:checked').val() ;
      keyword = $('#searchKeyword').val() ;
      books.page = 0 ;
      books.search(keyword, searchBy, books.page)
      $('#current').text('Current Page = '+books.page)

    });

    // Handle Event when user press Enter in searchBox
    $('#searchKeyword').keypress(function(e){
        if(e.which == 13){//Enter key pressed
            $('#searchButton').click();//Trigger search button click event
        }
    });

    // Displaying Input Value when user drag in Input range
    $('input[name="quantity"]').on("change mousemove", function() {
        $('#quantity').text($(this).val());
    });

    // GoogleBooksAPI returns max 40 items per request. So moving to the next page needs to perform a new Ajax request in Books.search()
    // Request the next Page when button Next is clicked
    $('#next').click(function(){
      books.page += 1 ;
      books.search(keyword, searchBy)
      $('#current').text('Current Page = '+books.page)
    });

    // Request the previous Page when button Previous is clicked
    $('#previous').click(function(){
      if(books.page > 0){
        books.page -= 1 ;
        books.search(keyword, searchBy)
        $('#current').text('Current Page = '+books.page)
      }
    });


    // Handle sorting when the table Header is clicked
    // only .sorter column can be sorted
    // default sorterName = 'title' if attribute 'data-sorter-name' is not given
    $('#books-table .sorter').each(function() {
        var header = $(this);
        var inverse = false;

        header.click(function() {
            var sorterName = header.attr("data-sorter-name") || 'title' ;

            header.siblings('th').removeClass('active');
            header.addClass('active');
            if(inverse){
              header.removeClass('desc');
            } else {
              header.addClass('desc');
            }

            books.sortBy(sorterName, inverse)
            books.displayToTable()
            inverse = !inverse;

        })

    }); // End of $('#books-table .sorter')

}); // End of $(document).ready()
