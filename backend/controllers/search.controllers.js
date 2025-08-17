// const { truncate } = require('fs');
const Post = require('../models/post.model');
const cheerio = require('cheerio');


exports.getSearchQueries = async (req, res) => {
    const { query } = req.params; 
    console.log("backend response :", query);
    
    try {
        const results = await Post.aggregate([
            { 
                $match : { title : { $regex : query, $options : 'i' }}
            },
            { 
                $project : { title : 1, truncatedContent : { $substr : ["$content", 0, 200] }}
            }
        ]);

        results.forEach(element => {
            const $ = cheerio.load(element.truncatedContent);
            element.truncatedContent = $.text() + '...';
            // if(element.truncatedContent.length < element.content.length){
            //     element.truncatedContent += '...';
            // }
        });

        res.status(201).json({
            success : true , 
            message : 'Search succesfully',
            data : results
        }); 

        console.log(results);  
    } 
    catch (error) {
        res.status(500).json({
            success : false , 
            message : 'Error in search :', error,
        });
    }
};  