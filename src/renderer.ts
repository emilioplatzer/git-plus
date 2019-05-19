"use strict";

import {promises as fs} from 'fs';
import {html} from 'js-to-html';

async function renderProject(path: string){
    try{
        const files = await fs.readdir(path);
        if(files && files.length){
            const container = document.getElementById('projects');
            const div1 = document.createElement('div');
            container.appendChild(div1);
            const title = document.createElement('h2');
            div1.append(title);
            title.textContent = path;
            await Promise.all(files.map(async (file) => {
                const div2 = document.createElement('div');
                div1.appendChild(div2);
                try{
                    const stat = await fs.stat(path+'/'+file);
                    if(stat.isDirectory()){
                        const img=html.img({class:'dir-type-icon', src:"img/loading-dir-type.png"}).create();
                        div2.appendChild(img);
                        div2.appendChild(html.span(file).create());
                        try{
                            const packageJSON = await fs.readFile(path+'/'+file+'/package.json','utf8');
                            const packageFile = JSON.parse(packageJSON);
                            const repo = packageFile.repository
                                && (packageFile.repository.url || packageFile.repository);
                            if(/https?:\/\/gitlab/.test(repo)){
                                img.src="https://about.gitlab.com/ico/favicon-32x32.png";
                            }else if(/https?:\/\/github|^[^/]*\/[^/]*$/.test(repo)){
                                img.src="https://github.com/fluidicon.png";
                            }else{
                                img.src="img/packagejson.png";
                            }
                        }catch(err){
                            if(err.code === 'ENOENT'){
                                img.src="img/unknown-dir.png";
                            }else{
                                img.src="img/error.gif";
                                img.title=err.message;
                            }
                        }
                    }
                }catch(err){
                    div1.textContent = err.message;
                }
            }));
        }
    }catch(err){
        if(err.code !== 'ENOENT'){
            const errContainer = document.getElementById('projects');
            const div1 = document.createElement('div');
            errContainer.appendChild(div1);
            div1.textContent=err.message;
        }
    }
}

window.addEventListener('load', ()=>{
    renderProject('c:/hecho/npm');
    renderProject('d:/hecho/npm');
});
