const pool = require('../connect')();

// note: we don't try/catch this because if connecting throws an exception
// we don't need to dispose of the client (it will be undefined)

const createUserModel = async (userData) => {
  let {
    username,
    password,
    salt,
    firstname,
    lastname,
    email,
    access_level,
  } = userData;

  const connection = await pool.connect();
  try {
    await connection.query('BEGIN');
    const insertUserText = `INSERT INTO sstm_user (username, password, salt, access_level, last_login) VALUES($1, $2, $3, $4,null) 
      RETURNING id`;
    const insertUserValues = [username, password, salt, access_level];
    let results = await connection.query(insertUserText, insertUserValues);

    const insertUsersDetailsText = `INSERT INTO sstm_user_detail(id, username, firstname, lastname, email) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, firstname, lastname, email`;
    const insertUsersDetailsValues = [
      results.rows[0].id,
      username,
      firstname,
      lastname,
      email,
    ];
    results = await connection.query(
      insertUsersDetailsText,
      insertUsersDetailsValues
    );
    await connection.query('COMMIT');
    return results.rows[0];
  } catch (e) {
    console.log('ROLLBACK', e);
    await connection.query('ROLLBACK');
    throw e;
  } finally {
    connection.release();
  }
};

const loginUserModel = async (userData) => {
  let { username } = userData;
  const connection = await pool.connect();
  try {
    const queryText =
      'SELECT id, username, password, access_level FROM sstm_user WHERE username = $1';
    const queryValues = [username];
    const results = await connection.query(queryText, queryValues);
    return results.rows[0];
  } catch (error) {
    throw error;
  } finally {
    // Make sure to release the client before any error handling,
    // just in case the error handling itself throws an error.
    connection.release();
  }
};

const updateUserModel = async (userData) => {
  try {
    const queryText =
      'UPDATE sstm_user SET username = $1, passwrd=$2, salt=$3, access_level=$4  WHERE username = $1';
    const queryValues = [
      userData.username,
      userData.password,
      userData.salt,
      userData.access_level,
    ];
    const results = await connection.query(queryText, queryValues);
    return results.rows[0];
  } finally {
    // Make sure to release the client before any error handling,
    // just in case the error handling itself throws an error.
    connection.release();
  }
};

const deactivateUserModel = async (userData) => {
  try {
    const queryText = 'UPDATE sstm_user SET active =$1  WHERE username = $2';
    const queryValues = [false, userData.username];
    const results = await connection.query(queryText, queryValues);
    let { id, username, access_level } = results.rows[0];
    return { id, username, access_level };
  } finally {
    // Make sure to release the client before any error handling,
    // just in case the error handling itself throws an error.
    connection.release();
  }
};

const queryUserModel = async () => {
  const connection = await pool.connect();
  try {
    const queryText = `SELECT a.id, a.username, a.access_level, b.firstname, b.lastname, b.email
        FROM sstm_user a left outer join sstm_user_detail b
        on a.id = b.id`;
    const results = await connection.query(queryText);
    return { ...results.rows };
  } catch (error) {
    throw error;
  } finally {
    // Make sure to release the client before any error handling,
    // just in case the error handling itself throws an error.
    connection.release();
  }
};

const queryOneUserModel = async (userData) => {
  let { username } = userData;

  const connection = await pool.connect();
  try {
    const queryText = `SELECT a.id, a.username, a.access_level, b.firstname, b.lastname, b.email
      FROM sstm_user a left outer join sstm_user_detail b
      on a.id = b.id
      WHERE a.username = $1`;

    const results = await connection.query(queryText, [username]);
    return results.rows[0];
  } catch (error) {
    throw error;
  } finally {
    // Make sure to release the client before any error handling,
    // just in case the error handling itself throws an error.
    connection.release();
  }
};

module.exports = {
  createUserModel,
  loginUserModel,
  updateUserModel,
  deactivateUserModel,
  queryUserModel,
  queryOneUserModel,
};
