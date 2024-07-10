const mongoose = require('mongoose');

// mongoose.set('useFindAndModify', false);

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
      // useCreateIndex: true,
    });

    console.log('Conexión exitosa a la base de datos');
  } catch (error) {
    console.log(error);
    throw new Error('Error al conectarse a la base de datos');
  }
};

module.exports = {
  dbConnection,
};