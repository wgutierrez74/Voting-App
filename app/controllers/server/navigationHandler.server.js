
var methods = {};


methods.setup = function(req, res){
    if(req.isAuthenticated()){
        var loggedInText = '\
            <nav class="navbar navbar-inverse navbar-fixed-top">\
                <div class="container-fluid">\
                    <div class="navbar-header">\
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">\
                            <span class="icon-bar"></span>\
                            <span class="icon-bar"></span>\
                            <span class="icon-bar"></span>\
                        </button>\
                        <a class="navbar-brand" href="#">VoteMe</a>\
                    </div>\
                    <div class="collapse navbar-collapse" id="myNavbar">\
                        <ul class="nav navbar-nav">\
                          <li><a id="nav-session" href="/home">Home</a></li>\
                          <li><a href="/polls">Polls</a></li>\
                          <li><a href="/polls/create">Create</a></li>\
                        </ul>\
                        <ul class="nav navbar-nav navbar-right">\
                          <li><a id="nav-profile" href="#">'+ req.user.first_name +'</a></li>\
                          <li><a id="nav-logout" href="/logout">Logout</a></li>\
                        </ul>\
                    </div>\
                </div>\
            </nav>\
        ';
        res.send(loggedInText);
    }
    else{
       var loggedOutText = '\
            <nav class="navbar navbar-inverse navbar-fixed-top">\
                <div class="container-fluid">\
                    <div class="navbar-header">\
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">\
                        <span class="icon-bar"></span>\
                        <span class="icon-bar"></span>\
                        <span class="icon-bar"></span>\
                    </button>\
                        <a class="navbar-brand" href="#">VoteMe</a>\
                    </div>\
                    <div class="collapse navbar-collapse" id="myNavbar">\
                    <ul class="nav navbar-nav">\
                        <li class="active"><a id="nav_welcome" href="/">Welcome</a></li>\
                        <li><a href="/polls">Polls</a></li>\
                    </ul>\
                    <ul class="nav navbar-nav navbar-right">\
                        <li><a href="/"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>\
                        <li><a href="/register"><span class="glyphicon glyphicon-user"></span> Sign Up</a></li>\
                    </ul>\
                    </div>\
                </div>\
            </nav>\
        ';
        res.send(loggedOutText);
    }
};





module.exports = methods;