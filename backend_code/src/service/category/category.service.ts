import slugify from "slugify";
import { ICategoryType } from "../../global/type";
import Category from "../../model/Category.Model";
import { generateSlug } from "../../utils/slugGenerator";

const addCategory = async (data: ICategoryType) => {
  const slug = slugify(data.name, { strict: true, lower: true });
  const uniqueSlug = await generateSlug(slug, Category);

  return await Category.create({
    name: data.name,
    slug: uniqueSlug,
    description: data.description,
  });
};

// getAllCategory
const getAllCategory = async () => {
  return await Category.findAll();
};

// findOneCategory
const findOneCategory = async (categoryId: string) => {
  return await Category.findOne({ where: { id: categoryId } });
};

// updateCategory
const updateCategory = async (data: ICategoryType, categoryId: string) => {
  return await Category.update(
    {
      name: data.name,
      description: data.description,
      slug: data.slug,
    },
    { where: { id: categoryId } }
  );
};

// deleteCategory
const deleteCategory = async (categoryId: string) => {
  return await Category.destroy({ where: { id: categoryId } });
};

// toggleCategory
const toggleCategory = async (data: ICategoryType, categoryId: string) => {
  return await Category.update(
    {
      isActive: data.isActive,
    },
    { where: { id: categoryId } }
  );
};

export default {
  addCategory,
  updateCategory,
  getAllCategory,
  findOneCategory,
  deleteCategory,
  toggleCategory,
};
