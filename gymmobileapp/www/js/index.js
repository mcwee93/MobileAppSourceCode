// create a new gym-task
function createNewGymTask()
{
    var gymtaskDictionary = {};
 
    // prompt the user to enter gym-task
    var gymtask = prompt("What new gym-task would you like to add?","");
    if (gymtask != null)
    {
        if (gymtask == "")
        {
            alert("The gym-task text box can not be empty when you hit submit");
        }
        else
        {
            // append the new gym-task with the table
            gymtaskDictionary = { check : 0 , text : gymtask};
            addTableRow(gymtaskDictionary, false);
        }
    }
 
}
// add a row to the table
var rowID = 0;
function addTableRow(gymtaskDictionary, appIsLoading)
{
    rowID +=1;
    var table = document.getElementById("dataTable");
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
 
    // create the checkbox
    var cell1 = row.insertCell(0);
    var element1 = document.createElement("input");
    element1.type = "checkbox";
    element1.name = "chkbox[]";
    element1.checked = gymtaskDictionary["check"];
    element1.setAttribute("onclick", "checkboxClicked()");
	element1.className = "checkbox";
    cell1.appendChild(element1);
 
    // create the textbox
    var cell2 = row.insertCell(1);
    var element2 = document.createElement("input");
    element2.type = "text";
    element2.name = "txtbox[]";
    element2.size = 16;
    element2.id = "text" + rowID;
    element2.value = gymtaskDictionary["text"];
    element2.setAttribute("onchange", "saveGymTaskList()");
	element2.className = "textbox";
    cell2.appendChild(element2);
 
    // create the view button
    var cell3 = row.insertCell(2);
    var element3 = document.createElement("input");
    element3.type = "button";
    element3.id = rowID;
    element3.value = "View";
    element3.setAttribute("onclick", "viewSelectedRow(document.getElementById('text' + this.id))");
	element3.className = "viewButton";
    cell3.appendChild(element3);
 
    // create the delete button
    var cell4 = row.insertCell(3);
    var element4 = document.createElement("input");
    element4.type = "button";
    element4.value = "Delete";
    element4.setAttribute("onclick", "deleteSelectedRow(this)");
	element4.className = "deleteButton";
    cell4.appendChild(element4);
 
    // update the UI and save the gym-task list
    checkboxClicked();
    saveGymTaskList();
 
    if (!appIsLoading) alert("Your Gym-Task has been Added Successfully!");
}
// add the strike-through styling to completed tasks
function checkboxClicked()
{
    var table = document.getElementById("dataTable");
    var rowCount = table.rows.length;
 
    // loop through all rows of the table
    for(var i = 0; i < rowCount; i++)
    {
        var row = table.rows[i];
        var chkbox = row.cells[0].childNodes[0];
        var textbox = row.cells[1].childNodes[0];
 
        // if the checkbox is checked, add the strike-through styling
        if(null != chkbox && true == chkbox.checked)
        {
            if(null != textbox)
            {		
                textbox.style.setProperty("text-decoration", "line-through");
            }
        }
 
        // if the checkbox isn't checked, remove the strike-through styling
        else
        {
            textbox.style.setProperty("text-decoration", "none");
        }
 
    }
 
    // save the gym-task list
    saveGymTaskList();
}
// view the content of the selected row
function viewSelectedRow(gymtaskTextField)
{
    alert(gymtaskTextField.value);
}
// delete the selected row
function deleteSelectedRow(deleteButton)
{
    var p = deleteButton.parentNode.parentNode;
    p.parentNode.removeChild(p);
    saveGymTaskList();
}
// remove completed tasks
function removeCompletedTasks()
{
    var table = document.getElementById("dataTable");
    var rowCount = table.rows.length;
 
    // loop through all rows of the table
    for(var i = 0; i < rowCount; i++)
    {
        // if the checkbox is checked, delete the row
        var row = table.rows[i];
        var chkbox = row.cells[0].childNodes[0];
        if(null != chkbox && true == chkbox.checked)
        {
            table.deleteRow(i);
            rowCount--;
            i--;
        }
    }
 
    // save the gym-task list
    saveGymTaskList();
 
    alert("Completed have been successfully removed.");
}
// save the gym-task list
function saveGymTaskList()
{
    var gymtaskArray = {};
    var checkBoxState = 0;
    var textValue = "";
 
    var table = document.getElementById("dataTable");
    var rowCount = table.rows.length;
 
    if (rowCount != 0)
    {
        // loop through all rows of the table
        for(var i=0; i<rowCount; i++)
        {
            var row = table.rows[i];
 
            // determine the state of the checkbox
            var chkbox = row.cells[0].childNodes[0];
            if(null != chkbox && true == chkbox.checked)
            {
                checkBoxState = 1;
            }
            else
            {
                checkBoxState= 0;
            }
 
            // retrieve the content of the gym-task
            var textbox = row.cells[1].childNodes[0];
            textValue = textbox.value;
 
            // populate the array
            gymtaskArray["row" + i] =
            {
                check : checkBoxState,
                text : textValue
            };
        }
    }
    else
    {
        gymtaskArray = null;
    }
 
    // use the local storage API to persist the data as JSON
    window.localStorage.setItem("gymtaskList", JSON.stringify(gymtaskArray));
}
// load the gym-task list
function loadGymTaskList()
{
    // use the local storage API load the JSON formatted gym-task list, and decode it
    var theList = JSON.parse(window.localStorage.getItem("gymtaskList"));
 
    if (null == theList || theList == "null")
    {
        deleteAllRows();
		alert("You have no current tasks saved.");
    }
    else
    {
        var count = 0;
        for (var obj in theList)
        {
            count++;
        }
 
        // remove any existing rows from the table
        deleteAllRows();
 
        // loop through the gym-tasks
        for(var i = 0; i < count; i++)
        {
            // adding a row to the table for each one
            addTableRow(theList["row" + i], true);
        }
    }
}
// delete all the rows
function deleteAllRows()
{
    var table = document.getElementById("dataTable");
    var rowCount = table.rows.length;
 
    // loop through all rows of the table
    for(var i = 0; i < rowCount; i++)
    {
        // delete the row
        table.deleteRow(i);
        rowCount--;
        i--;
    }
 
    // save the gym-task list
    saveGymTaskList();
}