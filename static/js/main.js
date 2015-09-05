development=true

function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}
var name=randomString(Math.floor(Math.random()*15)+10);
localStorage.setItem(getName(),false);
function storage_handler(evt)
{
  if(evt.newValue){
    localStorage.setItem(evt.key,evt.oldValue);
    authorize();
  }
}

window.addEventListener('storage', storage_handler, false);

function newName(){
  name=randomString(Math.floor(Math.random()*15)+10);
}
function getName(){
  return name;
}
function authorize(){

  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: "/authorize",
    success: function (data) {
      console.log("Authorizing");
      $('#event').html('<h3>Authorizing...</h3><h4>P.S. You will need to allow this popup to authorize you.</h4>');
      if(data['url']){
        console.log("Going to url: "+data["url"]);
        localStorage.setItem(getName(),false);
        window.open(data["url"]);
      }
      else{
        console.log("Success: "+data['success']+" url: "+data["url"]);
        send();
      }
    },
    data: JSON.stringify({id:name}),
    dataType: "json",
    error: function (xhr, ajaxOptions) {
         $('#event').html('<h3>Ooopps, got an error...</h3>');
         if(development){
           console.log(xhr.status);
           console.log(xhr.responseText);
         }
         // console.log(thrownError);
    }
  });
}

function send() {

        var datas = {
            startTime: "",
            endTime:"",
            numberOfEvents:10,
        };

        $('#event').html('<h3>Processing...</h3>');

        $.ajax({
              type: "POST",
              contentType: "application/json; charset=utf-8",
              url: "/magic",
              data: JSON.stringify(datas),
              success: function (data) {
                $('#event').html('');
                for(var summary of data["events"]){
                    $('#event').prepend('<h3>'+summary+'</h3>');
                    localStorage.removeItem(getName());
                    newName();
                }
                if(data["error"]!="None"){
                    if(data["error"]=="Access Token Error"){
                      send();
                      return;
                    }
                    $('#event').prepend('<h3>Got an error: '+data["error"]+'! Please try again.</h3>');
                    localStorage.removeItem(getName());
                    newName();
                }
              },
              dataType: "json",
              error: function (xhr, ajaxOptions) {
                   $('#event').html('<h3>Ooopps, got an error...</h3>');
                   if(development){
                     console.log(xhr.status);
                     console.log(xhr.responseText);
                   }
                   // console.log(thrownError);
       }
        });
    };

$(document).ready(function(){
  console.log("My body is ready...");
    $("#events").click(function(){
        console.log("Clicked");
        authorize();
    });
});





























