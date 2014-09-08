
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('photo').addEventListener('click', this.photoImgOnClick, false );
        document.getElementById('takePhoto').addEventListener('click', this.takePhotoOnClick, false );
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    errorHandler : function(e){
        var msg = '';

          switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
              msg = 'QUOTA_EXCEEDED_ERR';
              break;
            case FileError.NOT_FOUND_ERR:
              msg = 'NOT_FOUND_ERR';
              break;
            case FileError.SECURITY_ERR:
              msg = 'SECURITY_ERR';
              break;
            case FileError.INVALID_MODIFICATION_ERR:
              msg = 'INVALID_MODIFICATION_ERR';
              break;
            case FileError.INVALID_STATE_ERR:
              msg = 'INVALID_STATE_ERR';
              break;
            case FileError.ENCODING_ERR:
              msg = 'ENCODING_ERR';
              break;
            case FileError.NO_MODIFICATION_ALLOWED_ERR:
              msg = 'NO_MODIFICATION_ALLOWED_ERR';
              break;
            case FileError.NOT_READABLE_ERR:
              msg = 'NOT_READABLE_ERR';
              break;
            case FileError.PATH_EXISTS_ERR:
              msg = 'PATH_EXISTS_ERR';
              break;
            case FileError.TYPE_MISMATCH_ERR:
              msg = 'TYPE_MISMATCH_ERR';
              break;
          
            default:
              msg = 'Unknown Error';
              break;
          };
        alert(e.code + ': Error: ' + msg);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
        if(id === 'deviceready'){
            var parentElement = document.getElementById(id);
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
            
            var onInitFs = function(fs){
                alert('fileSystem '+ fs.name +' available'); 
                
                document.getElementById('createFile').addEventListener('click',function(){
                    var str = '';
                    for(var i in fs){
                        str += i + ' ';
                        if(typeof fs[i] === 'object'){
                            for(var j in fs[i]){
                                str += j + ' ';
                            }
                        }
                    }
                    
                    console.log('createFileTest ' +  ' ' + str + fs.root.fullPath);
                    console.log(fs.root.isDirectory);
                    console.log(fs.root.getFile);
                    console.log(navigator);
                    
                    
                    fs.root.getFile('log.txt', {create: true, exclusive: true }, function(fileEntry) {
 
                        // fileEntry.isFile === true
                        // fileEntry.name == 'log.txt'
                        // fileEntry.fullPath == '/log.txt'

                        console.log('hallo');
                        console.log(fileEntry.fullPath);

                      }, app.errorHandler); 
                    }
                , false );
                
                
                document.getElementById('writeFile').addEventListener('click', function(){
                    fs.root.getFile('log.txt', {create: true}, function(fileEntry){
                        fileEntry.createWriter(function(fileWriter){
                            
                            fileWriter.onwriteend = function(e) {
                              alert('Write completed.');
                            };

                            fileWriter.onerror = function(e) {
                              alert( 'Write failed: ' + e.toString());
                            };

                            // Create a new Blob and write it to log.txt.
                            var blob = new Blob(['Lorem Ipsum'], {type: 'text/plain'});

                            fileWriter.write(blob);
                            
                            
                        }, app.errorHandler);
                    }, app.errorHandler);
                }, false);
                
                
                document.getElementById('appendToFile').addEventListener('click', function(){
                    fs.root.getFile('log.txt', {create: false}, function(fileEntry) {

                    // Create a FileWriter object for our FileEntry (log.txt).
                    fileEntry.createWriter(function(fileWriter) {

                      fileWriter.seek(fileWriter.length); // Start write position at EOF.

                      // Create a new Blob and write it to log.txt.
                      var blob = new Blob(['Hello World'], {type: 'text/plain'});

                      fileWriter.write(blob);

                    }, app.errorHandler);

                  }, app.errorHandler);

                    
                    
                }, false);
                
                
                document.getElementById('loadFile').addEventListener('click', function(){
                    fs.root.getFile('log.txt', {}, function(fileEntry) {

                        // Get a File object representing the file,
                        // then use FileReader to read its contents.
                        fileEntry.file(function(file) {
                           var reader = new FileReader();

                           reader.onloadend = function(e) {
                             var txtArea = document.getElementById('fileTest');
                             txtArea.value = 'result (nix): ' +  this.result;
                           };

                           reader.readAsText(file);
                        }, app.errorHandler);

                      }, app.errorHandler);

                }, false );
                
            };
  
            window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
            window.requestFileSystem(window.TEMPORARY, 1024*1024 /*5MB*/, onInitFs, app.errorHandler);
        }
        
        console.log('Received Event: ' + id);
        
    },    
    photoImgOnClick: function(){
        document.getElementById('photo').src = 'img/owl8.jpg';
    },
    takePhotoOnClick: function(){
        
        navigator.camera.getPicture(
            //success
            function (imageData) {
                var image = document.getElementById('photo');
                image.src = "data:image/jpeg;base64," + imageData;
            }, 
            //fail
            function (message) {
                alert('Failed because: ' + message);
            },
            //options
            { 
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL 
            }
        );
        
        document.getElementById('photo').src = 'img/owl8.jpg';
    }
};
