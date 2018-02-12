'use strict';

(function () {
     google.charts.load('current', {'packages':['corechart']});
     
    var id = window.location.href.split("/")[5];
    var apiUrl = appUrl + '/polls/get/info/'+id;
    var submitButton = document.querySelector("#submit-button");
    var addOptionButton;
     var optionAddModalButton = null;
     var optionRemoveModalButton = null;
    var addOptionsNum = 1;
    var user;
    var poll;
    
   function renderPoll (data) {
     
        data = JSON.parse(data);
        user = data.user;
        poll = data.poll;
        $("h2").text(poll.question);
        $("p").text("by "+poll.name);
        for(var i = 0; i<poll.options.length; i++){
            if(poll.options[i].votes > 0){
                google.charts.setOnLoadCallback(createChart);
                break;
            }
        }
        if(user){
            
             addOptionSetup();
        }
        $("h2").text(poll.question);
        $("p").text("by "+poll.name);
   }
  
    function addOptionSetup(){
        addOptionButton = document.querySelector("#add-option");
        addOptionButton.addEventListener("click", function(){
           //console.log("Modal clicked");
           $("#optionModal").modal();
           if(optionAddModalButton == null){
                optionAddModalButton = document.querySelector("#add-nop-button");
                optionAddModalButton.addEventListener("click", function() {
                    addOptionsNum++;
                    var newOp = '<div id="nop'+addOptionsNum+'" class="form-group">\
        	                        <label>New Option choice #'+addOptionsNum+'</label>\
        	                        <input type="text" class="form-control option" name="newoptions">\
        	                    </div>';
        	        $("#nop"+(addOptionsNum-1)).after(newOp);
                });
           }
           if(optionRemoveModalButton == null){
                optionRemoveModalButton = document.querySelector("#remove-nop-button");
                optionRemoveModalButton.addEventListener("click", function() {
                     if(addOptionsNum>1){
                         $("#nop"+(addOptionsNum)).remove();
                         addOptionsNum--;
                     } 
                });   
           }
        });
    }
    
    submitButton.addEventListener("click", function(){
       var radios = document.getElementsByName('optionsRadio'); 
       for(var i =0; i<radios.length; i++){
           if(radios[i].checked){
                var xhr = new XMLHttpRequest();
                var endpoint = appUrl +"/polls/add/info/"+id;
                xhr.open("POST", endpoint, true);
                xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                      console.log(xhr.response); //Outputs a DOMString by default
                       window.location.replace(appUrl + "/polls/get/"+ id);
                    }
                }
                xhr.send(JSON.stringify({
                    poll : poll,
                    choice: radios[i].value
                    
                }));
                break;
           }
       }
    });
 
    function createChart(){
         var votesData = [["Votes", "votes by opyion"]];
         for(var i = 0; i < poll.options.length; i++){
             var optionData = [poll.options[i].option, poll.options[i].votes];
             votesData.push(optionData);
         }
         var data = google.visualization.arrayToDataTable(votesData);

        var options = {
          title: 'Poll Results',
          backgroundColor: '#d8f0ff'
        };

        var chart = new google.visualization.PieChart(document.getElementById('google-chart'));

        chart.draw(data, options); 
        
    }
   
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, renderPoll));

  
})();
