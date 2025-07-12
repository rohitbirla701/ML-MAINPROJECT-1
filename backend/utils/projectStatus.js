// backend/utils/projectStatus.js
const statusMap = {
  'new': 'New',
  'sent to ceo': 'Sent to CEO',
  'approved by client': 'Approved by Client',
  'invoice raised': 'Invoice Raised',
  // Add more statuses here as needed
  'in review': 'In Review',
  'on hold': 'On Hold',
};

function normalizeStatus(status) {
  if (!status) return null;
  const key = status.trim().toLowerCase();
  return statusMap[key] || null;
}

// Optionally, export statusMap for use elsewhere
module.exports = { normalizeStatus, statusMap };
