import { Component, OnInit } from '@angular/core';
import * as JSZip from 'jszip';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit{
  list: any;
  fileData: any;
  javaProjectName: any;
  downloadData: {[key:string]:any} = {};
  btnDisabled: boolean = true;

  //UI Variables
  dataUnderProcess:boolean = false;
  
  ngOnInit(): void {
  }

  async callOpenAI(fileContent:any, type:any, fileName:any){

    var promptValue = null
    if(type == "Application"){
      promptValue = "Convert the following java spring code to python flask project"
    }
    else if(type == "controller"){
      promptValue = "Convert the following java spring controller code to python flask view"
    }
    else if(type == "entities"){
      promptValue = "Convert the following java spring code to python flask"
    }

    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
    apiKey: "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"//process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: promptValue+"\n"+fileContent,
    temperature: 0.7,
    max_tokens: 2000
    });
    console.log(response);    
    console.log("------\\\\\\\\\\\\\\\\\\\\\\\\\\---------------\\\\\\\\\-----");
    console.log("Type:"+type)
    console.log(response.data.choices[0].text);

    return await response.data.choices[0].text;
  }

  onChangeFile(event:any){
    
    if(event.target.files.length > 0){
      const uploadedFile = event.target.files[0];
      console.log(uploadedFile);
      sessionStorage.setItem("uploadedFileName", uploadedFile.name);


      const jsZip = require('jszip');
      sessionStorage.setItem("mainFileIsRead", "false");
      jsZip.loadAsync(uploadedFile).then((zip:any) => { 
       Object.keys(zip.files).forEach((filename) => {
        if(filename.includes("java") ){
          console.log(filename)
        }
        else{
          console.log(":::: "+filename);
        }
          zip.files[filename].async('string').then((fileData:any) => { // <----- HERE
            //this.fileData = this.fileData + '**$$##$$**' + fileData;        
            this.dataUnderProcess = true

            //  if(filename.includes("controller")){
            //   var tempName = String(filename.split("/controller/")[0]).split("/");
            //   this.javaProjectName = tempName[tempName.length - 1];
            //   console.log(this.javaProjectName);
            //  }
            
            console.log(this.downloadData);
            
            if(filename.includes("java") && filename.includes("Application")){
              var tempNameArr = filename.split("/");
              console.log("tempname = "+tempNameArr);
              var tempFileName = (tempNameArr[tempNameArr.length - 1]).replace(".java",".py");
              

              var openAiResponse = this.callOpenAI(fileData,"Application",tempFileName);
              this.downloadData[tempFileName] = openAiResponse;
            }
            if(filename.includes("java") && filename.includes("controller")) {
              var tempName = String(filename.split("/controller/")[1]).replace(".java",".py");
              var tempFileName = "controller/"+tempName;

              var openAiResponse = this.callOpenAI(fileData,"controller", tempFileName);
              this.downloadData[tempFileName] = openAiResponse;
            }
            if(filename.includes("java") && filename.includes("entities")) {
              tempName = String(filename.split("/entities/")[1]).replace(".java",".py");
              var tempFileName = "entities/"+tempName;

              var openAiResponse = this.callOpenAI(fileData,"entities", tempFileName);
              this.downloadData[tempFileName] = openAiResponse;
              console.log(this.downloadData);
            }
          });          
        });
        this.dataUnderProcess = false;
    
        
      });

      setTimeout(() => {
        this.btnDisabled = false;
      }, 48000);
      
      //Zip all the code files.
      //Download the Zip file. 
    }
  }

  onDownloadClick(){
    var jszipFile = new JSZip();

    // jszipFile.file("UPdateD"+sessionStorage.getItem("uploadedFileName")?.replace(".zip",""), "Hello World\n") ;
    // jszipFile.file("downloadData.txt", this.downloadData);
    // jszipFile.file("controller/hellowFile.txt", "hello World");

    console.log("Before that downloadData Loop");
    console.log(this.downloadData);
    for(var dataKey in this.downloadData){
      console.log(dataKey);  
      jszipFile.file(dataKey, this.downloadData[dataKey]);
    }
    
    //Create respective files for the returned python code
    //Save the converted python code in a file to be zipped.

    //Paste the jszipfile.generateAsync({type:"blob"})  here
    jszipFile.generateAsync({type:"blob"}).then(function (blob) { // 1) generate the zip file
    var FileSaver = require('file-saver');
    FileSaver.saveAs(blob, "Flask-"+String(sessionStorage.getItem("uploadedFileName")).replace(".zip","")+".zip"); // 2) trigger the download
    }, function (err) {
        console.log('err: '+ err);
    });
  }
}
