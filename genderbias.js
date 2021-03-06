// Code derived from Thomas Forth's original at http://tomforth.co.uk/genderbias/
var maleWords = ["excellen\\w*", "superb", "outstanding", "unique", "exceptional", "unparalleled", "\\w{2,}est(\W|$)", "best", "most", "wonderful", "terrific\\w*", "fabulous", "magnificent", "remarkable", "extraordinar\\w*", "amazing", "supreme\\w*", "unmatched", "talent\\w*", "intell\\w*", "smart\\w*", "skill\\w*", "ability", "genius", "brilliant\\w*", "bright\\w*", "brain\\w*", "aptitude", "gift\\w*", "capacity", "propensity", "innate", "flair", "knack", "clever\\w*", "expert\\w*", "proficient\\w*", "capable", "adept\\w*", "able", "competent", "natural\\w*", "inherent\\w*", "instinct\\w*", "adroit\\w*", "creative\\w*", "insight\\w*", "analytical", "research\\w*", "data", "study", "studies", "experiment\\w*", "scholarship", "result\\w*", "^test\\w*", "finding\\w*", "publication\\w*", "publish\\w*", "vita\\w*", "method\\w*", "scien\\w*", "grant\\w*", "fund\\w*", "manuscript\\w*", "project\\w*", "journal\\w*", "theor\\w*", "discover\\w*", "contribution\\w*"];
var femaleWords = ["hardworking", "conscientious", "depend\\w*", "meticulous", "thorough", "diligen\\w*", "dedicate", "careful", "reliab\\w*", "effort\\w*", "assiduous", "trust\\w*", "responsib\\w*", "methodical", "industrious", "busy", "work\\w*", "persist\\w*", "organiz\\w*", "disciplined", "teach", "instruct", "educat\\w*", "train\\w*", "mentor", "supervis\\w*", "adviser", "counselor", "syllabus", "syllabus", "course\\w*", "class", "service", "colleague", "citizen", "communicate\\w*", "lectur\\w*", "student\\w*", "present\\w*", "rapport"];

function textChanged() {
	document.getElementById("foundFemaleWords").innerHTML = "";
	document.getElementById("foundMaleWords").innerHTML = "";
	
	var letterText = document.getElementById("recommendationLetter").value;
	var splitLetterText = letterText.split(" ");
	for (var i = 0; i < splitLetterText.length; i++) {
		letterWord = splitLetterText[i];
		for (var maleCounter = 0; maleCounter < maleWords.length; maleCounter++) {
			if (letterWord.toLowerCase().search(maleWords[maleCounter]) == 0) {
				document.getElementById("foundMaleWords").innerHTML += '<p>' + letterWord + '</p>';
			}
		}
		for (var femaleCounter = 0; femaleCounter < femaleWords.length; femaleCounter++) {
			if (letterWord.toLowerCase().search(femaleWords[femaleCounter]) == 0) {
				document.getElementById("foundFemaleWords").innerHTML += '<p>' + letterWord + '</p>';
			}
		}
	}
}

var examples = [];
function example() {
	var v = "Melinda was one of the first users of my now widely-used and successful software, MetNetMaker. Her early bug reports and insightful suggestions were invaluable to making the product what it is today. I have not since worked with anyone so at ease communicating with those in other scientific fields.";
	if(examples.length > 0){
		var i = Math.floor(Math.random()*examples.length);
		v = parseMarkdown(examples[i]);
	}
	document.getElementById("recommendationLetter").value = v;
	textChanged();
}

function parseMarkdown(data){
	if(typeof data==="string") data = data.split(/[\n\r]/);
	// If it looks like YAML we remove it
	start = 0;
	if(data[0].indexOf('---')==0){
		for(var i = 1; i < data.length; i++){
			if(data[i].indexOf('---')==0){
				start = i+1;
				if(data[i+1]=="") start++;
				continue;
			}
		}
	}
	var out = "";
	for(var i = start; i < data.length; i++){
		out += data[i]+'\n';
	}
	return out;
}

function getExamples(data){
	if(typeof data==="string") data = data.split(/[\n\r]/);
	var m,alt;
	var success = function(data,a){ if(data) examples.push(data); };

	for(var i = 0; i < data.length ; i++){
		m = data[i].match(/\* \[[^\]]+\]\(([^\)]+)\)/);
		if(m){
			alt = m[1].replace(/\.md/,".html");
			loadFILE('examples/'+m[1],success,{error:function(){ console.log('trying '+alt);loadFILE('examples/'+alt,success); }});
		}
	}
}
//loadFILE('examples/README.md',getExamples);

// Function to load a file (same domain)
function loadFILE(file,fn,attrs){
	if(!attrs) attrs = {};
	attrs['_file'] = file;
	var error = "";
	var xhr = new XMLHttpRequest();
	if(attrs.error && typeof attrs.error==="function") error = function(e){ attrs.error.call((attrs.context ? attrs.context : this),e,attrs) }
	if(error){
		xhr.addEventListener("error", error, false);
		xhr.addEventListener("abort", error, false);
	}
	xhr.onreadystatechange = function(){
		if(xhr.readyState==4){
			if(typeof fn==="function"){
				fn.call((attrs.context ? attrs.context : this),xhr.responseText,attrs);
			}
		}
	}
	xhr.open("GET", file, true);
	try {
		xhr.send();
	} catch(e) {
		if(error) attrs.error.call((attrs.context ? attrs.context : this),e,attrs);
	}
}