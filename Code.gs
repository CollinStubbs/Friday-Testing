function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Friday Testing')
  .addSubMenu(ui.createMenu('New Testing Day')
              .addItem('New Friday', 'newFriday')
             .addItem('New Thursday', 'newThursday'))
  .addToUi();
}
function newFriday(){
  var today = new Date();
  newDay(getNextDayOfWeek(today, 5));
  //newDay(new Date(the next friday));
}
function newThursday(){
  var today = new Date();
  newDay(getNextDayOfWeek(today, 4));
  //newDay(new Date(the next thursday));
}

function newDay(date){
  
}

function getNextDayOfWeek(date, dayOfWeek) {
    // Code to check that date and dayOfWeek are valid left as an exercise ;)

    var resultDate = new Date(date.getTime());

    resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);

    return resultDate;
}