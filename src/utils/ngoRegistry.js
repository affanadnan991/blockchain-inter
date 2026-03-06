/**
 * NGO Registry - Store actual NGO names and details
 * Since contract only stores nameHash, we maintain a mapping locally
 */

// This will be populated during deployment
const NGO_REGISTRY = {
  // Example: '0xNGO_ADDRESS': { name: 'NGO Name', category: 'Education', ... }
};

/**
 * Store NGO name locally
 */
export const registerNGOName = (address, name, category = 'General Welfare') => {
  const key = address?.toLowerCase();
  if (!key) return;

  NGO_REGISTRY[key] = {
    name,
    category,
    registered: new Date().toISOString()
  };

  // Also save to localStorage for persistence across page refreshes
  try {
    const stored = JSON.parse(localStorage.getItem('ngo_registry') || '{}');
    stored[key] = NGO_REGISTRY[key];
    localStorage.setItem('ngo_registry', JSON.stringify(stored));
  } catch (err) {
    console.warn('Could not save to localStorage:', err);
  }
};

/**
 * Get NGO name by address
 */
export const getNGOName = (address) => {
  const key = address?.toLowerCase();
  if (!key) return null;

  // Try memory first
  if (NGO_REGISTRY[key]) {
    return NGO_REGISTRY[key];
  }

  // Try localStorage
  try {
    const stored = JSON.parse(localStorage.getItem('ngo_registry') || '{}');
    if (stored[key]) {
      NGO_REGISTRY[key] = stored[key]; // Cache it
      return stored[key];
    }
  } catch (err) {
    console.warn('Could not read from localStorage:', err);
  }

  return null;
};

/**
 * Load all NGO names from localStorage on app start
 */
export const loadNGORegistry = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('ngo_registry') || '{}');
    Object.assign(NGO_REGISTRY, stored);
  } catch (err) {
    console.warn('Could not load NGO registry:', err);
  }
};

export default NGO_REGISTRY;
