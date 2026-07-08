export function useDisabledCategories(categories, updateCategory) {
  const disabledCategoryIds = (categories || [])
    .filter(c => c.is_disabled)
    .map(c => c.id);

  const disableCategory = async (id) => {
    const category = categories.find(c => c.id === id);
    if (category && updateCategory) {
      await updateCategory(id, {
        name: category.name,
        amount: category.amount,
        is_disabled: true
      });
    }
  };

  const enableCategory = async (id) => {
    const category = categories.find(c => c.id === id);
    if (category && updateCategory) {
      await updateCategory(id, {
        name: category.name,
        amount: category.amount,
        is_disabled: false
      });
    }
  };

  return { disabledCategoryIds, disableCategory, enableCategory };
}
