// jshint devel:true

var missileTime = 1500;
var score = 0;

var setArrows = function(){
  $("body").keydown(function(e) {
    if(e.keyCode == 37) { // left
      move('-');
    }
    else if(e.keyCode == 39) { // right
      move('+');
    }
  });
};

var move = function(sign){
  var $parent = $('#player').parent()[0];
  var dest = findDest(sign, $parent);
  if ((sign === '+' && dest < 3) || (sign === '-' && dest >= 0)){
    tableMove($('#player'), $('#b' + dest), 50);
  }
};

var findDest = function(sign, $place){
  return eval($place.id[1] + sign + '1');
};

var tableMove = function(item, dest, dur, callback){
  var oldOffset = item.offset();
  item.appendTo(dest);
  var newOffset = item.offset();
  var temp = item.clone().appendTo('body');
  temp.css({
      'position': 'absolute',
      'left': oldOffset.left,
      'top': oldOffset.top,
      'z-index': 1000
  });
  item.hide();
  temp.animate({
    left: newOffset.left,
    top: newOffset.top
  }, dur, 'linear', function(){
    item.show();
    temp.remove();
    if (callback) {
      callback(item);
    }
  });
};

var fire = function(){
  var newItem = $('<div>');
  newItem.addClass('missile');
  var dest = pickDest();
  $('#t1').append(newItem);
  tableMove(newItem, dest, missileTime, bounceback);
};

var pickDest = function(){
  var col = Math.random() * 3;
  col = Math.floor(col);
  return $('#m' + col);
};

var bounceback = function(item){
  updateScore();
  if (missileTime > 350){
    missileTime -= (missileTime * 0.05);
  }
  if (checkBounce(item)) {
    tableMove(item, $('#t1'), missileTime, goAgain);
  } else {
    endGame();
  }
};

var updateScore = function(){
  score += Math.trunc((1600 - missileTime)/2);
  var output = score.toString();
  while (output.length < 5){
    output = '0' + output;
  }
  $('#score').html(output);
};

var checkBounce = function(item){
  var $missileParent = item.parent()[0].id[1];
  var $playerParent = $('#player').parent()[0].id[1];
  return $missileParent === $playerParent;
};

var goAgain = function(item){
  item.remove();
  fire();
};

var endGame = function(){
  $('.missile').remove();
  $('body').unbind();
  var newItem = $('<div>');
  newItem.addClass('greyOut');
  $('#field').append(newItem);
};

$(document).ready(function(){
  setArrows();
  fire();
});
