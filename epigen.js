const fs = require('fs');
const Papa = require('papaparse') 
const zlib = require('zlib');


class Nucleosome{
	constructor(meUpper, meLower){
		this.meUpper = meUpper;
		this.meLower = meLower
	}
}

class Chromatin{
	constructor(nNucleosomes){
		this.nNucleosomes = nNucleosomes
		this.nucleosome = [];
		this.addNativeNucleosomes();
		this.profileData = [];
		this.nMe3 = [];
		this.nMe2 = [];
		this.nMe1 = [];
		this.nMe0 = [];
		this.PREme3=[];
		this.profileMe3=[]
	}

	addNativeNucleosomes(){
		for (let i=0; i<this.nNucleosomes; i++){ 
			this.nucleosome.push(new Nucleosome('me0','me0'));
		}
	}

	getMeXMeYCorr(){

		let data = {'nMe3': 0, 'nMe2': 0, 'nMe1': 0, 'nMe0': 0, 
			'nMe3Me3': 0,'nMe3Me2': 0,'nMe3Me1': 0,'nMe3Me0': 0,
			'nMe2Me3': 0,'nMe2Me2': 0,'nMe2Me1': 0,'nMe2Me0': 0,
			'nMe1Me3': 0,'nMe1Me2': 0,'nMe1Me1': 0,'nMe1Me0': 0,
			'nMe0Me3': 0,'nMe0Me2': 0,'nMe0Me1': 0,'nMe0Me0': 0,
		}

		this.nucleosome.forEach(function(nucl){			

			if (nucl.meLower == 'me3'){
				data.nMe3++;
				if (nucl.meUpper == 'me3'){
					data.nMe3Me3++;
				}
				else if (nucl.meUpper == 'me2'){
					data.nMe3Me2++;
				}
				else if (nucl.meUpper == 'me1'){
					data.nMe3Me1++;
				}
				else if (nucl.meUpper == 'me0'){
					data.nMe3Me0++;
				}
			}

			if (nucl.meUpper == 'me3'){
				data.nMe3++;
				if (nucl.meLower == 'me3'){
					data.nMe3Me3++;
				}
				else if (nucl.meLower == 'me2'){
					data.nMe3Me2++;
				}
				else if (nucl.meLower == 'me1'){
					data.nMe3Me1++;
				}
				else if (nucl.meLower == 'me0'){
					data.nMe3Me0++;
				}
			}

			if (nucl.meLower =='me2'){
				data.nMe2++;
				if (nucl.meUpper == 'me3'){
					data.nMe2Me3++;
				}
				else if (nucl.meUpper == 'me2'){
					data.nMe2Me2++;
				}
				else if (nucl.meUpper == 'me1'){
					data.nMe2Me1++;
				}
				else if (nucl.meUpper == 'me0'){
					data.nMe2Me0++;
				}
			}

			if (nucl.meUpper == 'me2'){
				data.nMe2++;
				if (nucl.meLower == 'me3'){
					data.nMe2Me3++;
				}
				else if (nucl.meLower == 'me2'){
					data.nMe2Me2++;
				}
				else if (nucl.meLower == 'me1'){
					data.nMe2Me1++;
				}
				else if (nucl.meLower == 'me0'){
					data.nMe2Me0++;
				}
			}
			
			if (nucl.meLower =='me1'){
				data.nMe1++;
				if (nucl.meUpper == 'me3'){
					data.nMe1Me3++;
				}
				else if (nucl.meUpper == 'me2'){
					data.nMe1Me2++;
				}
				else if (nucl.meUpper == 'me1'){
					data.nMe1Me1++;
				}
				else if (nucl.meUpper == 'me0'){
					data.nMe1Me0++;
				}
			}
 			if (nucl.meUpper == 'me1'){	
 				data.nMe1++;
 				if (nucl.meLower == 'me3'){
					data.nMe1Me3++;
				}
				else if (nucl.meLower == 'me2'){
					data.nMe1Me2++;
				}
				else if (nucl.meLower == 'me1'){
					data.nMe1Me1++;
				}
				else if (nucl.meLower == 'me0'){
					data.nMe1Me0++;
				}
 			}			

			if (nucl.meLower =='me0'){
				data.nMe0++;
				if (nucl.meUpper == 'me3'){
					data.nMe0Me3++;
				}
				else if (nucl.meUpper == 'me2'){
					data.nMe0Me2++;
				}
				else if (nucl.meUpper == 'me1'){
					data.nMe0Me1++;
				}
				else if (nucl.meUpper == 'me0'){
					data.nMe0Me0++;
				}
			}
 			if (nucl.meUpper == 'me0'){
 				data.nMe0++;
 				if (nucl.meLower == 'me3'){
					data.nMe0Me3++;
				}
				else if (nucl.meLower == 'me2'){
					data.nMe0Me2++;
				}
				else if (nucl.meLower == 'me1'){
					data.nMe0Me1++;
				}
				else if (nucl.meLower == 'me0'){
					data.nMe0Me0++;
				}
 			}			
		})

		this.profileData = {'nMe3': data.nMe3, 'nMe2': data.nMe2, 'nMe1': data.nMe1, 'nMe0': data.nMe0, 
			'nMe3Me3': data.nMe3Me3/2,
			'nMe3Me2': (data.nMe3Me2+data.nMe2Me3)/2,
			'nMe3Me1': (data.nMe3Me1+data.nMe1Me3)/2,
			'nMe3Me0': (data.nMe3Me0+data.nMe0Me3)/2,
			'nMe2Me2': data.nMe2Me2/2,
			'nMe2Me1': (data.nMe2Me1+data.nMe1Me2)/2,
			'nMe2Me0': (data.nMe2Me0+data.nMe0Me2)/2,
			'nMe1Me1': data.nMe1Me1/2,
			'nMe1Me0': (data.nMe1Me0+data.nMe0Me1)/2,
			'nMe0Me0': data.nMe0Me0/2,
		}
	}
	
	getPRE3(start, length){

		let nMe3 = 0

		this.nucleosome.slice(start-length, start+length).forEach(function(nucl){

			if (nucl.meLower == 'me3'){
				nMe3++
				}
			if (nucl.meUpper == 'me3'){
				nMe3++
				}
			})
		this.PREme3.push(nMe3)
		
	}
	
	getPREprofile(){

		let data = []

		this.nucleosome.forEach(function(nucl){
			data.push(parseInt(nucl.meUpper[2]))
			data.push(parseInt(nucl.meLower[2]))
			})
		this.profileData.push(data)
		
	}
		
	getNme3(){

		let nMe3 = 0

		this.nucleosome.forEach(function(nucl){	

			if (nucl.meLower == 'me3'){
			nMe3++}
			if (nucl.meUpper == 'me3'){
			nMe3++}
			})
			
		this.nMe3.push(nMe3)	
	}
	
	getNme2(){

		let nMe2 = 0

		this.nucleosome.forEach(function(nucl){

			if (nucl.meLower == 'me2'){
			nMe2++}
			if (nucl.meUpper == 'me2'){
			nMe2++}
			})
			
		this.nMe2.push(nMe2)	
	}
	
		getNme1(){

		let nMe1 = 0

		this.nucleosome.forEach(function(nucl){	

			if (nucl.meLower == 'me1'){
			nMe1++}
			if (nucl.meUpper == 'me1'){
			nMe1++}
			})
			
		this.nMe1.push(nMe1)	
	}
	
	getNme0(){

		let nMe0 = 0

		this.nucleosome.forEach(function(nucl){

			if (nucl.meLower == 'me0'){
			nMe0++}
			if (nucl.meUpper == 'me0'){
			nMe0++}
			})
			
		this.nMe0.push(nMe0)	
	}
}

class Genomes{
	constructor(nGenomes, nNucleosomes){
		this.nGenomes = nGenomes;
		this.chromatin = [];
		this.nNucleosomes = nNucleosomes;
		this.addNGenomes(nNucleosomes)
	}

	addNGenomes(nNucleosomes){
		for (let i=0; i<this.nGenomes; i++){
			this.chromatin.push(new Chromatin(nNucleosomes))
		}
	}

	methylationProfile(){

		// --- Methylation profile along the chromatin
		this.chromatin.forEach(function(chr){
			let profile = {
			me0: new Array(chr.nucleosome.length).fill(0),
			me1: new Array(chr.nucleosome.length).fill(0),
			me2: new Array(chr.nucleosome.length).fill(0),
			me3: new Array(chr.nucleosome.length).fill(0) 
		}

			chr.nucleosome.forEach(function(nucl,index){ 
				if (nucl.meLower=='me0'){
					profile.me0[index]++;
				}
				if (nucl.meUpper=='me0'){
					profile.me0[index]++;
				}
				if (nucl.meLower=='me1' ){
					profile.me1[index]++;
				}
				if (nucl.meUpper=='me1'){
					profile.me1[index]++;
				}
				if (nucl.meLower=='me2'){
					profile.me2[index]++;
				}
				if(nucl.meUpper=='me2'){
					profile.me2[index]++;
				}
				if (nucl.meLower=='me3'){
					profile.me3[index]++;
				}
				if (nucl.meUpper=='me3'){
					profile.me3[index]++;
				}			
						
			})
			chr.profileMe3.push(profile.me3)
		});

		//--- Fraction of loci that have 10%, 20%, 30%,... meX (X = 0, 1,2, 3)

		let fractionMeX = {
			me0: [],
			me1: [],
			me2: [],
			me3: []
		}
	}
}

function contactPRE(NuclIndex, pNucleosomes, prePos){

		let preIndex = -1;

		prePos.forEach(function(pos, index){
			
			let dist = Math.abs(pos-NuclIndex)

			if (Math.random() < pNucleosomes[1][dist]){
				
				preIndex = index}
			})

		return preIndex
		}


function getNeighborState(index,nucl,nuclArray,pre){

	function nearestNeighbour(index,nuclArray){
		let r = Math.random();
		let nearestNucl = index;
		if (index == 0){
			if (r < 0.5){
				nearestNucl = 'outsideChromatin';
			}
			else{
				nearestNucl = 1;
			}
		}
		if (index == nuclArray.length-1){
			if (r < 0.5){
				nearestNucl = 'outsideChromatin';
			}
			else{
				nearestNucl = nuclArray.length-2; 
			}
		}
		if (index > 0 & index < nuclArray.length-1){
			if (r < 0.5){
				nearestNucl++;
			}
			else{
				nearestNucl--;
			}
		}

		if (nearestNucl == index){
			console.log('Same neigbour! Something is wrong....')
		}
		return nearestNucl;
	}

	function nearestNeighbourExp(index, nuclArray){
		let r = Math.random();
		let nearestNucl = index;
		let L = 40;
		let LL = -L*Math.log(1-r) + 1;

		if (Math.random() < 1/2){
			nearestNucl += LL;
		}
		else{
			nearestNucl -= LL;
		}
		if (nearestNucl	>= 0  & nearestNucl< nuclArray.length-1){
			
			return parseInt(nearestNucl);
		}
		else{
			return 'outsideChromatin';
		}
	}

	function nearestNeighbourPow(index,nuclArray){
		let r = Math.random();
		let nearestNucl = index;
		let x0 = 1;
		let x1 = 100; 
		let n = -0.75;
		let LL = Math.pow((Math.pow(x1, n + 1) - Math.pow(x0, n + 1))*r + Math.pow(x0, n + 1), 1/(n + 1));
		if (Math.random() < 1/2){
			nearestNucl += LL;
		}
		else{
			nearestNucl -= LL;
		}
		if (nearestNucl	>= 0 & nearestNucl < nuclArray.length-1){
			return parseInt(nearestNucl);
		}
		else{
			return 'outsideChromatin';
		}
	}
	
	function getNucleosomeState(nuclArray, neighborIndex,){
		var state		
		if (neighborIndex != 'outsideChromatin'){
			if (Math.random < 1/2){
				state = nuclArray[neighborIndex].meLower;
			}
			else{
				 state = nuclArray[neighborIndex].meUpper;
			}
		}
		else{
			state = 'me0';
		}
		return state
		}

	let nucl_id = nearestNeighbourPow(index, nuclArray)
	
	let neighborState = getNucleosomeState(nuclArray, nucl_id)
	return  neighborState
}

function addMeX(meX, index, neigborState, parameters, preContact){
	let pv = parameters.deltaT;
	let pD = parameters.pDemet;
	let k01 = parameters.k01;
	let k12 = parameters.k12;
	let k23 = parameters.k23;
	let S3 = parameters.S3;
	let fPRE = parameters.preFactor;
	let sPRE = parameters.preStrengths;
	
	let newMeX;
	let r = Math.random();
	
	if (preContact != -1){
		k01 = k01*fPRE*sPRE[preContact]
		k12 = k12*fPRE*sPRE[preContact]
		k23 = k23*fPRE*sPRE[preContact]
		}
	
	if (meX == 'me3'){
		 newMeX = meX;
	}

	if (meX == 'me0'){
		if(neigborState == 'me3' & r < pv*k01*S3){
			newMeX = 'me1';
		}
		else if (r < pv*k01){
			newMeX = 'me1'; 
		}
		else{
			newMeX = 'me0';
		}
		
	}

	if (meX == 'me1'){
		if(neigborState == 'me3' & r < pv*k12*S3){
			newMeX = 'me2'; 
		}
		else if (r < pv*k12){
			newMeX = 'me2';
		}
		else{
			newMeX = 'me1';
		}
	}

	if (meX == 'me2'){
		if(neigborState == 'me3' & r < pv*k23*S3){
			newMeX = 'me3'; 
		}
		else if (r < pv*k23){
			newMeX = 'me3';
		}
		else{
			newMeX = 'me2';
		}
	}

	return newMeX;	
}

function removeMeX(meX, parameters){

	let pD = parameters.pDemet;
	let newMeX;
	let r = Math.random();

	if (r < pD){
		if (meX == 'me0'){
			newMeX = 'me0';
		}
		else if (meX == 'me1' ){
			newMeX = 'me0'; 
		}
		else if (meX == 'me2'){
			newMeX = 'me1'; 
		}
		else if (meX == 'me3'){
			newMeX = 'me2'; 
		}
	}
	else{
		newMeX = meX;
	}
	
	return newMeX
}


function replication(genomes){
	
	genomes.chromatin.forEach((chr) => {
		chr.nucleosome.forEach(el => {		
			var r = Math.random();
			if (r < 0.5){
				el.meUpper = 'me0';
				el.meLower = 'me0';
			}
		})
	})

}


function updateMethylationStates(genomes, parameters, pNucleosomes){
	
	genomes.chromatin.forEach(function(chr, genomeIndex){
		
		let randomIndex = [...Array(chr.nucleosome.length).keys()];
		for (i = randomIndex.length -1; i > 0; i--) {
		  j = Math.floor(Math.random() * i)
		  k = randomIndex[i]
		  randomIndex[i] = randomIndex[j]
		  randomIndex[j] = k
		  } 

		chr.nucleosome.map(function(nucl, realIndex, nuclArray){ 
			
			let index = randomIndex[realIndex]

			if (Math.random()<0.5){ 

				nuclArray[index].meLower = removeMeX(nuclArray[index].meLower, parameters);
				nuclArray[index].meUpper = removeMeX(nuclArray[index].meUpper, parameters);

				let preState = contactPRE(index, pNucleosomes, parameters.prePositions);
				let neighborState = getNeighborState(index, nuclArray[index], nuclArray);
				nuclArray[index].meLower = addMeX(nuclArray[index].meLower, index, neighborState, parameters, preState);
				
				neighborState = getNeighborState(index,nuclArray[index], nuclArray);
				preState = contactPRE(index, pNucleosomes, parameters.prePositions);
				nuclArray[index].meUpper = addMeX(nuclArray[index].meUpper, index, neighborState, parameters, preState);
				}
			else{

				let preState = contactPRE(index, pNucleosomes, parameters.prePositions);
				let neighborState = getNeighborState(index, nuclArray[index], nuclArray);
				nuclArray[index].meLower = addMeX(nuclArray[index].meLower, index, neighborState, parameters, preState);
				
				neigborState = getNeighborState(index,nuclArray[index], nuclArray,);
				preState = contactPRE(index, pNucleosomes, parameters.prePositions);
				nuclArray[index].meUpper = addMeX(nuclArray[index].meUpper, index, neighborState, parameters, preState);
				
				nuclArray[index].meLower = removeMeX(nuclArray[index].meLower, parameters);
				nuclArray[index].meUpper = removeMeX(nuclArray[index].meUpper, parameters);
			}
		})
	});

}


function writeOutput(parameters, genomes, fname){

		console.log(fname)
		/*
		var stream = fs.createWriteStream(fname);
		var outString = {'parameters': parameters, 'genomes': genomes}
		stream.once('open', function(fs) {
			stream.write(JSON.stringify(outString, null, 0))
		});
		*/
		var outString = JSON.stringify({'parameters': parameters, 'genomes': genomes})
		var output = fs.createWriteStream('./'+fname+'.gz');

		var compress = zlib.createGzip();

		compress.pipe(output);

		compress.write(outString);
		compress.end();
		
}

function ReadProfileData(chromatin, profile_data){
	let k = 0
	chromatin.nucleosome.forEach(function(el, index){ 
			el.meUpper = 'me' + profile_data[k];
			el.meLower = 'me' + profile_data[k + 1];
			k = k + 2
	})
	return chromatin
}

function makeFileLedger(fileLedger){
	let stream = fs.createWriteStream('./fileLedger.txt');
	stream.write(JSON.stringify(fileLedger, null, 4));
}

function TakePrerunStartProfile(file, genomes, localParams, runNo){
	let data = fs.readFileSync(file, "utf8");
	let jsonData = JSON.parse(data)
		
	if (localParams['nNucleosomes'] == jsonData['parameters']['nNucleosomes']){
		console.log('stretch length matches!')
	}else{
		console.log('stretch length does not match!')
	}

	for (let i = 0; i < localParams['nGenomes']; i++){
		 let snapshot_length = jsonData['parameters']['snapshotTimes'].length
		 let index = localParams['nGenomes']*runNo + i
		 if (index >= jsonData['parameters']['nGenomes']){
			 index = index % jsonData['parameters']['nGenomes']
		 }
		genomes['chromatin'][i] = ReadProfileData(genomes['chromatin'][i], jsonData.genomes['chromatin'][index]['profileData'][snapshot_length - 1])}
	
	return genomes
}

function getFileName(p){
	console.log(p)
	return 'SimulationData/meXdata_' + p +'.json';
}

function getOdds(name){
	let filename = './PRE_contact_tables/PRE_contact_2500_100k.txt'
	const file = fs.readFileSync(filename, 'utf8');
	let nuclesomeDist = [];
	let prob = [];

function handleResult(results){
	results.data.forEach(d =>
	{nuclesomeDist.push(d['Nucleosome']);
		prob.push(d['Probability']);
		})
	}
	const config = {
		delimiter:"",
		newline:"",
		QuoteChar:'"', 
		header:true, 
		complete: handleResult
	};
	Papa.parse(file, config);
  return [nuclesomeDist, prob];
}

let parameters = {
	nGenomes: 100,
	nNucleosomes: 1000,
	nUpdates: 5760*10,
	deltaT: 0.25,
	pDemet: 0.0, // kD in the manuscript.
	k01: 13*0.00025,
	k12: 4*0.00025,
	k23: 0.00025,
	S3: 3.5,
	preFactor : 350,
	prePositions: [500],
	preStrengths : [0.5], // PRE occupancy in the manuscript.
	tReplication: 5760,
	snapshotTimes: [51840, 53280, 54720, 56160, 57599],
	}

let fileLedger = {};

var myArgs = process.argv.slice(2);

let localParams = Object.assign({}, parameters)

let fname = getFileName(myArgs[0]);

localParams['fileName'] = fname;
fileLedger[fname] = localParams

var odds = getOdds(localParams['preLength'])
let neighbourExpDist = []

let genomes = new Genomes(localParams.nGenomes, localParams.nNucleosomes);

// let nThread = parseInt(myArgs[1])
// genomes = TakePrerunStartProfile(prerunFile, genomes, localParams, nThread)

for (let time = 0; time<localParams.nUpdates; time++){
	const Now = (localParams.snapshotTimes.includes(time))
	const replicateNow = (time % localParams.tReplication == 0)
	//const replicateNow = localParams.tReplication.includes(time)
			
	if (replicateNow){
		replication(genomes);
	}
		genomes.chromatin.forEach(chr => chr.getNme3())
		genomes.chromatin.forEach(chr => chr.getNme2())
		genomes.chromatin.forEach(chr => chr.getNme1())
		genomes.chromatin.forEach(chr => chr.getNme0())
	
	if (Now){
		genomes.chromatin.forEach(chr => chr.getPREprofile())
	}
	updateMethylationStates(genomes, localParams, odds);
}

writeOutput(localParams, genomes, fname);

makeFileLedger(fileLedger);

console.log(JSON.stringify(localParams, null, 4), '\n', fname)



