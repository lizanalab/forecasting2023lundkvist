# Simulating PRC2 methylating Histone H3 Lysine 27 (H3K27) in *Drosophila melanogaster*

A Monte Carlo model of chromatin as a one-dimensional vector of nucleosomes. 
Each nucleosome has two H3K27 positions, which have 0-3 methyl groups. During each simulation step, the algorithm inspects all 
nucleosomes in random order and tries to add or remove one methyl group from every H3K27 position.

For a full description of the model, read the [paper on bioRxiv]().

## Parameters

The script takes one argument, which is used to name the output file. The parameters are stored in an object in the script. 

| Parameter | Description |
|:----------|:------------|
| nGenomes | Number of replicate simulations |
| nNucleosomes | Number of nucleosomes in the simulated stretch |
| nUpdates | Number of updates to run the simulation |
| deltaT | Multiplied with the methylation rate parameters, to adjust them to the update frequency. |
| pDemet | Called kD in the manuscript. The probability of demethylation |
| k01 | Methylation rate for adding the first methyl group. Multiplied by deltaT to make the probability of adding the third methyl group. Can be freely set, but should be 13*k23 to match experimental measurements.|
| k12 | Methylation rate for adding the second methyl group. Multiplied by deltaT to make the probability of adding the second methyl group. Can be freely set, but should be 4*k23 to match experimental measurements. |
| k23 | Methylation rate for adding the third methyl group. Multiplied by deltaT to make the probability of adding the first methyl group, which is what we call the base methylation probability in the paper. |
| S3 | The allosteric stimulation factor of a tri-methylated neighbour nucleosome |
| preFactor | The general increase of methylation efficience for a PRE-bound PRC2 |
| prePositions | A vector of PRE positions in nucleosome indices. If the vector is empty, only hit-and-run methylation will be simulated. |
| preStrengths | Called PRE occupancy in the manuscript. A vector of floats between 0 and 1, specific for each PRE. Adjusts the preFactor.  |
| tReplication | The frequency of replication |
| snapshotTimes | The update times when snapshots of the simulated stretch are taken |

## Running the script

The script is run with [the node.js](https://nodejs.org/en/download) environment, and uses the built-in modules fs and zlib.
epigen uses [Papa Parse](http://papaparse.com) to read files. This module was installed with npm, and is included in the repository. 

To run on the command line:
    `node epigen.js output_filename`

Depending on the number of updates, the length of the simulated stretch and the number of replicate simulations the runtime can become long. At the end of a successful simulation the object with the used parameters and the output filename are written to console, for example:

    {
		"nGenomes": 50,
		"nNucleosomes": 800,
		"nUpdates": 57600,
		"deltaT": 0.25,
		"pDemet": 0,
		"k01": 0.00325,
		"k12": 0.001,
		"k23": 0.00025,
		"S3": 3.5,
		"preFactor": 350,
		"prePositions": [
			400
		],
		"preStrengths": [
			0.5
		],
		"tReplication": 5760,
		"snapshotTimes": [
			28800,
			30240,
			31680,
			33120,
			34559
		],
		"fileName": "SimulationData/meXdata_output_filename.json"
    }

The model outputs are written into a gzipped json file in the SimulationData folder. 
The output file is named as `meXdata_{output_filename}.json.gz`.

## Output

The json output file contains:
 - An object with the parameter settings, under `['parameters']`.
 
 - An array of the outputs for each replicate simulation (the number is set by the parameter nGenomes), under `['genomes']['chromatin']`, which includes:
     + An array of the number of nucleosome halves in each possible state (unmethylated, mono-, di-, or trimethylated) for each update of the model, under `[nMe0]`, `[nMe1]`, etc.
     + An array of the profiles for the snapshot times, under `['profileData']`
	 
To read a json file, there are packages such as rjson in R, or json in python. 
