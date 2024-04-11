// Utility function to format dates
const formatDate = (date) => {
    if (!date) return null;
    // Convert to a JavaScript Date object if it's a timestamp
    const d = new Date(date);
    // Format the date as a string, then replace slashes with hyphens
    return d.toLocaleString('en-US', { hour12: false }).replace(/\//g, '-');
  };
  
  module.exports = {
    formatDate
  };
  