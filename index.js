callNum = 0;
returnNum = 0;

const fs = require('fs');
      rp = require('request-promise');
      // $  = require('cheerio'); // core jQuery designed for server use

const wikiParse = require('./wikiParse.js');

// How many levels deep should the crawler go? (lowest is 2)
const levelDepth = 3;

// How long should the crawler work before exiting?
const timeout = 100 * 1000

// Set the search term, url, and filename
const searchTerm = 'Ethical_consumption'; // Change
const url = 'https://en.wikipedia.org/wiki/' + searchTerm;
const folderName = 'output';
const fileName   = searchTerm + '_depth' + levelDepth.toString() + '.txt';



let promiseResult = '';

const options = {
  uri: url,
  resolveWithFullResponse: true
}

startTime()

// new Promise(function(resolve, reject) {
  
//   setTimeout(function() {
//     reject('Took too long, operation aborted');
//   }, timeout);
//   resolve(wikiParse(url, levelDepth - 1, callNum++));
// })

rp(options)
  .then(function(passedUrl) {
    return wikiParse(url, levelDepth - 1, callNum++);
    // return false; 
    

//     // let entryName = $('.firstHeading', passedUrl.body).text();
//     // let returnObj = {};
//     // let wikiUrls = [];
//     // let selection = '';

//     // // Check for a 'See Also' section
//     // if ($('#See_also', passedUrl.body).text() !== "" ) {
//     //   let afterSeeH2 = $('#See_also', passedUrl.body).parent().next();

//     //     // Accommodate all possible formatting of the 'See Also' section
//     //     if ( afterSeeH2.prop("tagName") === 'UL') {
//     //       selection = afterSeeH2.find('li > a');

//     //     } else if (afterSeeH2.prop("tagName") === 'TABLE'){
//     //       selection = afterSeeH2.next().find('ul > li > a');

//     //     } else if (afterSeeH2.prop("tagName") === 'DIV'){
//     //       if (afterSeeH2.attr("role") === 'navigation'){
//     //         selection = afterSeeH2.next().find('ul > li > a');
//     //       } else {
//     //         selection = afterSeeH2.find('li > a');
//     //       }

//     //     } else {
//     //       selection = afterSeeH2.next().find('ul > li > a');

//     //     }
//     // }

//     // for (let i = 0; i < selection.length; i++) {
//     //   // Need to avoid the PSA messages or potential information between the header and the list of See Also's
//     //   wikiUrls.push($(selection[i]).attr('href'));
//     // }

//     // return Promise.all(
//     //     wikiUrls.map(function(url, i) {
//     //       return wikiParse('https://en.wikipedia.org' + url, levelDepth - 2, callNum++);
//     //     })
//     //   ).then(function(results){
//     //       returnObj.name = entryName
//     //       returnObj.children = results
//     //       return returnObj;
//     //   });
  })
  .then(function(parsedSeeAlso) {
    console.log('writing file...')

    // create ads folder
    if (!fs.existsSync(folderName)){
      fs.mkdirSync(folderName);
    }

    // Write the parse 'See also' links to file
    fs.writeFile(folderName + '/' + fileName, JSON.stringify(parsedSeeAlso), (err) => {
      if (err) throw err;
    });

    console.log("Wrote to file, " + fileName);
    endTime();
  })
  .catch(function(err) {
    //handle error and exit node
    console.log(err);
  });

// Track Time Elapsed 
var startTime, endTime;

function startTime() {
  startTime = new Date();
};

function endTime() {
  endTime = new Date();
  var timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds 
  var seconds = Math.round(timeDiff);
  console.log(seconds + " seconds elapsed");
}

// // Recursive function for finding Wiki connections
// function recursiveParse(url, iterations){

//     rp(url)
//       .then(function(passedUrl) {
//         const wikiUrls = [];
//         let selection = $('#See_also', passedUrl).parent().next('').children().children();
//         // console.log(selection[0]);

//         for (let i = 0; i < selection.length; i++) {
//           // Need to avoid the PSA messages or potential information between the header and the list of See Also's
//           wikiUrls.push($(selection[i]).attr('href'));
//         }

//         console.log(wikiUrls);
        
//         // return Promise.all(
//         //   wikiUrls.map(function(url) {
//         //     return wikiParse('https://en.wikipedia.org' + url);
//         //   })
//         // );
//       })
// }

// const rp = require('request-promise');
// const $ = require('cheerio');
// const url = 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States';

// rp(url)
//   .then(function(html){
//     //success!
//     const wikiUrls = [];
//     for (let i = 0; i < 45; i++) {
//       wikiUrls.push($('big > a', html)[i].attribs.href);
//     }
//     console.log(wikiUrls);
//   })
//   .catch(function(err){
//     //handle error
//   });