'use strict';

(function () {
   
   var apiUrl = appUrl + '/navigation';

   function checkLoggedInStatus(data) {
      console.log(data);
        $(".container").before(data);
      
   }
    
  
    

    
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, checkLoggedInStatus));
   
  

   /*
   addButton.addEventListener('click', function () {

      ajaxFunctions.ajaxRequest('POST', apiUrl, function () {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);
   */

})();
