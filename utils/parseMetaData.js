module.exports = function(str){
   var metadata = str.substring(13).split(";");
   metadata = metadata[0].substring(0, metadata[0].length-1).split(" - ");
   if (!metadata[0]) metadata[0] = "Unknown";
   if (!metadata[1]) metadata[1] = "Unknown";
       
   return {
       artist: metadata[0],
       title: metadata[1]
   }
}