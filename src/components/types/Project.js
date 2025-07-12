/**
 * @typedef {'Mockups' | 'Proposals' | 'Presentations' | 'Credentials' | 'RFP' | 'AI Work' | 'Creative Work'} ProjectType
 */

/**
 * @typedef {'Simple' | 'Medium' | 'Complex'} ProjectCategory
 */

/**
 * @typedef {'New' | 'Sent to CEO' | 'Approved by Client' | 'Invoice Raised'} ProjectStatus
 */

/**
 * @typedef {Object} Project
 * @property {string} _id
 * @property {string} id
 * @property {string} projectName
 * @property {ProjectType} projectType
 * @property {ProjectCategory} [category]
 * @property {number} [hoursWorked]
 * @property {string} dateReceived
 * @property {string} contactPerson
 * @property {string} endClientName
 * @property {string} [dateDelivered]
 * @property {ProjectStatus} status
 * @property {string} [notes]
 * @property {string} createdBy
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} ProjectFormData
 * @property {string} projectName
 * @property {ProjectType} projectType
 * @property {ProjectCategory} [category]
 * @property {number} [hoursWorked]
 * @property {string} dateReceived
 * @property {string} contactPerson
 * @property {string} endClientName
 * @property {string} [dateDelivered]
 * @property {string} [notes]
 */
