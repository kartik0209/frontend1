// Publisher table column definitions and options

export const baseColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
    sorter: true,
  },
  {
    title: 'Full Name',
    dataIndex: 'full_name',
    key: 'full_name',
    width: 150,
    sorter: true,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: 200,
    sorter: true,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    sorter: true,
    filters: [
      { text: 'Active', value: 'Active' },
      { text: 'Pending', value: 'Pending' },
      { text: 'Suspended', value: 'Suspended' },
      { text: 'Disabled', value: 'Disabled' },
      { text: 'Rejected', value: 'Rejected' },
      { text: 'Banned', value: 'Banned' },
    ],
  },
  {
    title: 'Country',
    dataIndex: 'country',
    key: 'country',
    width: 120,
    sorter: true,
  },
  {
    title: 'City',
    dataIndex: 'city',
    key: 'city',
    width: 120,
    sorter: true,
  },
  {
    title: 'State',
    dataIndex: 'state',
    key: 'state',
    width: 120,
    sorter: true,
  },
  {
    title: 'Zip Code',
    dataIndex: 'zip_code',
    key: 'zip_code',
    width: 100,
    sorter: true,
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
    width: 150,
    sorter: true,
  },
  {
    title: 'Entity Type',
    dataIndex: 'entity_type',
    key: 'entity_type',
    width: 120,
    sorter: true,
    filters: [
      { text: 'Individual', value: 'Individual' },
      { text: 'Company', value: 'Company' },
    ],
  },
  {
    title: 'IM Type',
    dataIndex: 'im_type',
    key: 'im_type',
    width: 100,
    sorter: true,
  },
  {
    title: 'IM Username',
    dataIndex: 'im_username',
    key: 'im_username',
    width: 150,
    sorter: true,
  },
  {
    title: 'Promotion Method',
    dataIndex: 'promotion_method',
    key: 'promotion_method',
    width: 150,
    sorter: true,
  },
  {
    title: 'Reference ID',
    dataIndex: 'reference_id',
    key: 'reference_id',
    width: 120,
    sorter: true,
  },
  {
    title: 'Signup Company Name',
    dataIndex: 'signup_company_name',
    key: 'signup_company_name',
    width: 180,
    sorter: true,
  },
  {
    title: 'Signup Company Address',
    dataIndex: 'signup_company_address',
    key: 'signup_company_address',
    width: 200,
    sorter: true,
  },
  {
    title: 'Notify by Email',
    dataIndex: 'notify_by_email',
    key: 'notify_by_email',
    width: 120,
    sorter: true,
    filters: [
      { text: 'Yes', value: true },
      { text: 'No', value: false },
    ],
  },
  {
    title: 'Created At',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 120,
    sorter: true,
  },
  {
    title: 'Updated At',
    dataIndex: 'updated_at',
    key: 'updated_at',
    width: 120,
    sorter: true,
  },
];

export const columnOptions = [
  { key: 'id', label: 'ID', defaultVisible: true },
  { key: 'full_name', label: 'Full Name', defaultVisible: true },
  { key: 'email', label: 'Email', defaultVisible: true },
  { key: 'status', label: 'Status', defaultVisible: true },
  { key: 'country', label: 'Country', defaultVisible: true },
  { key: 'city', label: 'City', defaultVisible: false },
  { key: 'state', label: 'State', defaultVisible: false },
  { key: 'zip_code', label: 'Zip Code', defaultVisible: false },
  { key: 'phone', label: 'Phone', defaultVisible: true },
  { key: 'entity_type', label: 'Entity Type', defaultVisible: true },
  { key: 'im_type', label: 'IM Type', defaultVisible: false },
  { key: 'im_username', label: 'IM Username', defaultVisible: false },
  { key: 'promotion_method', label: 'Promotion Method', defaultVisible: false },
  { key: 'reference_id', label: 'Reference ID', defaultVisible: false },
  { key: 'signup_company_name', label: 'Signup Company Name', defaultVisible: false },
  { key: 'signup_company_address', label: 'Signup Company Address', defaultVisible: false },
  { key: 'notify_by_email', label: 'Notify by Email', defaultVisible: false },
  { key: 'created_at', label: 'Created At', defaultVisible: true },
  { key: 'updated_at', label: 'Updated At', defaultVisible: false },
];

// Search form field options
export const searchFormFields = [
  {
    name: 'id',
    label: 'ID',
    type: 'input',
    placeholder: 'Enter Publisher ID',
  },
  {
    name: 'full_name',
    label: 'Name',
    type: 'input',
    placeholder: 'Enter Publisher Name',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'input',
    placeholder: 'Enter Email Address',
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'Active' },
      { label: 'Pending', value: 'Pending' },
      { label: 'Suspended', value: 'Suspended' },
      { label: 'Disabled', value: 'Disabled' },
      { label: 'Rejected', value: 'Rejected' },
      { label: 'Banned', value: 'Banned' },
    ],
  },
  {
    name: 'country',
    label: 'Country',
    type: 'input',
    placeholder: 'Enter Country',
  },
  {
    name: 'city',
    label: 'City',
    type: 'input',
    placeholder: 'Enter City',
  },
  {
    name: 'state',
    label: 'State',
    type: 'input',
    placeholder: 'Enter State',
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'input',
    placeholder: 'Enter Phone Number',
  },
  {
    name: 'entity_type',
    label: 'Entity Type',
    type: 'select',
    options: [
      { label: 'Individual', value: 'Individual' },
      { label: 'Company', value: 'Company' },
    ],
  },
  {
    name: 'reference_id',
    label: 'Reference ID',
    type: 'input',
    placeholder: 'Enter Reference ID',
  },
  {
    name: 'created_at',
    label: 'Created Date',
    type: 'dateRange',
    placeholder: ['Start Date', 'End Date'],
  },
];

// Status color mapping
export const statusColors = {
  Active: 'green',
  Pending: 'orange',
  Suspended: 'purple',
  Disabled: 'red',
  Rejected: 'red',
  Banned: 'red',
};

// Entity type color mapping
export const entityTypeColors = {
  Individual: 'blue',
  Company: 'purple',
};

// Default form values for new publisher
export const defaultPublisherFormValues = {
  full_name: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  state: '',
  zip_code: '',
  entity_type: 'Individual',
  im_type: '',
  im_username: '',
  promotion_method: '',
  signup_company_name: '',
  signup_company_address: '',
  notify_by_email: false,
  status: 'Pending',
};

// Form validation rules
export const formValidationRules = {
  full_name: [
    { required: true, message: 'Please enter full name!' },
    { min: 2, message: 'Name must be at least 2 characters!' },
  ],
  email: [
    { required: true, message: 'Please enter email!' },
    { type: 'email', message: 'Please enter a valid email!' },
  ],
  phone: [
    { required: true, message: 'Please enter phone number!' },
    { pattern: /^[\+]?[1-9][\d]{0,15}$/, message: 'Please enter a valid phone number!' },
  ],
  country: [
    { required: true, message: 'Please enter country!' },
  ],
  entity_type: [
    { required: true, message: 'Please select entity type!' },
  ],
};