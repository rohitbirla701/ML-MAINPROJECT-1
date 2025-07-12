const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { normalizeStatus } = require('../utils/projectStatus');
const { getPaginatedProjects } = require('../utils/pagination');
const authMiddleware = require('../middleware/authMiddleware').default || require('../middleware/authMiddleware');


// Debug: log all request headers
router.use((req, res, next) => {
  console.log('Request headers:', req.headers);
  next();
});

// Apply authMiddleware to all routes below
router.use(authMiddleware);

// Create new project
router.post('/', async (req, res) => {
  try {
    const {
      projectName,
      projectType,
      category,
      dateReceived,
      dateDelivered,
      contactPerson,
      endClient,
    } = req.body;

    if (
      !projectName ||
      !projectType ||
      !category ||
      !dateReceived ||
      !dateDelivered ||
      !contactPerson ||
      !endClient
    ) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const newProject = new Project({
      projectName,
      projectType,
      category,
      dateReceived,
      dateDelivered,
      contactPerson,
      endClient,
      status: 'New',
    });

    await newProject.save();

    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    console.error('Create project error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH update project status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });
    const updateFields = { status, updatedAt: new Date() };
    const project = await Project.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all projects with pagination and filter
router.get('/', async (req, res) => {
  try {
    const { page = 1, pageSize = 10, status, search } = req.query;
    const query = {};
    if (status) {
      const normalizedStatus = normalizeStatus(status);
      if (normalizedStatus) query.status = normalizedStatus;
    }
    if (search) {
      query.$or = [
        { projectName: { $regex: search, $options: 'i' } },
        { endClient: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
      ];
    }
    // Sort by creation date descending so newest is first
    const { projects, total } = await getPaginatedProjects(Project, query, page, pageSize, { createdAt: -1 });
    res.status(200).json({ projects, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET projects by status
router.get('/status/:status', async (req, res) => {
  try {
    const normalizedStatus = normalizeStatus(req.params.status);
    if (!normalizedStatus) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const projects = await Project.find({ status: normalizedStatus });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Combined Dashboard Stats API
router.get("/dashboard-stats", async (req, res) => {
  try {
    // Use the same normalization as everywhere else
    const newProjects = await Project.countDocuments({ status: "New" });
    const sentToCEO = await Project.countDocuments({ status: "Sent to CEO" });
    const approvedByClient = await Project.countDocuments({ status: "Approved by Client" });
    const invoiceRaised = await Project.countDocuments({ status: "Invoice Raised" });
    const totalProjects = await Project.countDocuments();

    // Always use the correct status for filtering
    const allProjects = await Project.find();

    res.json({
      stats: {
        totalProjects,
        newProjects,
        sentToCEO,
        approvedByClient,
        invoiceRaised,
      },
      projects: allProjects,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET project by id
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
