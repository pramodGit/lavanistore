// Get login info by username
export const GET_USER_LOGIN_BY_USERNAME = `
  SELECT UserID, UserName, UserPassword, RegistrationID
  FROM user_login
  WHERE UserName = ?
`;

// Get login info by UserID
export const GET_USER_LOGIN_BY_ID = `
  SELECT UserID, UserName, UserPassword, RegistrationID
  FROM user_login
  WHERE UserID = ?
`;

// Get registration info by RegistrationID
export const GET_USER_REGISTRATION_BY_ID = `
  SELECT 
    RegistrationID, 
    \`First Name\`, 
    \`Middle Name\`, 
    \`Last Name\`, 
    \`Mobile No\`, 
    EmailID, 
    SponserShipID, 
    CreatedDate
  FROM user_registration_basic
  WHERE RegistrationID = ?
`;

// Get all users sponsored by a given username
export const GET_TEAM_MEMBERS_BY_SPONSOR = `
  SELECT 
    ub.RegistrationID,
    ul.UserName AS userName,
    ub.\`First Name\` AS FirstName,
    ub.\`Last Name\` AS LastName,
    ub.\`Mobile No\` AS mobile,
    ub.EmailID AS email,
    ub.CreatedDate AS registrationDate,
    gl.Green_DateTime AS activationDate,
    CASE 
      WHEN gl.IsGreen = 'Yes' AND gl.IsActive = 'Yes' THEN 'Active'
      ELSE 'Inactive'
    END AS status
  FROM user_registration_basic AS ub
  LEFT JOIN user_login AS ul 
    ON ub.RegistrationID = ul.RegistrationID
  LEFT JOIN Green_User_List AS gl 
    ON ul.UserName = gl.UserName
  WHERE ub.SponserShipID = ?
  ORDER BY ub.CreatedDate DESC;
`;



