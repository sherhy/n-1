let words = [];
let x = 100;
let y = 50;
let input;
let button;
let deleteBar;

class Word {
	constructor(){
		this.x = random(7,windowWidth - 7);
		this.y = random(13, windowHeight - 13);
		this.div = createDiv();
		this.fall = random(1.3,1.9);
		this.acc = random(0,0.5);
	};

	pushword(word) {
		this.div.html(word);
		this.div.position(this.x,this.y);
		words.push(this);
	};

	update(){
		this.fall += this.acc;
		this.fall *= 0.85;
		this.y += this.fall;
		this.div.position(this.x,this.y);

		if (this.y > windowHeight){
			this.y = -4;
			this.x += random(-3, 3);
			this.fall = random(1.3,1.9);
			this.acc = random(0,0.5);
		}
		if (this.x > windowWidth||this.x < 0) {this.x = random(7,windowWidth - 7);}
	};

}


function setup() {
	noCanvas();

	loadStrings('src/shakespeare.txt', prepareText);

	let p2 = createP("add words here");
	input = createInput('sample');
	button = createButton('create');
	button.mousePressed(function () {
		let v = new Word();
		v.pushword(input.value());
	})

	deleteBar = createInput('deletewords');
	deleteBar.position(10, windowHeight-50);
	let p1 = createP('input the word you want to delete below and hit ENTER');
	p1.position(10, windowHeight-90);

	// for (i = 0; i < 4; i++){
	// 	x = 40;
	// 	let v = new Word();
	// 	v.pushword('letsgo');		
	// }	
}

function prepareText(srcText){
	for (line = 0; line < srcText.length; line++){
		let wrds = srcText[line].split(" ");
		for (w = 0; w < wrds.length; w++){
			let v = new Word();
			v.pushword(wrds[w]);
		}
	}
}

function delWord(){
	delword = deleteBar.value();
	for (i = words.length-1; i > -1; i--){
		// console.log(words[i].div.elt.innerText);
		if (words[i].div.elt.innerText == delword){
			words[i].div.remove();
		}
	}
	deleteBar.value("");
}

function keyPressed() {
	if (keyCode === ENTER){
		delWord();
	}
}

function draw() {
	for (i = 0; i < words.length; i++){
		words[i].update();
	}	
}