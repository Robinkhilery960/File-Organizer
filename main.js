let inputArr = process.argv.slice(2);
let fs = require("fs");
let path = require("path"); 
let command = inputArr[0];// this will store my command 
let types={
    pdfs:["pdf"],
    media:["mp4",'jpeg',"jpg"]
}
switch (command) {
    case "tree":
        treeFn(inputArr[1]);
        break;
    case "organize":
        organizeFn(inputArr[1]);
        break;
    case "help":
        help();
        break;
    default:
        console.log("enter the right command");
        break;
} 
function treeHelper(dirPath){
    let isFile=fs.lstatSync(dirPath);
    if(isFile){
let fileName=path.basename(dirPath,indent);
console.log(indent+"-"+fileName);
    }
    else{
        let dirName=path.basename(dirPath);
        console.log(indent+"-"+ dirName);
        let childern=fs.readdirSync(dirPath);
        for(let i=0;i<childern.length;i++){
            let childrenPath=path.join(dirPath,childern[i])
treeHelper(childrenPath,indent+"\t");
        }
    }
}
function organizeFn(dirPath) { 
    // 1. input-> path of that folder you want to Organize
    let destPath;
    if (dirPath == undefined) {
        console.log("please enter the path");
        return;
    }
    else {

        let doesExist = fs.existsSync(dirPath);
        if (doesExist) {
            // 2. create organise name  directory  in input directory 
             destPath = path.join(dirPath, "organized_files");
            if (fs.existsSync(destPath) == false) {
                fs.mkdirSync(destPath);
            }
           
        }

        else {
            console.log("please enter the correct path");


        }
    }
    organiseHelper(dirPath,destPath);
}
function organiseHelper(dirPath,destPath){
    // 3. identify  kind of file in your input directory 
    let childNames=fs.readdirSync(dirPath);// gave only name  
    for(let i=0;i<childNames.length;i++){
        let childAddress=path.join(dirPath,childNames[i]);// file  address
        let isFile=fs.lstatSync(childAddress).isFile();// check file or not 
        if(isFile){ 
            let catagory=getcatagory(childNames[i]); 
            // 4. copy/cut  files from that input directory 
sendFiles(childAddress,destPath,catagory);

}

}

}
function getcatagory(name){
    let ext=path.extname(name);
    
    ext=ext.slice(1);
    // console.log(ext);
    for(let type in types){
let cTypeArray=types[type];
for(let i=0;i<cTypeArray.length;i++)
{
if(ext==cTypeArray){
return type;
}
}
    }
    return 'others';
}
function sendFiles(srcFile,destPath,catagory){
    // let make catagory path media 
    let catagoryPath=path.join(destPath,catagory);
    if(fs.existsSync(catagoryPath)==false){
fs.mkdirSync(catagoryPath);
    }
    let fileName=path.basename(srcFile);
    let destFilePath=path.join(catagoryPath,fileName);
    fs.copyFileSync(srcFile,destFilePath);
    fs.unlinkSync(srcFile );
}


// help implemented
function help() {
    console.log(`
                  help- node main.js help
                  node main.js tree "directoryPath"
                  node main.js organize  "directoryPath"
     `);
}
