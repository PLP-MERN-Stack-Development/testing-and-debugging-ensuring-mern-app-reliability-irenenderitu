import Bug from '../models/Bug.js';
import { validateBugInput, sanitizeBugData } from '../utils/validation.js';

// Debugging helper - intentional console.log for demonstration
const debugLog = (message, data = null) => {
  console.log(`[DEBUG] ${message}:`, data);
};

export const getAllBugs = async (req, res, next) => {
  try {
    debugLog('Fetching all bugs');
    const { status, priority } = req.query;
    let filter = {};
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    
    const bugs = await Bug.find(filter).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: bugs.length,
      data: bugs
    });
  } catch (error) {
    debugLog('Error fetching bugs', error.message);
    next(error);
  }
};

export const getBugById = async (req, res, next) => {
  try {
    const { id } = req.params;
    debugLog('Fetching bug by ID', id);
    
    const bug = await Bug.findById(id);
    
    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }
    
    res.json({
      success: true,
      data: bug
    });
  } catch (error) {
    debugLog('Error fetching bug by ID', error.message);
    next(error);
  }
};

export const createBug = async (req, res, next) => {
  try {
    debugLog('Creating new bug', req.body);
    
    // Validate input
    const validation = validateBugInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }
    
    // Sanitize data
    const sanitizedData = sanitizeBugData(req.body);
    
    const bug = await Bug.create(sanitizedData);
    
    debugLog('Bug created successfully', bug._id);
    res.status(201).json({
      success: true,
      message: 'Bug created successfully',
      data: bug
    });
  } catch (error) {
    debugLog('Error creating bug', error.message);
    next(error);
  }
};

export const updateBug = async (req, res, next) => {
  try {
    const { id } = req.params;
    debugLog('Updating bug', { id, updates: req.body });
    
    // Validate input for updates
    if (req.body.title || req.body.description || req.body.reporter) {
      const validation = validateBugInput(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        });
      }
    }
    
    // Sanitize data
    const sanitizedData = sanitizeBugData(req.body);
    sanitizedData.updatedAt = Date.now();
    
    const bug = await Bug.findByIdAndUpdate(
      id, 
      sanitizedData, 
      { new: true, runValidators: true }
    );
    
    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }
    
    debugLog('Bug updated successfully', bug._id);
    res.json({
      success: true,
      message: 'Bug updated successfully',
      data: bug
    });
  } catch (error) {
    debugLog('Error updating bug', error.message);
    next(error);
  }
};

export const deleteBug = async (req, res, next) => {
  try {
    const { id } = req.params;
    debugLog('Deleting bug', id);
    
    const bug = await Bug.findByIdAndDelete(id);
    
    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }
    
    debugLog('Bug deleted successfully', id);
    res.json({
      success: true,
      message: 'Bug deleted successfully'
    });
  } catch (error) {
    debugLog('Error deleting bug', error.message);
    next(error);
  }
};