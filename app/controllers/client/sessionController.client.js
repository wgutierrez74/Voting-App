'use strict';

function share(poll){
      var link = encodeURIComponent('https://voting-app-wgutierrez74.c9users.io/polls/get/'+poll);
      var shareTweet = "https://twitter.com/intent/tweet?text="+link;
		window.open(shareTweet);
}

(function () {

   var titleName = document.querySelector('#user-title');
   var apiUrl = appUrl + '/api/user';
   var userObject;

   function setUpHomePage (data) {
      userObject = JSON.parse(data);
      titleName.innerHTML = userObject.first_name;

      
   }
   
   function jammer(){
      console.log("Jammer");
   }
   
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, setUpHomePage));

   /*
   addButton.addEventListener('click', function () {

      ajaxFunctions.ajaxRequest('POST', apiUrl, function () {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);
   */


})();
