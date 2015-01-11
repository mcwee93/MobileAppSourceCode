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
    var gymtasktable = document.getElementById("dataTable");
    var gymtaskRowCount = gymtasktable.rows.length;
    var gymtaskrow = gymtasktable.insertRow(gymtaskRowCount);
 
    var gymtaskcheckboxcell = gymtaskrow.insertCell(0);
    var gymtaskcheckbox = document.createElement("input");
    gymtaskcheckbox.type = "checkbox";
    gymtaskcheckbox.name = "gymtaskchkbox[]";
    gymtaskcheckbox.checked = gymtaskDictionary["check"];
    gymtaskcheckbox.setAttribute("onclick", "gymtaskcheckboxClicked()");
	gymtaskcheckbox.className = "gymtaskcheckbox";
    gymtaskcheckboxcell.appendChild(gymtaskcheckbox);
 
    var gymtasktextboxcell = gymtaskrow.insertCell(1);
    var gymtasktextbox = document.createElement("input");
    gymtasktextbox.type = "text";
    gymtasktextbox.name = "txtbox[]";
    gymtasktextbox.size = 16;
    gymtasktextbox.id = "text" + rowID;
    gymtasktextbox.value = gymtaskDictionary["text"];
    gymtasktextbox.setAttribute("onchange", "saveGymTaskList()");
	gymtasktextbox.className = "gymtasktextbox";
    gymtasktextboxcell.appendChild(gymtasktextbox);
 
    var gymtaskviewbuttoncell = gymtaskrow.insertCell(2);
    var gymtaskviewbutton = document.createElement("input");
    gymtaskviewbutton.type = "button";
    gymtaskviewbutton.id = rowID;
    gymtaskviewbutton.value = "View";
    gymtaskviewbutton.setAttribute("onclick", "viewSelectGymTaskRow(document.getElementById('text' + this.id))");
	gymtaskviewbutton.className = "gymtaskviewButton";
    gymtaskviewbuttoncell.appendChild(gymtaskviewbutton);

    var gymtaskdeletebuttoncell = gymtaskrow.insertCell(3);
    var gymtaskdeletebutton = document.createElement("input");
    gymtaskdeletebutton.type = "button";
    gymtaskdeletebutton.value = "Delete";
    gymtaskdeletebutton.setAttribute("onclick", "deleteSelectGymTaskRow(this)");
	gymtaskdeletebutton.className = "gymtaskdeleteButton";
    gymtaskdeletebuttoncell.appendChild(gymtaskdeletebutton);

    gymtaskcheckboxClicked();
    saveGymTaskList();
 
    if (!appIsLoading) alert("Your Gym-Task has been Added Successfully!");
}
function gymtaskcheckboxClicked()
{
    var gymtasktable = document.getElementById("dataTable");
    var gymtaskRowCount = gymtasktable.rows.length;
 
    for(var i = 0; i < gymtaskRowCount; i++)
    {
        var gymtaskrow = gymtasktable.rows[i];
        var gymtaskchkbox = gymtaskrow.cells[0].childNodes[0];
        var gymtasktextarea = gymtaskrow.cells[1].childNodes[0];
 
        if(null != gymtaskchkbox && true == gymtaskchkbox.checked)
        {
            if(null != gymtasktextarea)
            {		
                gymtasktextarea.style.setProperty("text-decoration", "line-through");
            }
        }

        else
        {
            gymtasktextarea.style.setProperty("text-decoration", "none");
        }
    }
    saveGymTaskList();
}
function viewSelectGymTaskRow(gymtaskTextField)
{
    alert(gymtaskTextField.value);
}
function deleteSelectGymTaskRow(deleteButton)
{
    var p = deleteButton.parentNode.parentNode;
    p.parentNode.removeChild(p);
    saveGymTaskList();
}
function removeCompletedTasks()
{
    var gymtasktable = document.getElementById("dataTable");
    var gymtaskRowCount = gymtasktable.rows.length;
 
    for(var i = 0; i < gymtaskRowCount; i++)
    {
        var gymtaskrow = gymtasktable.rows[i];
        var gymtaskchkbox = gymtaskrow.cells[0].childNodes[0];
        if(null != gymtaskchkbox && true == gymtaskchkbox.checked)
        {
            gymtasktable.deleteRow(i);
            gymtaskRowCount--;
            i--;
        }
    }
 
    saveGymTaskList();
 
    alert("Completed have been successfully removed.");
}
function saveGymTaskList()
{
    var gymtaskArray = {};
    var gymtaskcheckBoxState = 0;
    var gymtasktextValue = "";
 
    var gymtasktable = document.getElementById("dataTable");
    var gymtaskRowCount = gymtasktable.rows.length;
 
    if (gymtaskRowCount != 0)
    {
        for(var i=0; i<gymtaskRowCount; i++)
        {
            var gymtaskrow = gymtasktable.rows[i];
 
            var gymtaskchkbox = gymtaskrow.cells[0].childNodes[0];
            if(null != gymtaskchkbox && true == gymtaskchkbox.checked)
            {
                gymtaskcheckBoxState = 1;
            }
            else
            {
                gymtaskcheckBoxState= 0;
            }
 
            var gymtasktextarea = gymtaskrow.cells[1].childNodes[0];
            gymtasktextValue = gymtasktextarea.value;
 
            gymtaskArray["row" + i] =
            {
                check : gymtaskcheckBoxState,
                text : gymtasktextValue
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
    var thegymtaskList = JSON.parse(window.localStorage.getItem("gymtaskList"));
 
    if (null == thegymtaskList || thegymtaskList == "null")
    {
        deleteAllGymTaskRows();
		alert("You have no current tasks saved.");
    }
    else
    {
        var gymtaskCount = 0;
        for (var obj in thegymtaskList)
        {
            gymtaskCount++;
        }
 
        deleteAllGymTaskRows();
 
        for(var i = 0; i < gymtaskCount; i++)
        {
            addGymTaskTableRow(thegymtaskList["row" + i], true);
        }
    }
}
function deleteAllGymTaskRows()
{
    var gymtasktable = document.getElementById("dataTable");
    var gymtaskRowCount = gymtasktable.rows.length;
 
    for(var i = 0; i < gymtaskRowCount; i++)
    {
        gymtasktable.deleteRow(i);
        gymtaskRowCount--;
        i--;
    }
 
    saveGymTaskList();
}