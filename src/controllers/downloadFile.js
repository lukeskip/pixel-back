const path = require('path');
const downloadFile = (req,res)=>{
    const file = req.params.file;
    const filePath = path.join(__dirname, '../../public', 'files', file);
    try {
        res.download(filePath);
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = downloadFile;