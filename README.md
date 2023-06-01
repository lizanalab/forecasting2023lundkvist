# Simulating PRC2 methylating Histone H3 Lysine 27 (H3K27) in *Drosophila melanogaster*

A Monte Carlo model of chromatin as a one-dimensional vector of nucleosomes. 
Each nucleosome has two H3K27 positions, which have 0–3 methyl groups. During each simulation step, the algorithm inspects all 
nucleosomes in random order and tries to add or remove one methyl group from every H3K27 position.

For a full description of the model, read the paper.

## Parameters

The parameters are stored in an object in the script. It takes one argument, which is used to name the output file. 

| Parameter | Description |
|:----------|:------------|
| nGenomes | Number of replicate simulations |
| nNucleosomes | Number of nucleosomes in the simulated stretch |
| nUpdates | Number of updates to run the simulation |
| deltaT | Adjusts the methylation parameters to the update frequency |
| pDemet | Called kD in the manuscript. The probability of demethylation |
| k01 | Methylation rate for adding the first methyl group |
| k12 | Methylation rate for adding the second methyl group |
| k23 | Methylation rate for adding the third methyl group |
| S3 | The allosteric stimulation factor of a tri-methylated neighbour nucleosome |
| preFactor | The general increase of methylation efficience for a PRE-bound PRC2 |
| prePositions | PRE positions in nucleosome indices |
| preStrengths | Called PRE occupancy in the manuscript. Specific for each PRE, and adjusts the preFactor |
| tReplication | The frequency of replication |
| snapshotTimes | The update times when snapshots of the simulated stretch are taken |

## Running the model

The script is run with [the node.js](https://nodejs.org/en/download) environment, and uses the built-in modules fs and zlib.
epigen uses [Papa Parse](http://papaparse.com) to read files. This module was installed with npm, and is included in the repository. 

To run on command line:
    `node epigen.js output_filename`

At the end of a successful simulation the object with the used parameters and the output filename are written to console, for example:

    {
		"nGenomes": 100,
		"nNucleosomes": 10,
		"nUpdates": 57600,
		"deltaT": 0.25,
		"pDemet": 0,
		"k01": 0.00325,
		"k12": 0.001,
		"k23": 0.00025,
		"S3": 3.5,
		"preFactor": 350,
		"prePositions": [
			500
		],
		"preStrengths": [
			0.5
		],
		"tReplication": 5760,
		"snapshotTimes": [
			51840,
			53280,
			54720,
			56160,
			57599
		],
		"fileName": "SimulationData/meXdata_output_filename.json"
    }

The model outputs are written into a gzipped json file in the SimulationData folder. 
The output file is named as `meXdata_{output_filename}.json.gz`.

## Output

The json output file contains:
 - an object with the parameter settings
 - the number of nucleosome halves in each possible state (unmethylated, mono-, di-, or trimethylated) for each update of the model
 - the profile of each simulated nucleosome stretch for each snapshot time