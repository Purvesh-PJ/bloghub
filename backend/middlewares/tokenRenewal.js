const jwt = require('jsonwebtoken');
const SecretKey =
  "#hfgdfgreaer@%$#$dasdada^#$^$fasf238%$&56765867*^&*^$%#@$97..,r3qfdd.,;l,'lw3%#$%#$53453423$@!";

exports.tokenRenewal = (req, res, next) => {
  // console.log(req.headers);

  const authToken = req.header('authorization');

  if (!authToken) {
    return next();
  }

  const token = authToken.split(' ')[1];
  console.log('tokenRenewalMiddleware ', token);

  // Verify token
  jwt.verify(token, SecretKey, (err, decoded) => {
    if (err) {
      return next();
    }
    const tokenExpirationTime = decoded.exp * 1000; // token expiration time
    const currentTime = Date.now(); // curtrent time
    const renewalThershould = 5 * 60 * 1000; // 5 minutes

    if (tokenExpirationTime - currentTime < renewalThershould) {
      // renew token
      const newToken = jwt.sign({ userId: decoded.userId }, SecretKey, { expiresIn: '1h' });
      console.log('Renewed Token : ', newToken);
      res.json({ RenewToken: newToken });
    } else {
      next();
    }
  });
};
