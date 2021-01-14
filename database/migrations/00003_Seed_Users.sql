INSERT INTO bd_users ("email", "firstname", "lastname", "password", "emailconfirmed", "createdat")
  VALUES
  ('samuel@gmail.com', 'Samuel', 'Adekunle',
    '$argon2i$v=19$m=16,t=2,p=1$dFVFVzJiUkJCZEN3QUFBUA$z9R0/1CRHuH5PksLolXnwg', /* samade */
    true, NOW()),
  ('eze@gmail.com', 'Eze', 'Kelly',
    '$argon2i$v=19$m=16,t=2,p=1$dFVFVzJiUkJCZEN3QUFBUA$gC7Rdtg2KlD5PethEtaa+g', /* ezekelly */
    true, NOW()),
  ('damilola@gmail.com', 'Damilola', 'Adedeji',
    '$argon2i$v=19$m=16,t=2,p=1$dFVFVzJiUkJCZEN3QUFBUA$yaplKcv5cbszlrB5ALjclg', /* adedeji2 */
    true, NOW()),
  ('temilola@gmail.com', 'Temilola', 'Adedeji',
    '$argon2i$v=19$m=16,t=2,p=1$dFVFVzJiUkJCZEN3QUFBUA$ZF1n/NP9O2xdFCX/dLElTg', /* temitee1 */
    default, NOW()),
  ('kingsley@gmail.com', 'Kingsley', 'Clement',
    '$argon2i$v=19$m=16,t=2,p=1$dFVFVzJiUkJCZEN3QUFBUA$x9Uf/Soi45ro9aUCtNbeSA', /* clementking */
    default, NOW())
