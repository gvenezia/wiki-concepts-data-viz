// Packages
const rp = require('request-promise');
const $  = require('cheerio');


// var request = require('request');

const wikiParse = function(url, iterationsLeft) {
  console.log("Call #: ", callNum, " —— Depth: ", Math.abs(1 - iterationsLeft));

  let options2 = {
            uri: url,
            resolveWithFullResponse: true
          }

  return rp(options2)
    .then(function(passedOptions) {
      let passedUrl = passedOptions.body;
      let returnObj = {};
      let entryName = $('.firstHeading', passedUrl).text();

      let wikiUrls = [];
      let wikiNames = [];

      if (passedOptions.statusCode !== 200){
        console.log('STATUS CODE = ', passedOptions.statusCode)
        console.log("Return #: ", returnNum++);

        return entryName;
      }

      // If 'See Also' section, then push the concept names and wikiUrls
      if ($('#See_also', passedUrl).text() !== "" ) {
        let afterSeeH2 = $('#See_also', passedUrl).parent().next();
        let selection = '';

          // Accommodate all possible formatting of the 'See Also' section
          if ( afterSeeH2.prop("tagName") === 'UL') {
            selection = afterSeeH2.find('li > a');

          } else if (afterSeeH2.prop("tagName") === 'TABLE'){
            selection = afterSeeH2.next().find('ul > li > a');

          } else if (afterSeeH2.prop("tagName") === 'DIV'){
            if (afterSeeH2.attr("role") === 'navigation'){
              selection = afterSeeH2.next().find('ul > li > a');
            } else {
              selection = afterSeeH2.find('li > a');
            }

          } else {
            selection = afterSeeH2.next().find('ul > li > a');

          }

        // Iterate through selection
        for (let i = 0; i < selection.length; i++) {
          // if (selection[i].attr('href').slice(0,12) !== '/wiki/Portal'){
            if ( iterationsLeft == 0 )          
              wikiNames.push($(selection[i]).text());
            else
              wikiUrls.push($(selection[i]).attr('href'));
          // }
        }

      } else { // If no 'See Also' then just return an empty array (no further levels to go into) 
        console.log("Return #: ", returnNum++);

        returnObj.name = entryName
        returnObj.children = [];
        return returnObj;

        // returnObj[entryName] = [];
        // return returnObj;
      }

      // If the last iteration, then return the full object with the entryName ad the array
      if (iterationsLeft == 0){
        console.log("Return #: ", returnNum++);

        returnObj.name = entryName
        returnObj.children = wikiNames
        return returnObj;

        // returnObj[entryName] = wikiNames;
        // return returnObj;

      // If not the last iteration, then go down another level  
      } else {

        return Promise.all(
            wikiUrls.map(function(url) {
              return wikiParse('https://en.wikipedia.org' + url, iterationsLeft - 1, callNum++);
            })
          ).then(function(urlMapResults){
              console.log("Return #: ", returnNum++);

              returnObj.name = entryName
              returnObj.children = urlMapResults
              return returnObj;

              // returnObj[entryName] = urlMapResults;
              // return returnObj;
          }).catch(function(err) {
            // console.log(err.response)
            if (err.response !== undefined){
              console.log("Topic: ", $('.firstHeading', err.response.body).text());  
            } else {
              console.log("~~~~~~ No response ~~~~~~~");
            }
            
            console.log("statusCode: ", err.statusCode, "\n");
          });
      }
      
    })
    .catch(function(err) {
      // console.log(err.response)
      if (err.response !== undefined){
        console.log("Topic: ", $('.firstHeading', err.response.body).text());  
      } else {
        console.log("~~~~~~ No response ~~~~~~~");
      }
      
      console.log("statusCode: ", err.statusCode, "\n");
    });
};

module.exports = wikiParse;