
  function debug_trace(str) {
    alert(str);
    console.log("debug_trace[" + str + "]");
    // $.alert(st);
  }

  function del_space(str) {

    if( String(str).length == 0 ) {
      return str;
    } else {
      return String(str).replace(/(^\s*)|(\s*$)/g, "");//去前后空格
    }
  }


    function parseURL(urlStr) {

        var paramObj = [];

        var url = decodeURI(decodeURI(urlStr));
        url.trim();

        if( url == "" ) {
            return paramObj;
        }

        var splitStr = url.split('?');
        
        var param = [];
        param["key"] = "url";
        param["value"] = splitStr[0];
        paramObj.push(param);

        if( splitStr.length == 2 ) {

            var waitPaseStr = splitStr[1];
            splitStr = waitPaseStr.split('&');

            for( var i = 0; i < splitStr.length; i++ ) {

                waitPaseStr = splitStr[i];
                var keyValueSplit = waitPaseStr.split('=');

                if( keyValueSplit.length == 2 ) {
                    param = [];
                    param["key"] = keyValueSplit[0];
                    param["value"] = keyValueSplit[1];
                    paramObj.push(param);
                }
            }
        }

        var outputStr = "";
        for( var i = 0; i < paramObj.length; i++ ) {
            outputStr += "[" + paramObj[i]["key"] + "," + paramObj[i]["value"] + "] ";
        }
        console.log(outputStr);

        return paramObj;
    }


  function get_date_time(date, field)
  {
    switch( field ){
      case 'y' :
        return '' + date.getFullYear();
        break;
      case 'mon' :
        var val = date.getMonth();
        val += 1;
        if(val<10) {
          return '0' + val;
        } else {
          return '' + val;
        }
        break;
      case 'd' :
        var val = date.getDate();
        if(val<10) {
          return '0' + val;
        } else {
          return '' + val;
        }
        break;
      case 'h' :
        var val = date.getHours();
        if(val<10) {
          return '0' + val;
        } else {
          return '' + val;
        }
        break;
      case 'min' :
        var val = date.getMinutes();
        if(val<10) {
          return '0' + val;
        } else {
          return '' + val;
        }
        break;
      default :
        break;
    }
  }

  function format_date_time(data_time) { 

    if( data_time == undefined ) {
      return '';
    }

    var src = del_space(data_time);

    if(src.length == 0) {
      return src;
    }

    var date = new Date(src);
    var result = "";
    var field = "";

    //year
    result += "" + date.getFullYear();
    result += "-";

    //month
    field = "" + (date.getMonth()+1);
    if(field.length==1) {
      result += "0";
    }
    result += field;
    result += "-";

    //day
    field = "" + date.getDate();
    if(field.length==1) {
      result += "0";
    }
    result += field;
    result += " ";

    //hour
    field = "" + date.getHours();
    if(field.length==1) {
      result += "0";
    }
    result += field;
    result += ":";

    //minutes
    field = "" + date.getMinutes();
    if(field.length==1) {
      result += "0";
    }
    result += field;
    // result += ":";

    // //seconds
    // field = "" + date.getSeconds();
    // if(field.length==1) {
    //   result += "0";
    // }
    // result += field;

    return result;
  }



    
