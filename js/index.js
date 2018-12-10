// JavaScript Document
$(document).ready(function () {

  var x = "x"
  var o = "o"
  var count = 0;
  var o_win = 0;
  var x_win = 0;
  var o_arr = [];
  var x_arr = [];
  var base_number = 3; //start with 3
  var base = []; //[1,2,3]
  var base_r = []; //[3,2,1]
  //coordinates for the two diagnals
  var diag_ns = []; //["11", "22", "33"] 
  var diag_sn = []; //["31", "22", "13"]


  var overlayMsg = {

    show: (msg) => {

      $('#game').hide();
      $('#overlayText').html(msg);
      $('#overlayPad').css('display', 'flex');
      if(window.navigator.vibrate!==undefined)
          window.navigator.vibrate(200);
    },

    hide: () => {

      $('#overlayPad').hide();
      $('#overlayText').html('');
      $('#game').css('display', 'flex');

    }


  }


  initialization();

  $('#gameScale').on('change', function (event) {

    var size = parseInt($(this).val());

    base_number = size; //change the base number;

    setGamePad(size);
    initialization(); // reinitialze the game parameters;
    hardReset();

  })


  $('#themeChanger').click(function(){

    if($(this).hasClass('dark--theme'))
     {
      less.modifyVars({'@mainBgColor':'rgba(4, 4, 4, 0.7)'}); // change the mainBgColor
      $(this).addClass('fa-sun light--theme').removeClass('fa-cloud-moon dark--theme').attr('title', 'Light Theme');
     } else if($(this).hasClass('light--theme'))
     {
      less.modifyVars({'@mainBgColor':'#eee'}); // change the mainBgColor
      $(this).addClass('fa-cloud-moon dark--theme').removeClass('fa-sun light--theme').attr('title', 'Dark Theme');
     }


  });


  $("#reset").click(function () {

    softReset();


  });


  function initialization() {


    initConstantArray(); //initialze constant array for winner check use
    setGamePad(base_number); //Initialize game pad
    bindGamePadClick(); // bind the gamepad button clicks

  }


  function initConstantArray() {

    diag_ns = []; // reset diagnal array
    diag_sn = [];

    base = _.range(1, base_number + 1);
    base_r = base.slice().reverse();

    _.zip(base, base).forEach((item) => {

      diag_ns.push(item.join(''));

    })

    _.zip(base_r, base).forEach((item) => {

      diag_sn.push(item.join(''));

    })

  }


  function checkHorizontalVertical(d) {

    //find the largest count of repeated row or column, check if it is greater than the base size.
    //ex: check if it takes all 3 numbers in a single row or column for 3x size

    let temp = Object.values(_.countBy(d)); //get counts of different rows

    if (temp.sort((a, b) => (b - a))[0] >= base.length) //sort by reverse order
      return true;
    else
      return false;

  }

  function checkDiagonals(cols, rows) {

    let matrix = [];

    _.zip(cols, rows).forEach(item => {

      matrix.push(item.join(''));

    });

    console.log(matrix);

    //if it contains all points on either of diagnals: ["11", "22", "33"] or ["31", "22", "13"], return true
    if (diag_ns.every(item => matrix.includes(item)) == true || diag_sn.every(item => matrix.includes(item)) == true)
      return true;
    else
      return false;

    //console.log(cols, rows);


  }

  function softReset() {

    count = 0;
    o_arr = [];
    x_arr = [];
    overlayMsg.hide();
    $("#game li").text("").removeClass('disable o x');
    $('#statusText').html('<b>X</b> \'s Turn');

  }

  function hardReset() {

    softReset();
    o_win = 0;
    x_win = 0;
    $('#oScore').text('-');
    $('#xScore').text('-');

  }

  function setGamePad(size) {


    var ratio = Math.floor(100 / size);
    var fontSize = (36 / size).toFixed(2) + 'rem';
    var elems = document.getElementById('game');

    elems.innerHTML = '';

    for (var i = 1; i <= size; i++) {

      for (var j = 1; j <= size; j++) {

        var item = document.createElement('li');

        item.setAttribute('class', 'btn btn-game');
        item.setAttribute('data-row', i);
        item.setAttribute('data-column', j);
        item.setAttribute('style', `width:${ratio}%;height:${ratio}%;font-size:${fontSize}`);
        item.innerHTML = '';
        elems.appendChild(item);

      }

    }

  }


  function bindGamePadClick() {


    $('#game li').click(function () {

      if ($(this).hasClass('disable'))
      {

        if(window.navigator.vibrate!==undefined)
             window.navigator.vibrate(200);
       
        $(this).addClass('alert');

        setTimeout(()=>$(this).removeClass('alert'), 200);

           //  alert('Slot already selected');
      }


      else {

        count++;

        //get col, row  data matrix

        if (count % 2 == 0) {
          $(this).text(o).addClass('disable o');
          o_arr.push($(this).data());

          let cols = _.pluck(o_arr, 'row');
          let rows = _.pluck(o_arr, 'column');

          console.log(cols, rows);

          if (cols.length < base_number) //no need to check winner if count number < base_number
          {
            $('#statusText').html('<b>X</b> \'s Turn');
            $('#o_win').removeClass('active');
            $('#x_win').addClass('active');
          } else {

            //check if anyone wins
            if (checkHorizontalVertical(cols) == true || checkHorizontalVertical(rows) == true || checkDiagonals(cols, rows) == true)

            {
              overlayMsg.show("<span style='color:khaki'>O</span> Wins!");
              o_win++;
              $('#oScore').text(o_win);
              $('#statusText').html('Game Over, <b>O</b> wins!')
            }

            // if no one wins, check if game draws
            else if (count >= (Math.pow(base_number, 2)))

            {

              $('#statusText').html('Game Over, <b>OX</b> Draws!')
              overlayMsg.show("<span style='color:white'>O</span><span style='color:khaki'>X</span> Draw!");

            } else {
              $('#statusText').html('<b>X</b> \'s Turn');
              $('#o_win').removeClass('active');
              $('#x_win').addClass('active');
            }

          }



        } else {

          $(this).text(x).addClass('disable x');
          x_arr.push($(this).data());

          let cols = _.pluck(x_arr, 'row');
          let rows = _.pluck(x_arr, 'column');

          if (cols.length < base_number) //no need to check winner if count number < base_number
          {
            $('#statusText').html('<b>O</b> \'s Turn');
            $('#x_win').removeClass('active');
            $('#o_win').addClass('active');

          } else {

            if (checkHorizontalVertical(cols) == true || checkHorizontalVertical(rows) == true || checkDiagonals(cols, rows) == true) {

              overlayMsg.show("<span style='color:khaki'>X</span> Wins!");
              x_win++;
              $('#xScore').text(x_win);
              $('#statusText').html('Game Over, <b>X</b> Wins!');

            } else if (count >= (Math.pow(base_number, 2))) {
              softReset();
              overlayMsg.show("<span style='color:white'>O</span><span style='color:khaki'>X</span> Draw!");

            } else {
              $('#statusText').html('<b>O</b> \'s Turn');
              $('#x_win').removeClass('active');
              $('#o_win').addClass('active');

            }

          }

        }
      }


    });


  }
});