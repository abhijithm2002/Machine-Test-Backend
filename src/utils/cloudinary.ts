import axios from "axios";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data'; 

dotenv.config();

export const uploadImageToCloudinary = async (imagePath: string): Promise<string> => {
    const cloud_name = process.env.CLOUD_NAME;
    const url = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
  
    try {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(imagePath)); 
      formData.append("upload_preset",process.env.UPLOAD_PRESET);
  
      // Axios request with proper headers for FormData
      const response = await axios.post<{ secure_url: string }>(url, formData, {
        headers: {
          ...formData.getHeaders(), 
          "Content-Type": "multipart/form-data",
        },
      });
  
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  };


  export const uploadVoiceMessageToCloudinary = async (voicePath: string): Promise<string> => {
    const cloud_name = process.env.CLOUD_NAME;
    const url = `https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`;
  
    try {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(voicePath)); 
      formData.append("upload_preset", process.env.UPLOAD_PRESET);
  
      // Axios request with proper headers for FormData
      const response = await axios.post<{ secure_url: string }>(url, formData, {
        headers: {
          ...formData.getHeaders(), 
          "Content-Type": "multipart/form-data",
        },
      });
  
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading voice message to Cloudinary:", error);
      throw error;
    }
  };