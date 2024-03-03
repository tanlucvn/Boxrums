export const uploadImage = async (image) => {
    try {
        const timestamp = Math.floor(Date.now() / 1000);

        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "capstone");
        formData.append("api_key", "581858876613363");
        formData.append("timestamp", timestamp);


        const res = await fetch("https://api.cloudinary.com/v1_1/ddkhkc3uu/image/upload", {
            method: 'POST',
            body: formData
        });

        const data = await res.json();
        console.log(data)
        return data.secure_url;
    } catch (err) {
        return err;
    }
}
