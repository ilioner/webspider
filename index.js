/**
 * Created by tywin on 16/6/18.
 */
var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var xpath = require('xpath')
    , dom = require('xmldom').DOMParser;
var fs= require('fs');
var path = require('path');


// http://www.bestweb-link.net/PD-Museum-of-Art/ukiyoe/html/1440_sharaku.html
// http://www.bestweb-link.net/PD-Museum-of-Art/ukiyoe/html/1440_utamaro-1.html
// http://www.bestweb-link.net/PD-Museum-of-Art/ukiyoe/html/1440_utamaro-2.html
// http://www.bestweb-link.net/PD-Museum-of-Art/ukiyoe/html/1440_utamaro-3.html
// http://www.bestweb-link.net/PD-Museum-of-Art/ukiyoe/html/1440_utamaro-4.html
// http://www.bestweb-link.net/PD-Museum-of-Art/ukiyoe/html/1440_utamaro-5.html
// http://www.bestweb-link.net/PD-Museum-of-Art/ukiyoe/html/1440_utamaro-6.html

var fatherAry = [];
var subAry = [];
var fatherFlag = 0;
var flagIndex = 0;

// 浮世绘 http://www.bestweb-link.net/PD-Museum-of-Art/ukiyoe/html/1440_kuniyoshi.html
// 世界名画 http://www.bestweb-link.net/PD-Museum-of-Art/index.html
    superagent.get('http://www.bestweb-link.net/PD-Museum-of-Art/index.html').end(function(err, res){
    // 请求返回后的处理
    // 将response中返回的结果转换成JSON对象
    var heroes = res.text;
    var $ = cheerio.load(res.text,{decodeEntities: false})
    // console.log($('.box4 a').length);

    getBigFinder(res.text,$);
    // getSubFinder(res.text,$);


    // //提取文件名称
    // for (var index = 0;index<$('.box3').length;index++){
    //     var dom = $('.box3')[index];
    //     for (var i = 0;i<dom.children.length;i++){
    //         var subDom = dom.children[i];
    //         if (typeof (subDom.data) == 'undefined'){
    //             continue;
    //         }
    //         console.log(subDom.data);
    //     }
    // }

    // 输出文件链接
    // for (var index = 0;index<$('.box2 a').length;index++){
    //     var dom = $('.box2 a')[index];
    
    //     if(index%2==0){
    //         console.log('wget http://www.bestweb-link.net/PD-Museum-of-Art/ukiyoe/'+ dom.attribs.href.substr(3));
    //     }
    // }
    
    // for (var index = 0;index<$('.box3 a').length;index++){
    //     var dom = $('.box3 a')[index];
    
    //     if(index%2==0){
    //         console.log('wget http://www.bestweb-link.net/PD-Museum-of-Art/ukiyoe/'+ dom.attribs.href.substr(3));
    //     }
    // }
    
    // for (var index = 0;index<$('.box4 a').length;index++){
    //     var dom = $('.box4 a')[index];
    
    //     if(index%2==0){
    //         console.log('wget http://www.bestweb-link.net/PD-Museum-of-Art/ukiyoe/'+ dom.attribs.href.substr(3));
    //     }
    // }

    })

function getBigFinder(html,$) {
    //提取文件夹名称
    for(var index = 0;index<$('.side_box h3').length-1;index++){
        var dom = $('.side_box h3')[index];
        for (var i = 0;i<dom.children.length;i++) {
            var subDom = dom.children[i];
            if (typeof (subDom.data) == 'undefined') {
                continue;
            }
            
            var data = {};
            data.dataDom = dom.next;
            data.title = subDom.data;
            fatherAry.push(data);
        }
    }
    fatherFlag = 0;
    getSubFinder(fatherAry[fatherFlag].dataDom,fatherAry[fatherFlag].title);
}

//子列表
 function getSubFinder (subDom,fatherTitle) {
     console.log("mkdir "+fatherTitle.replace(/　/,""));
     console.log("cd "+fatherTitle.replace(/　/,""));
     subAry = [];
        for (var i = 0;i<subDom.next.children.length;i++){
            var subItem = subDom.next.children[i];
            if (subItem.name == 'p'){
                
                for (var subI=0;subI<subItem.children.length;subI++){
                    var subSubItem = subItem.children[subI];
                    
                    var name = subSubItem.children[0].data;
                    // 浮世绘 http://www.bestweb-link.net/PD-Museum-of-Art/ukiyoe/html/
                    // 世界名画 http://www.bestweb-link.net/PD-Museum-of-Art/
                    var address = "http://www.bestweb-link.net/PD-Museum-of-Art/"+subSubItem.attribs.href;
                    var rege =new RegExp("★.*");
                    if(rege.test(name)){
                        continue;
                    }
                    
                    var data = {};
                    data.name = name;
                    data.address = address;
                    subAry.push(data);
                }
            }
        }
        flagIndex = 0;
        openSubPage(subAry[flagIndex].name,subAry[flagIndex].address)
}

function openSubPage(name,address){
    
        console.log("--------------");
        // console.log(name.replace(/ /,"").replace(/：/,"")+"======>"+address);//
        console.log("mkdir "+name.replace(/ /,"").replace(/：/,"").replace(/　/,"").replace(/ /,""));
        console.log("cd "+name.replace(/ /,"").replace(/：/,"").replace(/　/,""));
        superagent.get(address).end(function(err, res){
            // 请求返回后的处理
            // 将response中返回的结果转换成JSON对象
            var heroes = res.text;
            var $ = cheerio.load(res.text,{decodeEntities: false})
            // 浮世绘 http://www.bestweb-link.net/PD-Museum-of-Art/ukiyoe/
            // 世界名画 http://www.bestweb-link.net/PD-Museum-of-Art/
            //输出文件链接
            for (var index = 0;index<$('.box2 a').length;index++){
                var dom = $('.box2 a')[index];
            
                if(index%2==0){
                  console.log('wget http://www.bestweb-link.net/PD-Museum-of-Art/'+ dom.attribs.href.substr(3));
                }
            }
            
            for (var index = 0;index<$('.box3 a').length;index++){
                var dom = $('.box3 a')[index];
            
                if(index%2==0){
                  console.log('wget http://www.bestweb-link.net/PD-Museum-of-Art/'+ dom.attribs.href.substr(3));
                }
            }
            
            for (var index = 0;index<$('.box4 a').length;index++){
                var dom = $('.box4 a')[index];
            
                if(index%2==0){
                  console.log('wget http://www.bestweb-link.net/PD-Museum-of-Art/'+ dom.attribs.href.substr(3));
                }
            }
            flagIndex += 1;
            if (flagIndex < subAry.length){
                console.log("cd ../");
                openSubPage(subAry[flagIndex].name,subAry[flagIndex].address)
            }else{
                fatherFlag += 1;
                if (fatherFlag < fatherAry.length){
                    console.log("cd ../../");
                    getSubFinder(fatherAry[fatherFlag].dataDom,fatherAry[fatherFlag].title);
                }
            }
        });
}
