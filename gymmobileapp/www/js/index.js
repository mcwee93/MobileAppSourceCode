function createNewGymTask()
{
    var gymtaskDictionary = {};
	
    var gymtask = prompt("What new gym-task would you like to add?","");
    if (gymtask != null)
    {
        if (gymtask == "")
        {
            alert("The gym-task text box can not be empty when you hit submit");
        }
        else
        {
            gymtaskDictionary = { check : 0 , text : gymtask};
            addGymTaskTableRow(gymtaskDictionary, false);
        }
    }
}
var rowID = 0;
function addGymTaskTableRow(gymtaskDictionary, appIsLoading)
{
    rowID +=1;
    var table = document.getElementById("dataTable");
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
 
    var gymtaskcheckboxcell = row.insertCell(0);
    var gymtaskcheckbox = document.createElement("input");
    gymtaskcheckbox.type = "checkbox";
    gymtaskcheckbox.name = "chkbox[]";
    gymtaskcheckbox.checked = gymtaskDictionary["check"];
    gymtaskcheckbox.setAttribute("onclick", "gymtaskcheckboxClicked()");
	gymtaskcheckbox.className = "gymtaskcheckbox";
    gymtaskcheckboxcell.appendChild(gymtaskcheckbox);
 
    var gymtasktextboxcell = row.insertCell(1);
    var gymtasktextbox = document.createElement("input");
    gymtasktextbox.type = "text";
    gymtasktextbox.name = "txtbox[]";
    gymtasktextbox.size = 16;
    gymtasktextbox.id = "text" + rowID;
    gymtasktextbox.value = gymtaskDictionary["text"];
    gymtasktextbox.setAttribute("onchange", "saveGymTaskList()");
	gymtasktextbox.className = "gymtasktextbox";
    gymtasktextboxcell.appendChild(gymtasktextbox);
 
    var gymtaskviewbuttoncell = row.insertCell(2);
    var gymtaskviewbutton = document.createElement("input");
    gymtaskviewbutton.type = "button";
    gymtaskviewbutton.id = rowID;
    gymtaskviewbutton.value = "View";
    gymtaskviewbutton.setAttribute("onclick", "viewSelectedRow(document.getElementById('text' + this.id))");
	gymtaskviewbutton.className = "gymtaskviewButton";
    gymtaskviewbuttoncell.appendChild(gymtaskviewbutton);

    var gymtaskdeletebuttoncell = row.insertCell(3);
    var gymtaskdeletebutton = document.createElement("input");
    gymtaskdeletebutton.type = "button";
    gymtaskdeletebutton.value = "Delete";
    gymtaskdeletebutton.setAttribute("onclick", "deleteSelectedRow(this)");
	gymtaskdeletebutton.className = "gymtaskdeleteButton";
    gymtaskdeletebuttoncell.appendChild(gymtaskdeletebutton);

    gymtaskcheckboxClicked();
    saveGymTaskList();
 
    if (!appIsLoading) alert("Your Gym-Task has been Added Successfully!");
}
function gymtaskcheckboxClicked()
{
    var table = document.getElementById("dataTable");
    var rowCount = table.rows.length;
 
    for(var i = 0; i < rowCount; i++)
    {
        var row = table.rows[i];
        var chkbox = row.cells[0].childNodes[0];
        var textbox = row.cells[1].childNodes[0];
 
        if(null != chkbox && true == chkbox.checked)
        {
            if(null != textbox)
            {		
                textbox.style.setProperty("text-decoration", "line-through");
            }
        }

        else
        {
            textbox.style.setProperty("text-decoration", "none");
        }
    }
    saveGymTaskList();
}
function viewSelectedRow(gymtaskTextField)
{
    alert(gymtaskTextField.value);
}
function deleteSelectedRow(deleteButton)
{
    var p = deleteButton.parentNode.parentNode;
    p.parentNode.removeChild(p);
    saveGymTaskList();
}
function removeCompletedTasks()
{
    var table = document.getElementById("dataTable");
    var rowCount = table.rows.length;
 
    for(var i = 0; i < rowCount; i++)
    {
        var row = table.rows[i];
        var chkbox = row.cells[0].childNodes[0];
        if(null != chkbox && true == chkbox.checked)
        {
            table.deleteRow(i);
            rowCount--;
            i--;
        }
    }
 
    saveGymTaskList();
 
    alert("Completed have been successfully removed.");
}
function saveGymTaskList()
{
    var gymtaskArray = {};
    var checkBoxState = 0;
    var textValue = "";
 
    var table = document.getElementById("dataTable");
    var rowCount = table.rows.length;
 
    if (rowCount != 0)
    {
        for(var i=0; i<rowCount; i++)
        {
            var row = table.rows[i];
 
            var chkbox = row.cells[0].childNodes[0];
            if(null != chkbox && true == chkbox.checked)
            {
                checkBoxState = 1;
            }
            else
            {
                checkBoxState= 0;
            }
 
            var textbox = row.cells[1].childNodes[0];
            textValue = textbox.value;
 
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
 
    window.localStorage.setItem("gymtaskList", JSON.stringify(gymtaskArray));
}
function loadGymTaskList()
{
    var theList = JSON.parse(window.localStorage.getItem("gymtaskList"));
 
    if (null == theList || theList == "null")
    {
        deleteAllGymTaskRows();
		alert("You have no current tasks saved.");
    }
    else
    {
        var count = 0;
        for (var obj in theList)
        {
            count++;
        }
 
        deleteAllGymTaskRows();
 
        for(var i = 0; i < count; i++)
        {
            addGymTaskTableRow(theList["row" + i], true);
        }
    }
}
function deleteAllGymTaskRows()
{
    var table = document.getElementById("dataTable");
    var rowCount = table.rows.length;
 
    for(var i = 0; i < rowCount; i++)
    {
        table.deleteRow(i);
        rowCount--;
        i--;
    }
 
    saveGymTaskList();
}