var main = document.getElementById('main-container');
var colors = ['rgba(0, 165, 191, 0.5)', 'rgba(0, 110, 127, 0.5)', 'rgba(0, 221, 255, 0.5)', 'rgba(0, 55, 64, 0.5)', 'rgba(0, 199, 229, 0.5)', 'rgba(27,120,127,0.5)'];
var prevLine = [];
var current;
var rows = 5;
var columns = 6;
var usedBoxes = [];

var xmlhttp = new XMLHttpRequest();
var url = "generated.json";
var articles = []; 
xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        articles = JSON.parse(xmlhttp.responseText);
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

for(var i = 0; i < rows; i++) {
	var obox = document.createElement('div');
	var line = [];
	copyOfColors = colors.slice();
	obox.classList.add('obox');
	main.appendChild(obox);
	for(var j = 0; j < columns; j++) {
		var ibox = document.createElement('div');
		var flipper = document.createElement('div');
		var front = document.createElement('div');
		var back = document.createElement('div');
		ibox.classList.add('ibox');
		flipper.classList.add('flipper');
		front.classList.add('front');
		back.classList.add('back');

		color = getRandomColor();
		front.style.background = color;
		
		obox.appendChild(ibox);
		ibox.appendChild(flipper);
		flipper.appendChild(front);
		flipper.appendChild(back);
		
	}
	prevLine.push(line);
}

function getRandomColor() {
	var _randomNumber = Math.round(Math.random()*(copyOfColors.length-1));
	var _color;	
	if (prevLine.length > 0) {
		if (j == 0) {
			_color = prevLine[i-1][5];
			_randomNumber = copyOfColors.indexOf(prevLine[i-1][5]);
		}
 		else if ( j > 0 && prevLine[i-1][j] === copyOfColors[_randomNumber] ) {
	 		if (_randomNumber < copyOfColors.length-1 ) {
				_color = copyOfColors[_randomNumber += 1];
			}
			else if (copyOfColors.length != 1){
				_color = copyOfColors[_randomNumber -= 1];
			}
		}
		else {
			_color = copyOfColors[_randomNumber];
		}
	} else {
		_color = copyOfColors[_randomNumber];
	}
	line.push(copyOfColors[_randomNumber]);
	copyOfColors.splice(_randomNumber, 1);

	return _color;
}

var boxes = document.getElementsByClassName('ibox');
var flippers = document.getElementsByClassName('flipper');
var fronts = document.getElementsByClassName('front');
var backs = document.getElementsByClassName('back');

for(var i = 0; i < boxes.length; i++) {
	let _delay = Math.round(Math.random()*(boxes.length));
	
	boxes[i].style.opacity = '0';
	setTimeout(showBox, _delay*100, i);
}

function showBox(i) {
	boxes[i].style.transition = "opacity 0.5s linear 0s";
	boxes[i].style.opacity = '1';
	flippers[i].style.height = boxes[i].offsetHeight+'px';
	fronts[i].style.width = boxes[i].offsetWidth+'px';
	fronts[i].style.height = boxes[i].offsetHeight+'px';
	backs[i].style.width = boxes[i].offsetWidth+'px';
	backs[i].style.height = boxes[i].offsetHeight+'px';
}
var mainContent = document.getElementById('main-content');
mainContent.style.width = boxes[0].offsetWidth*2+'px';
mainContent.style.height = boxes[0].offsetHeight*2+5+'px';
mainContent.style.top = boxes[0].offsetHeight*2+'px';

/*
* Search
*/

document.getElementById('search').addEventListener('input', function(e) {
	var results = getObjects(articles, '', e.target.value);
	if (results.length > 0 && e.target.value != "") {
		if (usedBoxes.length > 0) {
			for(var i = 0; i < usedBoxes.length; i++) {
				if (flippers[usedBoxes[i]] != undefined) {
					flippers[usedBoxes[i]].style.transform = 'rotateY(0deg)';
				}
			}
		}
		usedBoxes = [];
		for(var i = 0; i < results.length; i++) {
			var _flipperObj = getRandomFlipper();
			usedBoxes.push(_flipperObj.randomNumber);
			var _body = results[i].body
			_body = _body.substring(0,140)+'...';
			_flipperObj.flipper().getElementsByClassName('back')[0].innerHTML = '<h1>'+results[i].headline+'</h1>'+
																				'<p>'+_body+'</p>'+
																				'<p>Author: '+results[i].first +' '+ results[i].last+'</p>';
			_flipperObj.flipper().style.transition = 'transform .6s';
			_flipperObj.flipper().style.transitionDelay = '.'+Math.round(Math.random()*results.length)+'s';
			_flipperObj.flipper().style.transform = 'rotateY(180deg)';
		}
	} else if (e.target.value == "" || results.length == 0) {
		if (usedBoxes.length > 0) {
			for(var i = 0; i < usedBoxes.length; i++) {
				flippers[usedBoxes[i]].style.transform = 'rotateY(0deg)';
			}
		}
		usedBoxes = [];
	}
	console.log(getObjects(articles, '', e.target.value));
});

function getRandomFlipper() {
	var _obj = {
		randomNumber: Math.round(Math.random()*flippers.length),
		flipper: function() {
			return flippers[this.randomNumber];
		}
	};
	return _obj;
}

function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));    
        } else 
       
        var re = new RegExp(val,'i');
       
        var found;
        if (re != undefined) {
        	 console.log(re);
         	found = re.test(obj[i]);
         } 
        
        if (i == key && found || i == key && val == '') { //
            objects.push(obj);
        } else if (found && key == ''){
            
            if (objects.lastIndexOf(obj) == -1){
                objects.push(obj);
            }
        }
    }
    return objects;
}


