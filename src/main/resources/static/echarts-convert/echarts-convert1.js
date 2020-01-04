(function() {  
    var system = require('system');  
    var fs = require('fs');  
    var config = {  
        // define the location of js files  
        JQUERY : 'jquery-1.9.1.min.js',  
        ECHARTS3 : 'echarts/echarts-all4.js',
        //ECHARTS3 : 'echarts.min_4.js',
        // default container width and height
        DEFAULT_WIDTH : '1000',
        DEFAULT_HEIGHT : '600'
    }, parseParams, render;
  
    usage = function() {  
        console.log("\nUsage: phantomjs echarts-convert.js -options options -outfile filename -width width -height height"  
                        + "OR"  
                        + "Usage: phantomjs echarts-convert.js -infile URL -outfile filename -width width -height height\n");  
    };  
  
    pick = function() {  
        var args = arguments, i, arg, length = args.length;  
        for (i = 0; i < length; i += 1) {  
            arg = args[i];  
            if (arg !== undefined && arg !== null && arg !== 'null' && arg != '0') {  
                return arg;  
            }  
        }  
    };  
    var base64Pad = '=';
    var toBinaryTable = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
                         52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 0, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
                         15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
                         41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
                     ];
    base64ToString = function(data) { 
    	//console.log("data  = "+data);
        var result = '';  
        var leftbits = 0; // number of bits decoded, but yet to be appended    
        var leftdata = 0; // bits decoded, but yet to be appended   
        // Convert one by one.                                                                               
        for (var i = 0; i < data.length; i++) {
        	var c = toBinaryTable[data.charCodeAt(i) & 0x7f];  
        	//console.log("i  = "+c);
            var padding = (data.charCodeAt(i) == base64Pad.charCodeAt(0));  
            // Skip illegal characters and whitespace    
            if (c == -1) continue;  
  
            // Collect data into leftdata, update bitcount    
            leftdata = (leftdata << 6) | c;  
            leftbits += 6;  
  
            // If we have 8 or more bits, append 8 bits to the result   
            if (leftbits >= 8) {  
                leftbits -= 8;  
                // Append if not padding.   
                if (!padding)  
                    result += String.fromCharCode((leftdata >> leftbits) & 0xff);  
                leftdata &= (1 << leftbits) - 1;  
            }  
  
        }  
        console.log(result);
//        if (leftbits)  
//            throw Components.Exception('Corrupted base64 string'); 
        
        return result;  
    };

    getParams = function() {
        var map={}, i, key;
        if (system.args.length < 2) {
            usage();
            phantom.exit();
        }
        for (i = 0; i < system.args.length; i += 1) {
            if (system.args[i].charAt(0) === '-') {
                key = system.args[i].substr(1, i.length);
                if (key === 'infile') {
                     key = 'path';
                    try {
                    	var vals = system.args[i + 1];
                    	console.log("vals  =  "+vals);
                        map[key] = vals;
                    } catch (e) {
                        console.log('Error: cannot find file, ' + system.args[i + 1]);
                        phantom.exit();
                    }
                } else {
                    map[key]= system.args[i + 1];
                }
            }
        }
        return map;
    };
    parseParams = function() {
        var map = {};
         var data= getParams();
         var dataPath=data.path;
        console.log("+++++dataPath++++++++")
        console.log("dataPath-----"+dataPath)
            var fs = require('fs');
        var str = fs.read(dataPath);
        map['options']=str;
        map['outfile']=data.outfile;
        return map;
    };

    render = function(params) {  
        var page = require('webpage').create(), createChart;  
  
        page.onConsoleMessage = function(msg) {  
            console.log(msg);  
        };  
  
        page.onAlert = function(msg) {  
            console.log(msg);  
        };  
  
        createChart = function(inputOption, width, height) {  
            var counter = 0;  
            function decrementImgCounter() {  
                counter -= 1;  
                if (counter < 1) {  
                    console.log(messages.imagesLoaded);  
                }  
            }  
  
            function loadScript(varStr, codeStr) {  
                var script = $('<script>').attr('type', 'text/javascript');  
                script.html('var ' + varStr + ' = ' + codeStr);
                document.getElementsByTagName("head")[0].appendChild(script[0]);  
                if (window[varStr] !== undefined) {  
                    console.log('Echarts.' + varStr + ' has been parsed');  
                }
            }  
  
            function loadImages() {  
                var images = $('image'), i, img;  
                if (images.length > 0) {  
                    counter = images.length;  
                    for (i = 0; i < images.length; i += 1) {  
                        img = new Image();  
                        img.onload = img.onerror = decrementImgCounter;  
                        img.src = images[i].getAttribute('href');  
                    }  
                } else {  
                    console.log('The images have been loaded');  
                }  
            }  
            // load opitons  
            if (inputOption != 'undefined') {  
                // parse the options  
                loadScript('options', inputOption);  
                // disable the animation  
                options.animation = false;
            }  
  
            // we render the image, so we need set background to white.  
            $(document.body).css('backgroundColor', 'white');  
            var container = $("<div>").appendTo(document.body);  
            container.attr('id', 'container');  
            container.css({  
                width : width,  
                height : height  
            });  

            // render the chart  
            var myChart = echarts.init(document.getElementById("container"));
            myChart.setOption(options);  
            // load images  
            loadImages();  
        };  
  
        // parse the params  
        page.open("about:blank", function(status) {  
            // inject the dependency js  
            page.injectJs(config.JQUERY);  
            page.injectJs(config.ECHARTS3);
  
            var width = pick(params.width, config.DEFAULT_WIDTH);  
            var height = pick(params.height, config.DEFAULT_HEIGHT);  
  
            // create the chart  
            page.evaluate(createChart, params.options, width, height);  
  
            // define the clip-rectangle  
            page.clipRect = {  
                top : 0,  
                left : 0,  
                width : width,  
                  
                height : height  
            };  
            // render the image  
            page.render(params.outfile);  
            console.log('render complete:' + params.outfile);  
            // exit  
            phantom.exit();  
        });  
    };  
    // get the args  
    var params = parseParams();  
  
    // validate the params  
    if (params.options === undefined || params.options.length === 0) {  
        console.log("ERROR: No options or infile found.");  
        usage();  
        phantom.exit();  
    }

    // set the default out file  
    if (params.outfile === undefined) {  
        var tmpDir = fs.workingDirectory + '/tmp';  
        // exists tmpDir and is it writable?  
        if (!fs.exists(tmpDir)) {  
            try {  
                fs.makeDirectory(tmpDir);  
            } catch (e) {  
                console.log('ERROR: Cannot make tmp directory');  
            }  
        }  
        params.outfile = tmpDir + "/" + new Date().getTime() + ".png";  
    }  
  
    // render the image  
    render(params);  
}());  