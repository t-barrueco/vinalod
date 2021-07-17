
// The download function takes the data, the filename and mimeType as parameters
// It can be configured for a nested or not nested data
// The nested data has to be in a form of AN ARRAY OF ARRAYS OF OBJECTS
// The non-nested data has to be as an ARRAYS of OBJECTS
// The output is a prompt to save a csv file   
// The function is a slightly modified version of dandavis: https://github.com/rndme/download/
// MIT License
// Copyright(c) 2016 dandavis
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files(the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and / or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

function download(data, fileName, mimeType) {
  var str = '';
  var csvContent = '';
  var outerArr = [];

  // console.log('inside download');
  // console.log(data);

  // /// if the data is nested it has to be formated as an array of arrays of primary data
  // outerArr.push(Object.keys(data[0][0]));
  // data.forEach(d => {
  //     console.log(d.length)
  //     d.forEach(e=>{
  //         // console.log(e)
  //         for(x in e) {
  //             innerArr.push(e[x]);
  //         }
  //     outerArr.push(innerArr);
  //     innerArr=[];
  //     });
  // });

  /// if the data is not nested

  outerArr.push(Object.keys(data[0]));  // column headers 

  data.forEach(d => {
    var dataString = "";
    var toStr = "";
    for (x in d) {
      toStr = String(d[x]);
      toStr = toStr.replace(/["',]/g, " ").trim();   // to replace all commas with a space 
      toStr = toStr.replace(/(\r\n|\n|\r)/gm, "");  // to remove all line brakes
      dataString += toStr + ", ";
    }
    dataString = dataString.slice(0, -2);
    outerArr.push(dataString);
  });

  /// the data is then wrote as a csv string, every row on a new line
  outerArr.forEach(function (d, index) {
    // dataString = d.join(',');

    if (index == 0) {
      str = d + '\n';
      csvContent = str;
    } else {
      csvContent += (index < data.length) ? d + '\n' : d;
    }
  });

   
  var a = document.createElement('a');
  mimeType = mimeType || 'application/octet-stream';

  if (navigator.msSaveBlob) { // IE10
    navigator.msSaveBlob(new Blob([content], {
      type: mimeType
    }), fileName);
  } else if (URL && 'download' in a) { //html5 A[download]
    a.href = URL.createObjectURL(new Blob([csvContent], {
      type: mimeType
    }));
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    location.href = 'data:application/octet-stream,' + encodeURIComponent(csvContent); // only this mime type is supported
  }
};

  // how to call download function:

  // $("#downloadBtn").on("click", function(){
  //   download(outerArr, 'dowload.csv', 'text/csv;encoding:utf-8');
  // });  



