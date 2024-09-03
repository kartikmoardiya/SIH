const express = require('express')
const app = express()
const router = express.Router()
const Data = require('../Models/data')

// Event mate
router.post('/add/genlink', async(req,res)=>{
    const gen_link = req.body.gel_link;

    let link = "";
    for(let i = 0 ; i < gen_link.length; i++)
    {
        if(gen_link[i] == '&')
        {
            break;
        }else{
            link+=gen_link[i];
        }
    }

    const existingLink = await Data.findOne({link});
    if(existingLink)
    {
        const result = await Data.updateOne(
            { link: link },
            { $set: {gen_link} }
        );
    }else{
        let obj = {link : link, gen_link : gen_link}
        await Data.insertMany([obj])
    }
    res.json({msg:"Data Added Successfully"})
})

// Video Click Kre tyare
router.post('/genlink', async (req,res)=>{
    const link = req.body.link;

    let data = await Data.findOne({link});

    if(data)
    {
        res.json({data})
    }else{
        let gen_link = link;
        let time = "&t=000s";

        for(let i = 0 ; i < time.length; i++)
        {
            gen_link+=time[i];
        }
        data = {link : link, gen_link : gen_link}
        await Data.insertMany([data])
        res.json({data})
    }

})
module.exports = router