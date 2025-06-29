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
<<<<<<< HEAD
    title: 'Full Name',
    dataIndex: 'full_name',
    key: 'full_name',
=======
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
    width: 150,
    sorter: true,
  },
  {
<<<<<<< HEAD
=======
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
    width: 130,
    sorter: true,
  },
  {
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
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
<<<<<<< HEAD
=======
      { text: 'Inactive', value: 'Inactive' },
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
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
<<<<<<< HEAD
=======
      { text: 'Partnership', value: 'Partnership' },
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
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
<<<<<<< HEAD
    title: 'Signup Company Name',
    dataIndex: 'signup_company_name',
    key: 'signup_company_name',
=======
    title: 'Tax ID',
    dataIndex: 'tax_id',
    key: 'tax_id',
    width: 120,
    sorter: true,
  },
  {
    title: 'Referred By',
    dataIndex: 'referred_by',
    key: 'referred_by',
    width: 150,
    sorter: true,
  },
  {
    title: 'Managers',
    dataIndex: 'managers',
    key: 'managers',
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
    width: 180,
    sorter: true,
  },
  {
<<<<<<< HEAD
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
=======
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
    width: 100,
    sorter: true,
    filters: [
      { text: 'USD', value: 'USD' },
      { text: 'EUR', value: 'EUR' },
      { text: 'GBP', value: 'GBP' },
      { text: 'INR', value: 'INR' },
      { text: 'CAD', value: 'CAD' },
      { text: 'AUD', value: 'AUD' },
    ],
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
    key: 'tags',
    width: 150,
    sorter: true,
  },
  {
    title: 'Notify',
    dataIndex: 'notify',
    key: 'notify',
    width: 100,
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
    sorter: true,
    filters: [
      { text: 'Yes', value: true },
      { text: 'No', value: false },
    ],
  },
  {
<<<<<<< HEAD
=======
    title: 'Company Name',
    dataIndex: 'companyName',
    key: 'companyName',
    width: 180,
    sorter: true,
  },
  {
    title: 'Company Address',
    dataIndex: 'companyAddress',
    key: 'companyAddress',
    width: 200,
    sorter: true,
  },
  {
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
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
<<<<<<< HEAD
  { key: 'full_name', label: 'Full Name', defaultVisible: true },
=======
  { key: 'name', label: 'Name', defaultVisible: true },
  { key: 'username', label: 'Username', defaultVisible: true },
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
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
<<<<<<< HEAD
  { key: 'signup_company_name', label: 'Signup Company Name', defaultVisible: false },
  { key: 'signup_company_address', label: 'Signup Company Address', defaultVisible: false },
  { key: 'notify_by_email', label: 'Notify by Email', defaultVisible: false },
=======
  { key: 'tax_id', label: 'Tax ID', defaultVisible: false },
  { key: 'referred_by', label: 'Referred By', defaultVisible: false },
  { key: 'managers', label: 'Managers', defaultVisible: false },
  { key: 'currency', label: 'Currency', defaultVisible: true },
  { key: 'tags', label: 'Tags', defaultVisible: false },
  { key: 'notify', label: 'Notify', defaultVisible: false },
  { key: 'companyName', label: 'Company Name', defaultVisible: false },
  { key: 'companyAddress', label: 'Company Address', defaultVisible: false },
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
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
<<<<<<< HEAD
    name: 'full_name',
=======
    name: 'name',
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
    label: 'Name',
    type: 'input',
    placeholder: 'Enter Publisher Name',
  },
  {
<<<<<<< HEAD
=======
    name: 'username',
    label: 'Username',
    type: 'input',
    placeholder: 'Enter Username',
  },
  {
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
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
<<<<<<< HEAD
=======
      { label: 'Inactive', value: 'Inactive' },
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
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
<<<<<<< HEAD
=======
      { label: 'Partnership', value: 'Partnership' },
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
    ],
  },
  {
    name: 'reference_id',
    label: 'Reference ID',
    type: 'input',
    placeholder: 'Enter Reference ID',
  },
  {
<<<<<<< HEAD
=======
    name: 'tax_id',
    label: 'Tax ID',
    type: 'input',
    placeholder: 'Enter Tax ID',
  },
  {
    name: 'referred_by',
    label: 'Referred By',
    type: 'input',
    placeholder: 'Enter Referrer Name',
  },
  {
    name: 'currency',
    label: 'Currency',
    type: 'select',
    options: [
      { label: 'USD', value: 'USD' },
      { label: 'EUR', value: 'EUR' },
      { label: 'GBP', value: 'GBP' },
      { label: 'INR', value: 'INR' },
      { label: 'CAD', value: 'CAD' },
      { label: 'AUD', value: 'AUD' },
    ],
  },
  {
    name: 'companyName',
    label: 'Company Name',
    type: 'input',
    placeholder: 'Enter Company Name',
  },
  {
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
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
<<<<<<< HEAD
=======
  Inactive: 'gray',
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
  Suspended: 'purple',
  Disabled: 'red',
  Rejected: 'red',
  Banned: 'red',
};

// Entity type color mapping
export const entityTypeColors = {
  Individual: 'blue',
  Company: 'purple',
<<<<<<< HEAD
=======
  Partnership: 'green',
};

// Currency color mapping
export const currencyColors = {
  USD: 'green',
  EUR: 'blue',
  GBP: 'purple',
  INR: 'orange',
  CAD: 'cyan',
  AUD: 'gold',
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
};

// Default form values for new publisher
export const defaultPublisherFormValues = {
<<<<<<< HEAD
  full_name: '',
  email: '',
=======
  name: '',
  username: '',
  email: '',
  password: '',
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
  phone: '',
  country: '',
  city: '',
  state: '',
  zip_code: '',
  entity_type: 'Individual',
  im_type: '',
  im_username: '',
  promotion_method: '',
<<<<<<< HEAD
  signup_company_name: '',
  signup_company_address: '',
  notify_by_email: false,
=======
  reference_id: '',
  tax_id: '',
  referred_by: '',
  managers: '',
  currency: 'USD',
  tags: [],
  notify: false,
  companyName: '',
  companyAddress: '',
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
  status: 'Pending',
};

// Form validation rules
export const formValidationRules = {
<<<<<<< HEAD
  full_name: [
    { required: true, message: 'Please enter full name!' },
    { min: 2, message: 'Name must be at least 2 characters!' },
  ],
=======
  name: [
    { required: true, message: 'Please enter name!' },
    { min: 2, message: 'Name must be at least 2 characters!' },
  ],
  username: [
    { required: true, message: 'Please enter username!' },
    { min: 3, message: 'Username must be at least 3 characters!' },
    { pattern: /^[a-zA-Z0-9._-]+$/, message: 'Username can only contain letters, numbers, dots, hyphens and underscores!' },
  ],
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
  email: [
    { required: true, message: 'Please enter email!' },
    { type: 'email', message: 'Please enter a valid email!' },
  ],
<<<<<<< HEAD
=======
  password: [
    { required: true, message: 'Please enter password!' },
    { min: 6, message: 'Password must be at least 6 characters!' },
  ],
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
  phone: [
    { required: true, message: 'Please enter phone number!' },
    { pattern: /^[\+]?[1-9][\d]{0,15}$/, message: 'Please enter a valid phone number!' },
  ],
  country: [
    { required: true, message: 'Please enter country!' },
  ],
<<<<<<< HEAD
  entity_type: [
    { required: true, message: 'Please select entity type!' },
  ],
=======
  city: [
    { required: true, message: 'Please enter city!' },
  ],
  state: [
    { required: true, message: 'Please enter state!' },
  ],
  zip_code: [
    { required: true, message: 'Please enter ZIP code!' },
  ],
  entity_type: [
    { required: true, message: 'Please select entity type!' },
  ],
  status: [
    { required: true, message: 'Please select status!' },
  ],
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
};