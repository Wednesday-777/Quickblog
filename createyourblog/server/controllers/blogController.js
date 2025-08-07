import fs from 'fs'
import imageKit from '../configs/imageKit.js';
import Blog from '../models/Blog.js';




export const addBlog = async (req, res)=>{
    try {
        const {title, subTitle, description, category, isPublished} = JSON.parse(req.body.blog)
        const imageFile = req.file;
        
        // Check if all fields are filled
        if(!title || !description || !category || !imageFile){
            return res.json({success: false, message: "Missing required fields"})
        }

        const fileBuffer = fs.readFileSync(imageFile.path)

        // Upload image to ImageKit
        const response = await imageKit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs"
        })

        // optimization through imagekit url transformation
        const optimizedImageUrl = imageKit.url({
            path: response.filePath,
            transformation: [
                {quality: 'auto'}, // auto compression
                {format: 'webp'}, // convert to modern format
                {width: '1280'} // width resizing
            ]
        });
        const image = optimizedImageUrl;

        await Blog.create({title, subTitle, description, category, image, isPublished})

        res.json({success: true, message: "Blog added successfully"})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}