'use strict';

const express = require('express');
const app = express();
app.use(express.json());

let candidates = [];
// for testing purposes: let candidates = [{id:"a","name": "b", "skills":"c"}];

function addCandidate(candidate){
  candidates.push(candidate);
}

function searchBestCandidate(skills){
    let candidatesWithSkills = [];
    candidates.forEach(candidate => {
        let candidateFiltered = candidate.skills.filter(e => skills.includes(e));
        if(candidateFiltered.length> 0){
            candidatesWithSkills.push(candidate);
        }
    }); 
    candidatesWithSkills.sort(skillSortFunction);
    return candidatesWithSkills[0];    
}

/* places candidate with most skills at the begining of the array */
function skillSortFunction(a, b) {
    return (b.skills || []).length - (a.skills || []).length;
}

app.post('/candidates', async function(req, res) {
  if(!req.body){
    return res.status(400).send("Candidate was not entered")
  }else{
    let candidate = req.body;
    await addCandidate(candidate);
    return res.status(201).send(candidate)    
  }
});

app.get('/candidates/search', async function(req, res) {
  if(candidates.length ==0){
    return res.status(404).send("There are no candidates")
  }
  if(req.query.skills||req.query.skills!=""){
    let skills = req.query.skills.split(",");
    let bestCandidate = await searchBestCandidate(skills);
    if(!bestCandidate || Object.keys(bestCandidate).length === 0){
        return res.status(404).send("Candidate not found")
    }
    if(bestCandidate.skills.length===0){
        return res.status(404).send("No suitable candidates");
    }
    return res.status(200).send(bestCandidate);
  }else{
    return res.status(400).send("No skills were defined")
  }
});

app.listen(process.env.HTTP_PORT || 3000);
