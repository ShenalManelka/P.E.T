import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-rose-50 border border-rose-100 rounded-[2rem] text-center">
          <h2 className="text-rose-600 font-bold">Something went wrong in this section.</h2>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 text-sm bg-rose-600 text-white px-4 py-2 rounded-xl"
          >
            Reload Dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;