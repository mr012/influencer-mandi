/** OR within a dimension, AND between dimensions. Empty dimensions are unrestricted. */
export function filterDiscovery(items, role, filters = {}) {
  const locations = Array.isArray(filters.city) ? filters.city : filters.city ? [filters.city] : [];
  const categories = Array.isArray(filters.category) ? filters.category : filters.category ? [filters.category] : [];
  return items.filter(item => {
    const tags = role === 'brand' ? item.tags : [item.cat.replace(/ campaign$/, '')];
    const location = item.loc.replace('Delhi NCR', 'Delhi');
    return (!categories.length || categories.some(category => tags.includes(category))) &&
      (!locations.length || locations.includes(location));
  });
}
