let lines = [], //parag 
	carry = [], //words
	tLifts = [],
	shouldScroll = true,
	chunk = 4,
	speed = 9; //has to be mapped across maybe 1-100

const	width = 800,
	height = 300;

let input, tArea, tCurrent, tDivs=[];

function setup() {
	//setup
	createCanvas(width, height);
	background(30);
	textSize(35);
	fill(230, 230, 250);
	text(["parsing "+chunk+" words at speed = "+speed],50,150);
	frameRate(speed);
	let clear = createButton('clear');
	clear.mousePressed(()=>{
		lines = [];
		carry = [];
	});

	tArea = createDiv('');
	// tArea = createSpan("<div frameborder=0 scrolling=\"yes\" height=200 width="+str(width)+"></iframe>");
	tArea.id('scrollbox');

	let demo = createButton('long demo');
	demo.mousePressed(()=>{loadStrings('files/bible.txt',(res, err)=>{spreed(res)})});

	input = createInput('paste here', 'string');

	let readButton = createButton('spreed!');
	readButton.mousePressed(() => {
		spreed(input.value());
		input.value('');
	});

	let fileSelect = createFileInput(gotFile);

	tCurrent = createP('');
	
	//position
	demo.position(10, height+10);
	fileSelect.position(demo.x+demo.width+10, height+10);
	input.position(fileSelect.x+fileSelect.width, fileSelect.y);
	readButton.position(input.x+input.width, input.y);
	clear.position(readButton.x+readButton.width, readButton.y)
	tArea.position(10, demo.y+demo.height+10);
	tCurrent.position(tArea.x, tArea.y+tArea.height);
}

function mouseDragged() {
  noLoop();
}
function mousePressed() {
  noLoop();
}

function mouseReleased() {
  loop();
}

function gotFile(file) {
	let fileDiv = createDiv(file.name+' '+file.type+' '+file.subtype+' '+file.size+' bytes');
	tArea.child(fileDiv);

	//only does it for string
	if (file.type == 'text'){
		//typeof(file.data) == String
		spreed(file.data);
	}	
}

function spreed(s) {
	if (typeof(s) == typeof([])) {s = join(s, '\n')}
	let parag = s.split('\n');
	
	for (let p of parag) {
		p.trim();
		lines.unshift(p);
	}

	tCurrent.html(s);
}
function scrollToBottom() {
	document.getElementById('scrollbox').scrollTop=document.getElementById('scrollbox').scrollHeight;
}
function draw() {
	if (frameCount % chunk == 0){
		background(30);
		
		//flash words
		let s = join(carry.splice(0,chunk)," ");
		fill(230, 230, 250); 
		
		//scrollbox
		s = s.split("\n");
		if (s.length==2){
			if (document.getElementById("scrollbox").childNodes.length > 0){
				document.getElementById("scrollbox").childNodes[0].remove();
			}
			s = join(s,"");
		}
		text(s, 50, 240);

		//elevator
		if (s == ''){s = ' '}
		let y = 180;
		for (let t of tLifts){
			if (y>0) {
				fill(170, 200, 170);
				text(t, 50, y);
				y-= 30;
			} else {
				tLifts.pop(-1);
			}
		}
		tLifts.unshift(s);		
	}

	let line = lines.pop(0);
	
	if (line != undefined){
		//createDiv
		shouldScroll = document.getElementById('scrollbox').scrollTop+document.getElementById('scrollbox').offsetHeight
			>=(document.getElementById('scrollbox').scrollHeight);
		let l = createP(line);
		tArea.child(l);
		tDivs.shift(l);
		//scroll	
		// if (shouldScroll) {scrollToBottom()}
		
		//push to carry[]
		let words = line.split(" ");
		for (let word of words){
			if (word != ""){carry.push(word)}
		}
		carry.push('\n');
	};

}