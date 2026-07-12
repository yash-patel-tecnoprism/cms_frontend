const express = require('express');
const { body, validationResult } = require('express-validator');
const { supabase } = require('../utils/supabase');
const auth = require('../middleware/auth');

const router = express.Router();

const mapCustomer = (customer) => ({
  id: customer.id,
  name: customer.name,
  email: customer.email,
  phone: customer.phone,
  createdAt: customer.created_at,
  updatedAt: customer.updated_at,
});

const isUniqueViolation = (error) => error?.code === '23505';

const sanitizeSearchTerm = (value) =>
  value.replace(/[%_(),]/g, ' ').trim();

// All customer routes are protected by our JWT middleware!
router.use(auth);

// Get all customers (with search and pagination)
router.get('/', async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.max(parseInt(limit, 10) || 10, 1);
    const from = (parsedPage - 1) * parsedLimit;
    const to = from + parsedLimit - 1;

    let query = supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    const sanitizedSearch = sanitizeSearchTerm(String(search));
    if (sanitizedSearch) {
      query = query.or(`name.ilike.%${sanitizedSearch}%,email.ilike.%${sanitizedSearch}%`);
    }

    const { data: customers, count, error } = await query;
    if (error) {
      throw error;
    }

    res.json({
      customers: (customers || []).map(mapCustomer),
      total: count || 0,
      page: parsedPage,
      limit: parsedLimit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .maybeSingle();
    if (error) {
      throw error;
    }
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(mapCustomer(customer));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new customer
router.post(
  '/',
  [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('phone').not().isEmpty().withMessage('Phone is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, phone } = req.body;

      // Check if email already exists
      const { data: existingCustomer, error: existingCustomerError } = await supabase
        .from('customers')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      if (existingCustomerError) {
        throw existingCustomerError;
      }
      if (existingCustomer) {
        return res.status(400).json({ message: 'Customer with this email already exists' });
      }

      const { data: customer, error: createCustomerError } = await supabase
        .from('customers')
        .insert({ name, email, phone })
        .select('*')
        .single();
      if (createCustomerError) {
        if (isUniqueViolation(createCustomerError)) {
          return res.status(400).json({ message: 'Customer with this email already exists' });
        }
        throw createCustomerError;
      }

      res.status(201).json(mapCustomer(customer));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update customer
router.put(
  '/:id',
  [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('phone').not().isEmpty().withMessage('Phone is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, phone } = req.body;

      // Check if email exists for another customer
      const customerId = parseInt(req.params.id, 10);
      const { data: existingCustomer, error: existingCustomerError } = await supabase
        .from('customers')
        .select('id')
        .eq('email', email)
        .neq('id', customerId)
        .maybeSingle();
      if (existingCustomerError) {
        throw existingCustomerError;
      }
      if (existingCustomer) {
        return res.status(400).json({ message: 'Customer with this email already exists' });
      }

      const { data: customer, error: updateCustomerError } = await supabase
        .from('customers')
        .update({ name, email, phone })
        .eq('id', customerId)
        .select('*')
        .maybeSingle();
      if (updateCustomerError) {
        if (isUniqueViolation(updateCustomerError)) {
          return res.status(400).json({ message: 'Customer with this email already exists' });
        }
        throw updateCustomerError;
      }
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      res.json(mapCustomer(customer));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    const { data: deletedCustomer, error } = await supabase
      .from('customers')
      .delete()
      .eq('id', customerId)
      .select('id')
      .maybeSingle();
    if (error) {
      throw error;
    }
    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
