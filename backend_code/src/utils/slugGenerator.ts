
export const generateSlug = async (baseSlug: string, Model: any) => {
  let slug = baseSlug;
  let counter = 1;

  while (await Model.findOne({ where: {slug} })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
};
