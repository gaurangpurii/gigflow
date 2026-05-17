import { Response } from 'express';
import Lead from '../models/Lead';
import { AuthRequest, PaginationQuery } from '../types';

// @desc    Get all leads with filtering, search, sort, pagination
// @route   GET /api/leads
export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '10', status, source, search, sort = 'latest' } =
      req.query as PaginationQuery;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: Record<string, unknown> = {};

    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Sales users can only see their own leads
    if (req.user?.role === 'sales') {
      filter.createdBy = req.user.id;
    }

    const sortOrder = sort === 'latest' ? -1 : 1;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'name email'),
      Lead.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
export const getLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');

    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }

    // Sales can only view their own leads
    if (req.user?.role === 'sales' && lead.createdBy.toString() !== req.user.id) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create lead
// @route   POST /api/leads
export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;

    if (!name || !email || !source) {
      res.status(400).json({ success: false, message: 'Name, email and source are required' });
      return;
    }

    const lead = await Lead.create({
      name,
      email,
      status: status || 'New',
      source,
      createdBy: req.user?.id,
    });

    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }

    // Sales can only update their own leads
    if (req.user?.role === 'sales' && lead.createdBy.toString() !== req.user.id) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }

    // Only admins can delete
    if (req.user?.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Only admins can delete leads' });
      return;
    }

    await lead.deleteOne();
    res.status(200).json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Export leads as CSV
// @route   GET /api/leads/export
export const exportLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter: Record<string, unknown> = {};

    if (req.user?.role === 'sales') {
      filter.createdBy = req.user.id;
    }

    const leads = await Lead.find(filter).populate('createdBy', 'name email');

    const csvRows = [
      ['Name', 'Email', 'Status', 'Source', 'Created At'],
      ...leads.map((lead) => [
        lead.name,
        lead.email,
        lead.status,
        lead.source,
        new Date(lead.createdAt).toLocaleDateString(),
      ]),
    ];

    const csvContent = csvRows.map((row) => row.join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};