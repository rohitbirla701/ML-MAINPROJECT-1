const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    projectType: { type: String, required: true, enum: ['Mockups', 'Proposals', 'Presentations', 'Credentials', 'RFP', 'AI Work', 'Creative Work'] },
    category: { type: String, required: true, enum: ['Simple', 'Medium', 'Complex'],
    required: function() {
      return ['Mockups', 'Proposals', 'Presentations', 'Credentials', 'RFP'].includes(this.projectType);
    } },
    dateReceived: { type: Date, required: true },
    dateDelivered: { type: Date, required: true },
    contactPerson: { type: String, required: true },
    endClient: { type: String, required: true },
    status: { type: String, enum: ['New', 'Sent to CEO', 'Approved by Client', 'Invoice Raised'], default: 'New' },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Project', projectSchema);
