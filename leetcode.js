const puppeteer=require("puppeteer");
const {email,password}=require("./secrets");

let cTab;

let browserOpenPromise=puppeteer.launch({
    headless:false,
    defaultViewport:null,
    args:["--start-maximized"]
})

browserOpenPromise
    .then(function(browser){
        console.log("Browser opened");
        let allTabsOpenPromise=browser.pages();
        return allTabsOpenPromise;
    })
    .then(function(allTabsArr){
        cTab=allTabsArr[0];
        console.log("new tabs opened");
        let loginPageVisitePromise=cTab.goto("https://leetcode.com/accounts/login/");
        return loginPageVisitePromise;
    })
    .then(function(){
        console.log("Login page visited");
        let typeEmailPromise=cTab.type('input[autocomplete="username"]',email,{delay:100});
        return typeEmailPromise;
    })
    .then(function(){
        console.log("Email typed");
        let passswordTypePromise=cTab.type('input[autocomplete="password"]',password,{delay:100});
        return passswordTypePromise;
    })
    .then(function(){
        console.log("Password typed");
        let signInClickPromise=waitAndClick('button[id="signin_btn"]');
        return signInClickPromise;
    })
    .then(function(){
        console.log("click on SignIn Button");
        let waitFor5Sec=cTab.waitForTimeout(5000);
        return waitFor5Sec;
    })
    .then(function(){
        console.log("5 second wait done");
        function getProblemPageLink(){
            let problemPageLink=document.querySelectorAll('.nav-item-container__16kF>a',{delay:50});
            let linkArr=[];
            for(let i=0;i<problemPageLink.length;i++){
                linkArr.push(problemPageLink[i].getAttribute('href'));
            }

            return linkArr;
        }

        let problemPagePromise=cTab.evaluate(getProblemPageLink);
        return problemPagePromise;
    })
    .then(function(linksArr){
        console.log(linksArr);
        let fullLink="https://leetcode.com"+linksArr[2];
        console.log(fullLink);
        let visitProblemPagePromise=cTab.goto(fullLink);
        return visitProblemPagePromise;
    })
    .then(function(){
        console.log("Problems button clicked");
        function getAllQuesLinks(){
            let allQueslinks=document.querySelectorAll('a[class="h-5 hover:text-blue-s dark:hover:text-dark-blue-s"]',{delay:100});
            let linksArr=[];
            for(let i=1;i<allQueslinks.length;i++){
                linksArr.push(allQueslinks[i].getAttribute('href'));
            }

            return linksArr;
        }

        let allQueslinksPromise=cTab.evaluate(getAllQuesLinks);
        return allQueslinksPromise;
    })
    .then(function(linksArr){
        console.log(linksArr);
        let questionSolverPromise=questionSolver(linksArr[0],0);
        return questionSolverPromise;
    })
    .then(function(){
        console.log("Question solved");
    })
    .catch(function(err){
        console.log(err);
    })


    function waitAndClick(selector){
        let myPromise=new Promise(function(resolve,reject){
            let waitForSelectorPromise=cTab.waitForSelector(selector);
            waitForSelectorPromise
                .then(function(){
                    let clickPromise=cTab.click(selector,{delay:1000});
                    return clickPromise;
                })
                .then(function(){
                    resolve();
                })
                .catch(function(err){
                    reject(err);
                })
        })

        return myPromise;
    }


    function questionSolver(url,idx){
        let myPromise=new Promise(function(resolve,reject){
            let fullLink="https://leetcode.com"+url;
            let questionVisitingPromise=cTab.goto(fullLink);
            questionVisitingPromise
                .then(function(){
                    console.log("Question page visited");
                    resolve();
                })
                .catch(function(err){
                    reject(err);
                })
        })

        return myPromise;
    }