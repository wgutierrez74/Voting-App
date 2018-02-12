'use strict';

(function () {
   
    //var apiUrl = appUrl + '/polls/get/info/'+id;
   
    var addOptionBtn = document.querySelector("#add-option");
    var numOptions =document.getElementsByClassName("option").length;
    console.log(numOptions);
    var removeOption = null;
   
   
    function addOption(){
       removeListener();
       numOptions++;
       var newOption = '<div id="op'+numOptions+'" class="form-group option"><label>Option #'+numOptions+'</label><input type="text" class="form-control" name="options"></div>';
       $("#op"+(numOptions-1)+"").after(newOption);
       
       
    };
    
    addOptionBtn.addEventListener('click', function () {
        addOption();
    });
    
    function removeListener(){
        if(removeOption == null){
            $("#add-option").after('<button type="button" id="remove-option" class="btn btn-warning">Remove Option</button>');
            removeOption=document.querySelector("#remove-option");
            removeOption.addEventListener("click", function(){
                $("#op"+numOptions).remove(); 
                numOptions--;
                if(numOptions <3){
                    $("#remove-option").remove();
                    removeOption = null;
                }
            });
        }
    }
    
    
   
   

  
})();