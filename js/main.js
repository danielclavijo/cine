var apiData = [];
var votingInfo = [];
var $loading = $("#spinnerDiv").hide();
var chart;
var seats = [];
var price = 0;
var seatsBuying = 0;
var id = 0;
var options = {
    title: 'Votos por película',
    is3d : 'true',
    chartArea: {left:10,top:40,width:'100%',height:'100%'}
}

var svgBlank = (
    '<div class="seat-wrapper">' +
    '<svg class="blank" height="24" viewBox="0 0 24 24" width="24" xmlns=\
    "http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
    </svg>' +
    '</div>'
);

var svgSeat = (
    '<div class="seat-wrapper">' +
    '<svg class="seat" fill="rgb(0, 148, 100)" height="24" \
    viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" \
    xmlns:xlink="http://www.w3.org/1999/xlink">\
    <defs><path d="M0 0h24v24H0V0z" id="a"/></defs>\
    <clipPath id="b"> <use overflow="visible" xlink:href="#a"/></clipPath>\
    <path clip-path="url(#b)" d="M4 18v3h3v-3h10v3h3v-6H4zm15-8h3v3h-3zM2 \
    10h3v3H2zm15 3H7V5c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v8z"/>\
    </svg>' +
    '</div>'
);


$(document).ready(function(){

    seatingInfo();

    loadMovies();

    $("#hourForm").on('change',function(){
        var seatsOfMovie = seats[+id];

        if($("#hourForm").val() == "1"){
            seatsOfMovie = seatsOfMovie["hora1"];
        }
        if($("#hourForm").val() == "2"){
            seatsOfMovie = seatsOfMovie["hora2"];
        }

        var seatsTemp = $(".seat");
        seatsTemp.removeClass('unavailable buying');
        for(var i = 0; i < seatsOfMovie.length; i++){
                seatsTemp.eq(seatsOfMovie[i]).addClass('unavailable');
        }
    });
});

$(document).ajaxStart(function(){ $loading.show();})
        .ajaxStop(function(){ $loading.hide();});

function loadMovies(){
    $.ajax({url: "https://gateway.marvel.com:443/v1/public/comics?formatType=collection&noVariants=false&limit=10&apikey=e79c536b35f3ade7b2196c7d7428618a",
        dataType: "json",
        success: function(result){

            apiData = result.data;

            for (var i = 0; i < 5; i++) {

                votingInfo.push([apiData.results[i].title]);

                var movieDiv = $("<div></div>",{'class': 'movie','id':'movie'+i}).appendTo("#movieWrapper")
                    .append($('<img>',{'src':  apiData.results[i].thumbnail.path + "." + apiData.results[i].thumbnail.extension,'class':'movie-img'}));

                    $("<div class='info-div' id='info" + i +"'><b>Título:</b> " + apiData.results[i].title +
                    "<br><br><b>Descripción:</b> " + apiData.results[i].description +
                    "</div>").addClass("movie-data").appendTo('#movie' + i);

                var movieButton = $("<div class='buy-button' id='button" + i +"'><img class='svg-icon' src='img/shopping-bag.svg'> <b>ELEGIR ASIENTO</b></div>").appendTo("#info" + i);

                $(movieDiv).appendTo("#movieWrapper").click(function(){
                    var $clicked = $(this).children().filter(".movie-data");
                    //esconder todos menos el elegido
                    $(".movie-data").not($clicked).hide();
                    $clicked.toggle("slow");
                });

                $(movieButton).click(function(){

                    id = $(this).attr('id').slice(-1);

                    var page = $("<div class='vote-page'><p><b>Comprar entradas para: </b>" + apiData.results[id].title + "</p>").appendTo("#movieWrapper");
                    $(page).prepend($("#closeButton"));
                    $("#closeButton").show().click(function(){$(".vote-page").hide("slow");});
                    $("#cine").show();
                    $("#cine").html("");
                    var cinema = $("#cine");

                    $("#hourWrapper").show().appendTo(page);

                    cinema.appendTo(page);

                    var pasillos = [4, 9];

                    var index = 1;
                    for(var i = 0; i < 3; i++){
                        for(var j = 0; j < 14; j++){
                            if(pasillos.indexOf(j) !== -1){
                                cinema.append(svgBlank);
                            } else{
                                $(svgSeat).attr('id', index).appendTo(cinema);
                                index++;
                            }
                        }
                        cinema.append("<br></br>");
                    }

                    $(".seat-wrapper").click(function(){
                        if($("#hourForm").val() != null){
                            var seat = $(this).find('.seat');
                            if(seat.hasClass('unavailable')){
                                alert("Este sitio ya está ocupado");
                            } else {
                                seat.toggleClass('buying');
                                seatsBuying = $(".buying").length;
                                price = seatsBuying * 6;
                                $("#numBuying").text(seatsBuying);
                                $("#priceBuying").text(price);
                            }
                        } else{
                            alert("Eliga una hora");
                        }
                    });

                    var loginButton = $("<div class='buy-button'><b>PROCEDER AL PAGO</b></div>").appendTo(page);

                    $(loginButton).click(function(){
                        if(seatsBuying > 0){
                            $(".info-div").hide("slow");
                            $(".vote-page").hide("slow");
                            var login = $("<div id='uiLogin' class='login-page'><p><b>Introduzca sus datos</b></p></div>").appendTo("#movieWrapper");

                            $("#uiLogin").show("slow");
                            $("#loginForm").appendTo(login);
                            $("#loginForm").show();
                            var uiBoton = $("<a class='waves-effect waves-light btn'>Comprar</a>").attr('id', id).appendTo(login);
                            uiBoton.click(function(){
                                var emailValidator = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                var name = $("#name").val();
                                var email = $("#email").val();
                                var address = $("#address").val();
                                var idMovie = $(this).attr('id');
                                if(name != "" && email != "" && emailValidator.test(email) == true && address != ""){
                                    $("#uiLogin").hide("slow");
                                    $(".info-div").hide("slow");
                                    $(".vote-page").hide("slow");
                                    alert("Ha comprado sus entradas con éxito");
                                } else{
                                    alert("Introduzca datos correctos");


                                }

                            });
                        } else{
                            alert("Debe comprar al menos 1 asiento");
                        }

                    });
                    //

                    /*var boton = $("<a class='waves-effect waves-light btn'>Comprar</a>").attr('id', id).appendTo(page);

                    boton.click(function(){
                        var emailValidator = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        var name = $("#name").val();
                        var email = $("#email").val();
                        var address = $("#address").val();
                        var idMovie = $(this).attr('id');
                        if(name != "" && email != "" && emailValidator.test(email) == true && address != ""){


                        }

                    });
                    //$("#closeButton").appendTo(page);

                    $("#loginForm").show();
                    */
                    page.toggle("slow");

                });
            }
    }});

}

function seatingInfo(){

    $.getJSON("data/seats.json", function(data){

        for(let key in data){
            if(data.hasOwnProperty(key)){
                seats.push(data[key]);
            }
        }


    });

}

function closeVoting(){
    $(".vote-page").hide("slow");
}
