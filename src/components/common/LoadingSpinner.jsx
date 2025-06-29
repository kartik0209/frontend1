// src/components/common/LoadingSpinner.jsx
import React from 'react';
import { Spin } from 'antd';

const LoadingSpinner = ({ size = 'large', tip = 'Loading...', className = '' }) => (
  <div className={`loading-spinner ${className}`} style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    flexDirection: 'column'
  }}>
    <Spin size={size} tip={tip} />
  </div>
);

export default LoadingSpinner;

// // src/components/common/ErrorBoundary.jsx
// import React from 'react';
import { Result, Button } from 'antd';
import { logError } from '../../utils/errorHandler';

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     logError(error, 'ErrorBoundary', { errorInfo });
//   }

//   handleReset = () => {
//     this.setState({ hasError: false, error: null });
//     window.location.reload();
//   };

//   render() {
//     if (this.state.hasError) {
//       return (
//         <Result
//           status="500"
//           title="Something went wrong"
//           subTitle="An unexpected error occurred. Please try refreshing the page."
//           extra={
//             <Button type="primary" onClick={this.handleReset}>
//               Refresh Page
//             </Button>
//           }
//         />
//       );
//     }

//     return this.props.children;
//   }
// }

// export default ErrorBoundary;

// src/layouts/PublicLayout.jsx
