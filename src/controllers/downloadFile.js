const path = require('path');
const downloadFile = (req,res)=>{
    try {
        const file = req.params.file;
        const filePath = path.join(__dirname, '../../public', 'files', file);
        res.download(filePath);
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = downloadFile;