// TO DO
// login: (req, res) => {
//   get_user_by_account_login(req.body.user_login, (err, results) => {
//     if (err) {
//       console.log(err);
//       return error_500s(500, err, res);
//     }
//     if (!results) {
//       return error_400s(
//         401,
//         res,
//         "this user login doesnot exist, please try again"
//       );
//     }
//     const result = compareSync(body.password, results.password);
//     if (result) {
//       results.password = undefined;
//       const jsontoken = sign({ result: results }, secretKey, {
//         expiresIn: token_duration,
//       });
//       return res.status(200).json({
//         success: true,
//         message: "Login successfull",
//         token: jsontoken,
//         account_id:
//       });
//     } else {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }
//   });
// },
