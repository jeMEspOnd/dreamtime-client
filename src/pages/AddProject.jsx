import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';


function AddProject() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projectName: '',
    projectCode: '',
    clientName: '',
    projectManager: '',
    startDate: '',
    endDate: '',
    budget: '',
    priority: '',
    status: 'Active',
    technology: '',
    teamSize: '',
    modules: [],
    otherModule: '',
    description: '',
    remarks: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const moduleOptions = [
    'Authentication',
    'Dashboard',
    'User Management',
    'Project Management',
    'Task Management',
    'Reports',
    'Notifications',
    'Settings',
    'Billing',
    'Inventory',
    'HRMS',
    'CRM',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleModuleChange = (moduleName) => {
    let updatedModules = [...formData.modules];

    if (updatedModules.includes(moduleName)) {
      updatedModules = updatedModules.filter((item) => item !== moduleName);
    } else {
      updatedModules.push(moduleName);
    }

    setFormData((prev) => ({
      ...prev,
      modules: updatedModules,
      otherModule:
        moduleName === 'Other' || updatedModules.includes('Other')
          ? prev.otherModule
          : ''
    }));

    setErrors((prev) => ({
      ...prev,
      modules: '',
      otherModule: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    } else if (formData.projectName.trim().length < 3) {
      newErrors.projectName = 'Project name must be at least 3 characters';
    }

    if (!formData.projectCode.trim()) {
      newErrors.projectCode = 'Project code is required';
    } else if (!/^[A-Za-z0-9-_]+$/.test(formData.projectCode)) {
      newErrors.projectCode = 'Project code can contain only letters, numbers, - and _';
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.projectManager.trim()) {
      newErrors.projectManager = 'Project manager name is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = 'End date cannot be before start date';
      }
    }

    if (!formData.budget) {
      newErrors.budget = 'Budget is required';
    } else if (Number(formData.budget) <= 0) {
      newErrors.budget = 'Budget must be greater than 0';
    }

    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }

    if (!formData.technology.trim()) {
      newErrors.technology = 'Technology stack is required';
    }

    if (!formData.teamSize) {
      newErrors.teamSize = 'Team size is required';
    } else if (Number(formData.teamSize) <= 0) {
      newErrors.teamSize = 'Team size must be greater than 0';
    }

    if (formData.modules.length === 0) {
      newErrors.modules = 'Please select at least one module';
    }

    if (formData.modules.includes('Other') && !formData.otherModule.trim()) {
      newErrors.otherModule = 'Please enter other module name';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return newErrors;
  };

  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');

     const errors = validateForm();
        setErrors(errors);
    
        if (Object.keys(errors).length > 0) {
          toast.error('Please fix the highlighted fields.');
          return;
        }

    const payload = {
      ...formData,
      budget: Number(formData.budget),
      teamSize: Number(formData.teamSize),
      modules: formData.modules.includes('Other')
        ? [...formData.modules.filter((m) => m !== 'Other'), formData.otherModule]
        : formData.modules
    };

    try {
      setLoading(true);

      // Demo API call - replace endpoint with your real API
      await api.post('/Master', payload);

        toast.success('Add Project successful. Redirecting to login...');

            setTimeout(() => {
                navigate('/AddProject');
            }, 1500);
      setFormData({
        projectName: '',
        projectCode: '',
        clientName: '',
        projectManager: '',
        startDate: '',
        endDate: '',
        budget: '',
        priority: '',
        status: 'Active',
        technology: '',
        teamSize: '',
        modules: [],
        otherModule: '',
        description: '',
        remarks: ''
      });

      setErrors({});

      // optional redirect
      // navigate('/projects');
    } catch (error) {
      console.error('Insert project error:', error);
      setSuccessMsg('');
      alert(error?.response?.data?.message || 'Failed to add project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-project-page">
      <div className="project-form-card">
        <div className="project-form-header">
          <h2>Add Project</h2>
          <p>Enter project details and select required modules.</p>
        </div>

        {successMsg && <div className="success-text">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Project Name <span className="req">*</span></label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="Enter project name"
              />
              {errors.projectName && <small className="field-error">{errors.projectName}</small>}
            </div>

            <div className="form-group">
              <label>Project Code <span className="req">*</span></label>
              <input
                type="text"
                name="projectCode"
                value={formData.projectCode}
                onChange={handleChange}
                placeholder="Ex: PROJ001"
              />
              {errors.projectCode && <small className="field-error">{errors.projectCode}</small>}
            </div>

            <div className="form-group">
              <label>Client Name <span className="req">*</span></label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Enter client name"
              />
              {errors.clientName && <small className="field-error">{errors.clientName}</small>}
            </div>

            <div className="form-group">
              <label>Project Manager <span className="req">*</span></label>
              <input
                type="text"
                name="projectManager"
                value={formData.projectManager}
                onChange={handleChange}
                placeholder="Enter project manager name"
              />
              {errors.projectManager && <small className="field-error">{errors.projectManager}</small>}
            </div>

            <div className="form-group">
              <label>Start Date <span className="req">*</span></label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
              {errors.startDate && <small className="field-error">{errors.startDate}</small>}
            </div>

            <div className="form-group">
              <label>End Date <span className="req">*</span></label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
              {errors.endDate && <small className="field-error">{errors.endDate}</small>}
            </div>

            <div className="form-group">
              <label>Budget <span className="req">*</span></label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Enter budget"
              />
              {errors.budget && <small className="field-error">{errors.budget}</small>}
            </div>

            <div className="form-group">
              <label>Priority <span className="req">*</span></label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="">Select priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
              {errors.priority && <small className="field-error">{errors.priority}</small>}
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <div className="form-group">
              <label>Technology Stack <span className="req">*</span></label>
              <input
                type="text"
                name="technology"
                value={formData.technology}
                onChange={handleChange}
                placeholder="Ex: React, Node.js, SQL Server"
              />
              {errors.technology && <small className="field-error">{errors.technology}</small>}
            </div>

            <div className="form-group">
              <label>Team Size <span className="req">*</span></label>
              <input
                type="number"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                placeholder="Enter team size"
              />
              {errors.teamSize && <small className="field-error">{errors.teamSize}</small>}
            </div>
          </div>

          <div className="form-group">
            <label>Project Modules <span className="req">*</span></label>
            <div className="modules-grid">
              {moduleOptions.map((module) => (
                <label key={module} className="module-item">
                  <input
                    type="checkbox"
                    checked={formData.modules.includes(module)}
                    onChange={() => handleModuleChange(module)}
                  />
                  <span>{module}</span>
                </label>
              ))}
            </div>
            {errors.modules && <small className="field-error">{errors.modules}</small>}
          </div>

          {formData.modules.includes('Other') && (
            <div className="form-group">
              <label>Other Module Name <span className="req">*</span></label>
              <input
                type="text"
                name="otherModule"
                value={formData.otherModule}
                onChange={handleChange}
                placeholder="Enter custom module name"
              />
              {errors.otherModule && <small className="field-error">{errors.otherModule}</small>}
            </div>
          )}

          <div className="form-group">
            <label>Description <span className="req">*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter project description"
              rows="4"
            />
            {errors.description && <small className="field-error">{errors.description}</small>}
          </div>

          <div className="form-group">
            <label>Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Enter remarks"
              rows="3"
            />
          </div>

          <div className="project-form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Project'}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProject;