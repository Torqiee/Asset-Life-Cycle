const xlsx = require('xlsx');
const Hardware = require('../models/Boq/hardwareModel');
const Software = require('../models/Boq/softwareModel');
const Service = require('../models/Boq/serviceModel');

exports.uploadExcel = async (request, response) => {
    try {
        if (!request.file) {
            return response.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const workbook = xlsx.read(request.file.buffer, { type: 'buffer' });
        const sheetNames = workbook.SheetNames;
        if (sheetNames.length < 3) {
            return response.status(400).json({ success: false, message: 'The Excel file must contain at least 3 sheets (Hardware, Software, Service)' });
        }

        const { folderId } = request.body;
        if (!folderId) {
            return response.status(400).json({ success: false, message: 'Folder ID is required' });
        }

        // Helper function to parse sheet data
        const parseSheet = (sheetIndex) => {
            if (!sheetNames[sheetIndex]) return [];
            return xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[sheetIndex]]);
        };

        const hardwareData = parseSheet(0).map(item => ({
            folderId,
            type: item.Type || '',
            brand: item.Brand || '',
            series: item.Series || '',
            unit: item.Unit || '',
            quantity: item.Quantity || 0,
            site: item.Site || '',
            createdBy: request.username,
        }));

        const softwareData = parseSheet(1).map(item => ({
            folderId,
            brand: item.Brand || '',
            series: item.Series || '',
            license: item.License || '',
            quantity: item.Quantity || 0,
            site: item.Site || '',
            createdBy: request.username,
        }));

        const serviceData = parseSheet(2).map(item => ({
            folderId,
            name: item.Name || '',
            quantity: item.Quantity || 0,
            license: item.License || '',
            site: item.Site || '',
            createdBy: request.username,
        }));

        // Insert data into MongoDB
        const savedHardware = hardwareData.length ? await Hardware.insertMany(hardwareData) : [];
        const savedSoftware = softwareData.length ? await Software.insertMany(softwareData) : [];
        const savedService = serviceData.length ? await Service.insertMany(serviceData) : [];

        response.status(201).json({
            success: true,
            message: 'Data successfully uploaded',
            data: {
                hardware: savedHardware,
                software: savedSoftware,
                service: savedService
            }
        });

    } catch (error) {
        console.error('Error processing file:', error);
        response.status(500).json({ success: false, message: 'Error processing file', error: error.message });
    }
};
