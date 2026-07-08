export const testUsers = {
  admin: {
    email: process.env.TEST_USER_EMAIL ?? "test@pohub.app",
    password: process.env.TEST_USER_PASSWORD ?? "testpassword123",
  },
};

export const testCustomer = {
  customerName: "Budi Santoso",
  customerPhone: "081234567890",
  customerAddress: "Jl. Merdeka No. 1, Jakarta Pusat",
  customerNotes: "Tolong dibungkus rapi",
};
