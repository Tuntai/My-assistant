var mapArr = [];
var lastId = 0;
var curEditRow;
var curEditRowId;
$(function(){
  $("#dueDate").datepicker();
  $("#editdueDate").datepicker();
  if (typeof(Storage) !== "undefined") {
  var taskStr = localStorage.getItem("taskList");
  lastId = localStorage.getItem("lastId");
   // console.log(taskStr);
    var tasks = $.parseJSON(taskStr);
    if(tasks != null && tasks != undefined){
      mapArr = tasks;
      for(var i=0; i<tasks.length;i++)
      {
        displayTask(tasks[i]);
      }
    }
  }
  $("#pushTask").on("click", function(){
    if (formValid()){
    var map = {};
    map["id"] = ++lastId;
    map["dueDate"] = $("#dueDate").val();
    map["status"] = $("#status").val();
    map["priority"] = $("#priority").val();
    map["createdAt"] = getCurrentTime();
    mapArr.push(map);
    //console.log(map);
    resetFields();
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem("taskList", JSON.stringify(mapArr));
      localStorage.setItem("lastId", lastId);
    }
    displayTask(map);
    }
  });
  
  function formValid(){
    if ($("#dueDate").val() != "")
      if ($("#status").val() != "")
        if ($("#priority").val() != "")
          return true;
    alert("Please fill the details !");
    return false;
  }
  
  function removeLocalObject(idNo){
    var taskStr = localStorage.getItem("taskList");
    var tasks = $.parseJSON(taskStr);
    var index = -1;
    if (tasks != null && tasks != undefined){
      for (var i=0; i<tasks.length; i++){
        if(tasks[i]["id"] == idNo){
          index = i;
        }
      }
      tasks.splice(index,1);
      localStorage.setItem("taskList", JSON.stringify(tasks));
      mapArr = tasks;
    }
  }
  
  function displayTask(map){
    var container = document.querySelector("#tasksTable tbody");
    var row = document.createElement("tr");
    var cell1 = document.createElement("td");
    cell1.innerText = map["dueDate"];
    cell1.setAttribute("data-id", "dueDate");
    var cell2 = document.createElement("td");
    cell2.innerText = map["status"];
    cell2.setAttribute("data-id", "status");
    var cell3 = document.createElement("td");
    cell3.innerText = map["priority"];
    cell3.setAttribute("data-id", "priority");
    var cell4 = document.createElement("td");
    cell4.innerText = map["createdAt"];
    cell4.setAttribute("data-id", "createdAt");
    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);
    row.appendChild(cell4);
    
    var opCell = document.createElement("td");
    var edit = document.createElement("i");
    var del = document.createElement("i");
    edit.id = "edit"+map["id"];
    del.id = "del"+map["id"];
    edit.setAttribute("data-toggle","modal");
    edit.setAttribute("data-target","#myModal");
   
    del.className = "fa fa-times opTask cursorPointer";
    edit.className = "fa fa-pencil-square-o  opTask cursorPointer"
    opCell.appendChild(edit);
    opCell.appendChild(del);
    row.appendChild(opCell);
    container.appendChild(row);
    
    bindEvents(del, edit);
    
    if(!$(".no-records-found").hasClass("noneDisplay")){
      $(".no-records-found").addClass("noneDisplay");
    }
  }
  
  
  
  function bindEvents(del, edit){
    $(del).on("click", function(){
      if ($(this).parent().parent().parent().length >= 1){
       // $(".no-records-found").removeClass("noneDisplay");
      }
      var id = $(this).attr("id");
      removeLocalObject(parseInt(id.substr(3)));
      $(this).parent().parent().remove();
    });
    
    
    $(edit).on("click", function(){
      curEditRow = $(this).parent().parent();
      $("td",curEditRow).each(function(){
       var id  = $(this).attr("data-id");
        $("#edit"+id).val($(this).text());
      });
      //curRow.remove(); 
      curEditRowId = parseInt($(this).attr("id").substr(4));
    });
 }
   
    
    function findObjfromId(idNo){
      var obj = {};
       for (var i=0; i<mapArr.length; i++){
        if(mapArr[i]["id"] == idNo){
          obj = mapArr[i];
        }
      }
      return obj;
    }
    
   
    
  
  
  function resetFields(){
    $("#dueDate").val("");
    $("#status").val("");
    $("#priority").val("");
  }

  function getCurrentTime(){
  var d = new Date(),
      h = (d.getHours()<10?'0':'') + d.getHours(),
      m = (d.getMinutes()<10?'0':'') + d.getMinutes();
    return h + ':' + m;
  }
  
  
 
  
   $("#editSave").on("click", function(){
      var map = {};
      map["id"] = ++lastId;
    map["dueDate"] = $("#editdueDate").val();
    map["status"] = $("#editstatus").val();
    map["priority"] = $("#editpriority").val();
      var obj = findObjfromId(curEditRowId);
      map["createdAt"] = obj["createdAt"];
      removeLocalObject(curEditRowId);
      mapArr.push(map);
      localStorage.setItem("taskList", JSON.stringify(mapArr));
      localStorage.setItem("lastId", lastId);
      curEditRow.remove();
      displayTask(map);
    });
  
});