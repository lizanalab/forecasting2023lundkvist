# Simulating PRC2 methylating Histone H3 Lysine 27 (H3K27) in *Drosophila melanogaster*

A Monte Carlo model of chromatin as a one-dimensional vector of nucleosomes. 
Each nucleosome has two H3K27 positions, which have 0–3 methyl groups. During each simulation step, the algorithm inspects all 
nucleosomes in random order and tries to add or remove one methyl group from every H3K27 position.

For a full description, read the paper.

## Parameters

The parameters are stored in an object in the script. It takes one argument, which is used as part of the output file name. 
The outputs are stored in a gzipped file in the SimulationData folder, named as meXdata_{name}.json.gz, where {name} is the input argument.

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
| S3 | The allosteric stimulation factor of a tri|methylated neighbour nucleosome|
| preFactor | The general increase of methylation efficience for a PRE-bound PRC2 |
| prePositions | PRE positions in nucleosome indices |
| preStrengths | Called PRE occupancy in the manuscript. Specific for each PRE, and adjusts the preFactor |
| tReplication | The frequency of replication |
| snapshotTimes | The update times when snapshots of the simulated stretch are taken |

## Dependencies

The script is run with the node.js environment, and uses the built|in modules fs and zlib.
epigen uses [Papa Parse](http://papaparse.com) to read files. This module was installed with npm, and is included in the repository. 

## Output

The outputs are stored in a gzipped file in the SimulationData folder, named as meXdata_{name}.json.gz

The json file contains the object with the parameter settings, the number of nucleosome halves in each possible state 
(unmethylated, mono-, di-, or trimethylate) for each update of the model,
and the profile of each simulated stretch for each snapshot time.