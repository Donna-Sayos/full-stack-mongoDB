const uploadFile = async (req, res) => {
    try {
        return res.status(200).json({ message: "File uploaded successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    uploadFile,
}