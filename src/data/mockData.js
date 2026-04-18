export const agents = [
  {
    id: 'AGT-001',
    name: 'Medicine Info Bot',
    description: 'Helps customers find medicine names, dosage info, and availability via WhatsApp',
    status: 'active',
    lastActive: '2 min ago',
    messagesHandled: 1243,
    phone: '+91 98765 00001',
  },
  {
    id: 'AGT-002',
    name: 'Broadcast Messages Bot',
    description: 'Sends broadcast messages, promotional offers, and updates to customers via WhatsApp',
    status: 'active',
    lastActive: '5 min ago',
    messagesHandled: 3567,
    phone: '+91 98765 00002',
  },
];

export const leads = [
  { id: 1, name: 'Rahul Verma', phone: '+91 99887 76655', source: 'database', selected: false },
  { id: 2, name: 'Anita Desai', phone: '+91 88776 65544', source: 'database', selected: false },
  { id: 3, name: 'Suresh Menon', phone: '+91 77665 54433', source: 'database', selected: false },
  { id: 4, name: 'Kavita Joshi', phone: '+91 66554 43322', source: 'database', selected: false },
  { id: 5, name: 'Deepak Gupta', phone: '+91 55443 32211', source: 'database', selected: false },
  { id: 6, name: 'Pooja Mishra', phone: '+91 44332 21100', source: 'database', selected: false },
  { id: 7, name: 'Manoj Tiwari', phone: '+91 33221 10099', source: 'database', selected: false },
  { id: 8, name: 'Nisha Agarwal', phone: '+91 22110 09988', source: 'database', selected: false },
];

export const knowledgeBase = [
  {
    id: 'KB-001',
    title: 'Store Hours & Location',
    content: 'MedStore is open Monday to Saturday, 8:00 AM to 10:00 PM. Sunday hours are 9:00 AM to 6:00 PM. Located at 123 Health Avenue, Medical District, Mumbai 400001.',
    updatedAt: '2026-03-15',
  },
  {
    id: 'KB-002',
    title: 'Return & Refund Policy',
    content: 'Unopened medicines can be returned within 7 days of purchase with original receipt. Opened medicines cannot be returned due to safety regulations. Refunds are processed within 3-5 business days.',
    updatedAt: '2026-03-10',
  },
  {
    id: 'KB-003',
    title: 'Prescription Requirements',
    content: 'Schedule H and Schedule X drugs require a valid prescription from a registered medical practitioner. Prescriptions are valid for the duration mentioned by the doctor or 6 months from issue date, whichever is earlier.',
    updatedAt: '2026-03-12',
  },
  {
    id: 'KB-004',
    title: 'Delivery Information',
    content: 'Free delivery on orders above ₹500 within 5km radius. Standard delivery takes 2-4 hours. Express delivery (₹50 extra) available within 1 hour. Cash on delivery and online payment accepted.',
    updatedAt: '2026-03-14',
  },
  {
    id: 'KB-005',
    title: 'COVID-19 Safety Protocols',
    content: 'All staff are vaccinated and wear masks. Store is sanitized every 2 hours. Contactless delivery available. Rapid antigen test kits available without prescription. RT-PCR sample collection by appointment.',
    updatedAt: '2026-03-08',
  },
];
