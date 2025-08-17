import { Buffer } from 'buffer';

const BufferBase64ImageRender = (imgBufferData) => {
    // Log the data to inspect its structure
    // console.log(imgBufferData);

    // Check if the necessary data is available
    if (imgBufferData) {
        // Convert image data to base64
        const imageBase64 = Buffer.from(imgBufferData).toString('base64');
        // Construct the data URL
        const imageDataUrl = `data:image/jpeg;base64,${imageBase64}`;
        // Log the constructed URL
        // console.log('Image Data URL:', imageDataUrl);
        // Return the constructed URL
        return imageDataUrl;
    } else {
        // Handle the case where data is not in the expected format
        // console.error('Invalid data structure:', imgBufferData);
        return null;
    }
};

export default BufferBase64ImageRender;

