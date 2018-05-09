function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Friday Testing')
  .addSubMenu(ui.createMenu('New Testing Day')
              .addItem('New Friday', 'newFriday')
              .addItem('New Thursday', 'newThursday'))
  .addItem("Update Watch List", 'updateWatchList')
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
  var ss = SpreadsheetApp.getActive();
  var template = ss.getSheetByName("Template");
  var newSheet = template.copyTo(ss);
  newSheet.setName(date.toDateString());
  newSheet.showSheet();
}

function getNextDayOfWeek(date, dayOfWeek) {
  // Code to check that date and dayOfWeek are valid left as an exercise ;)
  
  var resultDate = new Date(date.getTime());
  
  resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
  
  return resultDate;
}
function updateWatchList(){
  var ss = SpreadsheetApp.getActive();
  //var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1K9JIxfIX2T_9DAdKcZknWuGvhgvh9dr_rqMTMnA7p7A/edit#gid=1685631919");
  var sheets = ss.getSheets();
  var storage = ss.getSheetByName("storage");
  var weekdays = ['Mon', "Tue", "Wed", "Thu", "Fri"];
  var curLength = 0;
 // var data = [[]];//
  
  for(var i = 0; i<sheets.length; i++){
    for(var j = 0; j<weekdays.length; j++){
      if(sheets[i].getName().indexOf(weekdays[j]) > -1){
      //  data.push.apply(data,([sheets[i].getName()]));
        //data.push.apply(data, [(sheets[i].getDataRange().getDisplayValues())]); 
        var holder = sheets[i].getDataRange().getDisplayValues();
        var spliced = holder.splice(3);
        var end = findEnd(spliced);
      //  spliced = holder.splice(end,end);
        storage.getRange(1+curLength, 2, spliced.length, spliced[0].length).setValues(spliced);
        curLength+=spliced.length;
      }
    }
  }

 // var watchCheckedData = checkData(data);
  //write to a hiddensheet, countif, if countifcell >1->read in whole row
  
  //write: Name: John Doe, Tests Written: 3, Date+Subject, Date+Subject, Date+Subject
}
function findEnd(holder){
  var h = 0;
  
  for(var i = 0; i<holder.length; i++){
    if(holder[i][1] == ""){
      h = i;
      break;
    }
    
  }
  return h;
}
function checkData(data){
  var checked = [];
  
 
  
}