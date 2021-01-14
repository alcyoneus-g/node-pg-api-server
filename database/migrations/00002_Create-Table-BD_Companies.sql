CREATE TABLE IF NOT EXISTS BD_Clients (
  CustomerNumber CHAR(6),
  Logo VARCHAR(1024),
  Name VARCHAR(128),
  Addition VARCHAR(128),
  Street VARCHAR(128),
  PostalCode VARCHAR(8),
  Location VARCHAR(64),
  Country CHAR(2),
  Email VARCHAR(64),
  Phone VarChar(15),
  VatId VARCHAR(20),
  Active BOOLEAN NOT NULL DEFAULT TRUE,

  PRIMARY KEY (CustomerNumber)
)

