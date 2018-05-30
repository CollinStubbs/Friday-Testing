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
  
  var accom = ss.getSheetByName("accommodated");
  checkStudent(accom);
  
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
  var watchList = [];
  // var data = [[]];//
  
  for(var i = 0; i<sheets.length; i++){
    for(var j = 0; j<weekdays.length; j++){
      if(sheets[i].getName().indexOf(weekdays[j]) > -1){
        //  data.push.apply(data,([sheets[i].getName()]));
        //data.push.apply(data, [(sheets[i].getDataRange().getDisplayValues())]); 
        var holder = sheets[i].getDataRange().getDisplayValues();
        var date = sheets[i].getName();
        var spliced = holder.splice(3);
        var end = findEnd(spliced);
        spliced = spliced.splice(0, end);
        var spLength = spliced.length;
        
        storage.getRange(1+curLength, 2, spliced.length, spliced[0].length).setValues(spliced);
        for(var k = 0; k<spLength; k++){
          storage.getRange(k+1+curLength, 2).setValue(date); 
        }
        
        curLength+=spliced.length;
      }
    }
  }
  
  for(var i = 1; i<curLength+1; i++){
    if(Number(storage.getRange(i, 1).setValue("=COUNTIF(C:C, C"+(i)+")").getDisplayValue()) > 1){//sets the value of the cell to a count function wher eit counts their name and then gets the value and sees if theyve been more than once
      var storageHolder = storage.getRange(i+":"+i).getValues()[0][2];
      watchList.push(storage.getRange(i+":"+i).getValues()[0]);     
    }
  }
  var watchSheet = SpreadsheetApp.getActive().getSheetByName("Watch List");
  watchSheet.getRange(2, 1, watchList.length, watchList[0].length).setValues(watchList);
  watchSort();
  // var watchCheckedData = checkData(data);
  //write to a hiddensheet, countif, if countifcell >1->read in whole row
  
  //write: Name: John Doe, Tests Written: 3, Date+Subject, Date+Subject, Date+Subject
}
function watchSort(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Watch List");
  var range = sheet.getDataRange();
  
  range.sort({column: 1, ascending: false});
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

/*THIS SECTION PULLS ACCOMMODATED STUDENT DATA*/
function checkStudent(sheet) {//Make this update by itself
  
  
  var students = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1H-DRyoZYEY9VhjfOSsHIaLrt2sMD3k2FcfS4gNy84Kc/edit#gid=0").getSheets()[0];
  var studentHolder = students.getRange("A:A").getDisplayValues();
  sheet.getRange(1,1,studentHolder.length,1).setValues(studentHolder);
  var atAR = [];
  var ltAR= [];
  for(var i = 0; i<studentHolder.length; i++){
    atAR.push(getStudentAT(studentHolder[i][0])); 
    ltAR.push(getStudentLT(studentHolder[i][0]));
  }
  sheet.getRange(1,2,atAR.length,1).setValues(atAR);
  sheet.getRange(1,3,ltAR.length,1).setValues(ltAR);
  sheet.getRange("A1:C3").clear();
}

//alternating date colours, fill % data equations (if blank stay empty )

function getStudentAT(name){
  var students = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1H-DRyoZYEY9VhjfOSsHIaLrt2sMD3k2FcfS4gNy84Kc/edit#gid=0").getSheets()[0];
  var studentHolder = students.getRange("A:A").getDisplayValues();
  var infoHolder = students.getRange("D:D").getDisplayValues();
  
  var index = -1;
  var at = 0;
  for(var i = 0; i<studentHolder.length; i++){
    
    //index = studentHolder[i].indexOf([name]);
    if(studentHolder[i] == name) index = i;
    if(index>=0) break;
  }
  if(index<0){
    at = [""]; 
  }
  else{
    var pIndex = infoHolder[index][0].indexOf("%");
    at = 0;
    if(pIndex < 0){
      at = [""]; 
    }
    else{
      at = [infoHolder[index][0].substring(pIndex-2, pIndex)];
    }
    
  }
  return at;
}
function getStudentLT(name){
  var students = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1H-DRyoZYEY9VhjfOSsHIaLrt2sMD3k2FcfS4gNy84Kc/edit#gid=0").getSheets()[0];
  var studentHolder = students.getRange("A:A").getDisplayValues();
  var infoHolder = students.getRange("D:D").getDisplayValues();
  var at = 0;
  var index = -1;
  for(var i = 0; i<studentHolder.length; i++){
    
    //index = studentHolder[i].indexOf([name]);
    if(studentHolder[i] == name) index = i;
    if(index>=0) break;
  }
  if(index<0){
    at = [""]; 
  }
  else{
    var pIndex = infoHolder[index][0].indexOf("Laptop");
    
    if(pIndex < 0){
      at = [""]; 
    }
    else{
      at = [1];
    }
    
  }
  return at;
}