"use strict";

var fs = require('fs').promises;

/** @param {number} path */
async function renderProject(path){
    try{
        let files = await fs.readdir(path)
        if(files && files.length){
            var container = document.getElementById('projects')
            var div1 = document.createElement('div');
            container.appendChild(div1);
            var title = document.createElement('h2');
            div1.append(title);
            title.textContent = path; 
            for(let file of files){
                var div2 = document.createElement('div');
                div1.appendChild(div2);
                div2.textContent=file;
            }
        }
    }catch(err){
        if(err.code!='ENOENT'){
            var container = document.getElementById('projects')
            var div1 = document.createElement('div');
            container.appendChild(div1);
            div1.textContent=err.message;
        }
    }
}

renderProject('c:/hecho/npm');
renderProject('d:/hecho/npm');