// upload pdf -> store pdf -> parse text -> send to llm ->create agent -> pass through prompt -> get response/data -> save to mongoDB -> save to redis -> resume data
import extractText from "../config/pdf.js"
import { resumeAgent } from "../agents/resume.agent.js"
import Resume from "../models/resume.model.js"
import fs from "fs"
import redis from "../../../shared/redis/redis.js";

export const uploadResume = async (req, res) => {
    const file = req.file;
    try{
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        
        const userId = req.headers["x-user-id"];
        if(!userId){
            return res.status(400).json({ error: "User ID not found in headers" });
        }

        const filePath = file.path;

        const resumeText = await extractText(filePath);

        const resumeData = JSON.parse(await resumeAgent(resumeText));

        let resume = await Resume.findOne({ userId });
        // Save to MongoDB
        if(resume){
            Object.assign(resume,{ 
                ...resumeData,
                extractedText: resumeText,
            });
            await resume.save();
        }
        else{
            resume = await Resume.create({
                userId,
                extractedText:resumeText,
                ...resumeData
            })
            await resume.save();
        }

        // Save to redis
        await redis.set(`resume:${userId}`, JSON.stringify(resume), 'EX', 3600); // Cache for 1 hour

        fs.unlinkSync(filePath); // Delete the uploaded file after processing

        res.status(200).json({
            success: true,
            message: "Resume uploaded and processed successfully",
            data: resume
        });



    }catch (error){
        if(file){
            fs.unlinkSync(file.path);
        }

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Error processing resume",
            error: error.message
        });
    }
}

export const getResume = async (req, res) => {
    try{
        const userId = req.headers["x-user-id"];
        if(!userId){
            return res.status(400).json({ error: "User ID not found in headers" });
        }

        const cache = await redis.get(`resume:${userId}`);
        if(cache){
            return res.status(200).json({
                success: true,
                message: "Resume fetched from cache",
                source: "cache",
                data: JSON.parse(cache)
            });
        }

        const resume = await Resume.findOne({ userId });
        if(!resume){
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        // Save to redis
        await redis.set(`resume:${userId}`, JSON.stringify(resume), 'EX', 3600); // Cache for 1 hour

        return res.status(200).json({
            success: true,
            message: "Resume fetched successfully",
            source: "database",
            data: resume
        });


    }catch (error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching resume",
            error: error.message
        });
    }
}