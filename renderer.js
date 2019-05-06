"use strict";

var fs = require('fs').promises;
var html = require('js-to-html').html;

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
            await Promise.all(files.map(async function(file){
                var div2 = document.createElement('div');
                div1.appendChild(div2);
                try{
                    let stat = await fs.stat(path+'/'+file);
                    if(stat.isDirectory()){
                        var img=html.img({class:'dir-type-icon', src:"img/loading-dir-type.png"}).create();
                        div2.appendChild(img);
                        div2.appendChild(html.span(file).create());
                    }
                    try{
                        let packageJSON = await fs.readFile(path+'/'+file+'/package.json');
                        let packageFile = JSON.parse(packageJSON);
                        let repo = packageFile.repository && (packageFile.repository.url || packageFile.repository);
                        if(/https?:\/\/gitlab/.test(repo)){
                            img.src="https://about.gitlab.com/ico/favicon-32x32.png"
                        }else if(/https?:\/\/github|^[^/]*\/[^/]*$/.test(repo)){
                            img.src="https://github.com/fluidicon.png"
                        }else{
                            img.src="img/packagejson.png"
                        }
                    }catch(err){
                        if(err.code=='ENOENT'){
                            img.src="img/unknown-dir.png";
                        }else{
                            img.src="img/error.gif";
                            img.title=err.message;
                        }
                    }
                }catch(err){
                    console.log('err 2',err)
                }
            }))
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