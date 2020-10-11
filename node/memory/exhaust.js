// Forked from https://raw.githubusercontent.com/Data-Wrangling-with-JavaScript/nodejs-memory-test/master/index.js
// Generate a heapdump on start, then another after configured iterations
// You can then compare them using GoogleChrome Heapdump comparison in DevTools (memory tab / load)

var heapdump = require('heapdump');

const haltOnThatIteration = 1000;
const heapDumpOnThatIteration = 1000;
const waitThatMillisecondsBetweenIterations = 5;

const waitForThatMilliseconds = (delay) => new Promise((resolve) => setTimeout(resolve, delay ))
//
// Small program to test the maximum amount of allocations in multiple blocks.
// This script searches for the largest allocation amount.
//

//
// Allocate a certain size to test if it can be done.
//
function alloc (size) {
    const numbers = size / 8;
    const arr = []
    arr.length = numbers; // Simulate allocation of 'size' bytes.
    for (let i = 0; i < numbers; i++) {
        arr[i] = i;
    }
    return arr;
};

//
// Keep allocations referenced so they aren't garbage collected.
//
const allocations = [];

//
// Allocate successively larger sizes, doubling each time until we hit the limit.
//
allocToMax = async function () {

    console.log("Start");

    let iteration = 0;

    const field = 'heapUsed';
    const mu = process.memoryUsage();
    console.log(mu);
    const gbStart = mu[field] / 1024 / 1024 / 1024;
    console.log(`Start ${Math.round(gbStart * 100) / 100} GB`);

    heapdump.writeSnapshot(function(err, filename) {
        console.log('Headump written to file ', filename);
    });

    let allocationStep = 100 * 1024;

    while (true) {

        iteration++

        // Allocate memory.
        const allocation = alloc(allocationStep);

        // Allocate and keep a reference so the allocated memory isn't garbage collected.
        allocations.push(allocation);

        // Check how much memory is now allocated.
        const mu = process.memoryUsage();
        const mbNow = mu[field] / 1024 / 1024 / 1024;
        //console.log(`Total allocated       ${Math.round(mbNow * 100) / 100} GB`);
        console.log(`Allocated since start ${Math.round((mbNow - gbStart) * 100) / 100} GB`);

        if (iteration === heapDumpOnThatIteration){
            heapdump.writeSnapshot(function(err, filename) {
                console.log('Headump written to file ', filename);
            });
        }

        if (iteration===haltOnThatIteration){
            process.exit();
        }

        await waitForThatMilliseconds(waitThatMillisecondsBetweenIterations);
        // Infinite loop, never get here.
    }

    // Infinite loop, never get here.
};

allocToMax();

// Infinite loop, never get here.
