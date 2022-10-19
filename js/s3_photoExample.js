var albumBucketName = "vinalod";
var bucketRegion = "us-east-1";
var IdentityPoolId = "us-east-1:b863f29f-01bc-4715-a3e3-313e3af07449";

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});

var s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: albumBucketName }
});
console.log(s3)
//addPhoto("name")
addFile()
//listAlbums()
function listAlbums() {
    s3.listObjects({ Delimiter: "/" }, function(err, data) {
      if (err) {
        return alert("There was an error listing your albums: " + err.message);
      } else {
        console.log(data)
/*         var albums = data.CommonPrefixes.map(function(commonPrefix) {
          var prefix = commonPrefix.Prefix;
          var albumName = decodeURIComponent(prefix.replace("/", ""));
          return getHtml([
            "<li>",
            "<span onclick=\"deleteAlbum('" + albumName + "')\">X</span>",
            "<span onclick=\"viewAlbum('" + albumName + "')\">",
            albumName,
            "</span>",
            "</li>"
          ]);
        });
        var message = albums.length
          ? getHtml([
              "<p>Click on an album name to view it.</p>",
              "<p>Click on the X to delete the album.</p>"
            ])
          : "<p>You do not have any albums. Please Create album.";
        var htmlTemplate = [
          "<h2>Albums</h2>",
          message,
          "<ul>",
          getHtml(albums),
          "</ul>",
          "<button onclick=\"createAlbum(prompt('Enter Album Name:'))\">",
          "Create New Album",
          "</button>"
        ];
        document.getElementById("app").innerHTML = getHtml(htmlTemplate); */
      }
    });
  }

function addFile(){
    var file = '/Users/teresab/Documents/VINALOD/config_vinalod_30_12_2021/config_basicMode.json';
    //var fileName = file.name;
    //var albumPhotosKey = encodeURIComponent(albumName) + "/";
  
    //var photoKey = albumPhotosKey + fileName;
    var upload = new AWS.S3.ManagedUpload({
        params: {
          Bucket: albumBucketName,
          Key: 'config_basicMode.json',
          Body: file
        }
      });
    
      var promise = upload.promise();
    
      promise.then(
        function(data) {
          alert("Successfully uploaded photo.");
          viewAlbum(albumName);
        },
        function(err) {
          return alert("There was an error uploading your photo: ", err.message);
        }
      );
    //s3.meta.client.upload_file('/Users/teresab/Documents/VINALOD/config_vinalod_30_12_2021/config_basicMode.json', 'vinalod', 'config_basicMode.json')
}
function addPhoto(albumName) {
    var files = document.getElementById("photoupload").files;
    if (!files.length) {
      return alert("Please choose a file to upload first.");
    }
    var file = files[0];
    var fileName = file.name;
    var albumPhotosKey = encodeURIComponent(albumName) + "/";
  
    var photoKey = albumPhotosKey + fileName;
  
    // Use S3 ManagedUpload class as it supports multipart uploads
    var upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: albumBucketName,
        Key: photoKey,
        Body: file
      }
    });
  
    var promise = upload.promise();
  
    promise.then(
      function(data) {
        alert("Successfully uploaded photo.");
        viewAlbum(albumName);
      },
      function(err) {
        return alert("There was an error uploading your photo: ", err.message);
      }
    );
  }
  
