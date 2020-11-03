const getUser = async (req, res) => {
  res.json({ message: "hola" });
};

const createUser = async (req, res) => {
  console.log("create", req.body);
  res.json({ message: "hola" });
};

const updateUser = async (req, res) => {
  console.log("update", req.body);
  res.json({ message: "hola" });
};

module.exports = { getUser, createUser, updateUser };
