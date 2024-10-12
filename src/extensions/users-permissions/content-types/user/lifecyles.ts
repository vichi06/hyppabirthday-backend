// Define a function that is called after a user is created
const afterCreate = async (data: any) => {
  const birthday = data.params.data.birthday;
  const user = data.result;

  try {
    await strapi.service("api::birthday.birthday").create({
      data: { ...birthday, user: user.id },
    });
  } catch (error) {
    console.error("Error creating birthday entry: ", error);
  }
};

export default {
  afterCreate,
};
