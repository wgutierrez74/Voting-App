'use strict';

(function () {

   var apiUrl = appUrl + '/polls/all';

   function renderPolls (data) {
      
       data = JSON.parse(data);
       for(var i = 0; i<data.length; i++){
           var poll = "<div class='polls-cont well'><p><a id='poll-view' href='/polls/get/"+data[i]._id+"'> <h2>" + data[i].question + "</h2></a></p> <p>by "+data[i].name+"</p></div>";
           $("#poll-container").append(poll);
       }
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, renderPolls));

  
})();
